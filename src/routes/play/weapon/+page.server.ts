import { request, gql } from 'graphql-request';
import type { GraphQlResponse } from '$lib/types/graphql';
import type { Armor } from '$lib/models/armor';
import type { DataPointInfo, ResultData } from '$lib/types/tarkovle.js';
import { createJwtToken, verifyJwtToken } from '$lib/util/jwt';
import { generateDataPoints } from '$lib/util/datapoints.js';
import type { Weapon } from '$lib/models/weapon.js';
import { getCaliberName } from '$lib/util/ammo';

let weapons: Weapon[];
let searchedWeapon: Weapon;

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

/** @type {PageServerLoad} */
export async function load({ cookies }) {
	cookies.delete('data');
	const userData = verifyJwtToken<ResultData>(cookies.get('data'));

	if (userData?.won) {
		return {
			isWon: userData.won,
			item: userData.item,
			dataPoints: userData.dataPoints,
			totalGuesses: userData.totalGuesses,
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

	weapons = result.items.filter(
		(x) => x.types.indexOf('preset') === -1 && !x.shortName.includes('Default')
	);
	searchedWeapon = weapons[Math.floor(Math.random() * weapons.length)];

	return {
		weapons: result
	};
}

export const actions = {
	select: async ({ request, cookies }): Promise<ResultData | false> => {
		const id = (await request.formData()).get('id');
		const weapon = weapons.find((x) => x.id === id);
		if (!weapon) return false;

		let isWon = false;

		const dataPoints = generateDataPoints<Weapon>(dataPointInfo, weapon, searchedWeapon);

		/**
		 * In case a Item is guessed, which has the correct specifications, but has a similar ID
		 * -> It should still count as a win
		 */
		if (dataPoints.filter((x) => x.variant === 'true').length === dataPoints.length) {
			isWon = true;
		}

		const userData = verifyJwtToken<Partial<ResultData>>(cookies.get('data'));

		const { token } = createJwtToken<Partial<ResultData>>({
			won: isWon,
			totalGuesses: userData?.totalGuesses ? userData.totalGuesses + 1 : 1,
			dataPoints,
			item: {
				id: weapon.id,
				name: weapon.name
			}
		});

		if (token) {
			cookies.set('data', token);
		}

		return {
			won: isWon,
			totalGuesses: userData?.totalGuesses ? userData.totalGuesses + 1 : 1,
			item: {
				id: weapon.properties?.defaultPreset?.id || weapon.id,
				name: weapon.shortName
			},
			dataPoints
		};
	}
};
