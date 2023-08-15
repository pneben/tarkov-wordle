import { request, gql } from 'graphql-request';
import type { GraphQlResponse } from '$lib/types/graphql';
import type {
	CookieData,
	DataPoint,
	DataPointInfo,
	ResultData,
	ResultItemData
} from '$lib/types/tarkovle.js';
import { createJwtToken } from '$lib/util/jwt';
import { generateDataPoints } from '$lib/util/datapoints.js';
import type { Weapon } from '$lib/models/weapon.js';
import { getCaliberName } from '$lib/util/ammo';
import { Logger } from '$lib/Logger';
import { error } from '@sveltejs/kit';

const logger = new Logger('play/weapon/server');

let weapons: Weapon[];
const searchedWeapons: Record<string, Weapon> = {};

const dataPointInfo: DataPointInfo<Weapon>[] = [
	{
		label: 'Type',
		type: 'string',
		value: (obj) => {
			return obj.category.name;
		}
	},
	{
		label: 'Caliber',
		type: 'string',
		value: (obj) => {
			return obj.properties.caliber;
		},
		format: (val) => {
			if (typeof val === 'string') {
				return getCaliberName(val) || 'None';
			}
			return 'None';
		}
	},
	{
		label: 'Fire Rate',
		type: 'number',
		value: (obj) => {
			return obj.properties.fireRate;
		}
	},
	{
		label: 'Fire Modes',
		type: 'array',
		value: (obj) => {
			return obj.properties.fireModes;
		},
		format: (val) => {
			if (Array.isArray(val)) {
				return val.join(', ') || 'None';
			}
			return 'None';
		}
	},

	{
		label: 'Trader',
		type: 'array',
		value: (object) => {
			return object.buyFor.map((x) => x.vendor.name);
		},
		format: (val) => {
			if (Array.isArray(val)) {
				return val.join(', ') || 'None';
			}
			return 'None';
		}
	}
];

const createSearchedWeapon = (userId?: string) => {
	if (userId) {
		searchedWeapons[userId] = weapons[Math.floor(Math.random() * weapons.length)];
		return searchedWeapons[userId];
	}
	return undefined;
};

const getSearchedWeapon = (userId?: string) => {
	if (userId) {
		return searchedWeapons[userId];
	}
	return undefined;
};

/** @type {PageServerLoad} */
export async function load({ locals }): Promise<{
	isWon?: true;
	item?: ResultItemData | undefined;
	dataPoints?: DataPoint[] | undefined;
	totalGuesses?: number | undefined;
	weapons?: {
		items: Weapon[];
	};
}> {
	if (locals.user.weapon.won) {
		return {
			isWon: locals.user.weapon.won,
			item: locals.user.weapon.item,
			dataPoints: locals.user.weapon.dataPoints,
			totalGuesses: locals.user.weapon.totalGuesses,
			weapons: { items: [] }
		};
	}

	const query = gql`
		{
			items(categoryNames: [Weapon], type: gun) {
				id
				shortName
				name
				image512pxLink
				types
				buyFor {
					priceRUB
					price
					vendor {
						name
						normalizedName
					}
				}
				category {
					name
				}
				properties {
					__typename
					... on ItemPropertiesWeapon {
						caliber
						fireModes
						fireRate
						defaultPreset {
							id
							name
							image512pxLink
						}
					}
				}
			}
		}
	`;

	const result = await request<GraphQlResponse<Weapon, 'items'>>(
		'https://api.tarkov.dev/graphql',
		query
	);

	if (result) {
		weapons = result.items.filter(
			(x) => x.types.indexOf('preset') === -1 && !x.shortName.includes('Default')
		);

		if (locals.user.userId) {
			createSearchedWeapon(locals.user.userId);
		}
	} else {
		logger.error('Could not load Weapons from GraphQL', { query });
	}

	return {
		weapons: result
	};
}

/** @type {import('./$types').Actions} */
export const actions = {
	select: async ({ request, cookies, locals }): Promise<ResultData | false> => {
		const id = (await request.formData()).get('id');
		const weapon = weapons.find((x) => x.id === id);
		if (!weapon) return false;

		let isWon = false;

		const shouldWeapon = getSearchedWeapon(locals.user.userId);

		if (!shouldWeapon) {
			logger.warn('Could not find weapon', { searchedWeapons, userId: locals.user.userId });
			throw error(404, { message: 'Could not find weapon' });
		}

		const dataPoints = generateDataPoints<Weapon>(dataPointInfo, weapon, shouldWeapon);

		/**
		 * In case a Item is guessed, which has the correct specifications, but has a similar ID
		 * -> It should still count as a win
		 */
		if (dataPoints.filter((x) => x.variant === 'true').length === dataPoints.length) {
			isWon = true;
			logger.log(`User ${locals.user.userId} has won. Item was ${weapon.name}`);
		}

		const { token } = createJwtToken<CookieData>({
			...locals.user,
			weapon: {
				won: isWon,
				totalGuesses: locals.user.weapon.totalGuesses ? locals.user.weapon.totalGuesses + 1 : 1,
				dataPoints,
				item: {
					id: weapon.properties?.defaultPreset?.id || weapon.id,
					name: weapon.name
				}
			}
		});

		if (token) {
			cookies.set('user', token);
		}

		return {
			won: isWon,
			totalGuesses: locals.user.weapon.totalGuesses ? locals.user.weapon.totalGuesses + 1 : 1,
			item: {
				id: weapon.properties?.defaultPreset?.id || weapon.id,
				name: weapon.shortName
			},
			dataPoints
		};
	}
};
