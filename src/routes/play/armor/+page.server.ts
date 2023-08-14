import { request, gql } from 'graphql-request';
import type { GraphQlResponse } from '$lib/types/graphql';
import type { Armor } from '$lib/models/armor';
import type { DataPointInfo, ResultData } from '$lib/types/tarkovle.js';
import { createJwtToken, verifyJwtToken } from '$lib/util/jwt';
import { generateDataPoints } from '$lib/util/datapoints.js';
import { Logger } from '$lib/Logger';
import { ActionFailure } from '@sveltejs/kit';

const logger = new Logger('play/armor/server');

let armors: Armor[];

const searchedArmors: Record<string, Armor> = {};

const dataPointInfo: DataPointInfo<Armor>[] = [
	{
		label: 'Class',
		type: 'number',
		value: (obj) => {
			return obj.properties.class;
		}
	},
	{
		label: 'Durability',
		type: 'number',
		value: (obj) => {
			return obj.properties.durability;
		}
	},
	{
		label: 'Material',
		type: 'string',
		value: (obj) => {
			return obj.properties.material.name;
		}
	},
	{
		label: 'Price',
		type: 'number',
		value: (obj) => {
			return obj.buyFor.filter((x) => x.vendor.name !== 'Flea Market').length
				? obj.buyFor.filter((x) => x.vendor.name !== 'Flea Market')[0].priceRUB
				: undefined;
		},
		format: (val) => {
			if (!val) return 'No Price';
			return val.toLocaleString('en-US', {
				style: 'currency',
				currency: 'RUB',
				currencyDisplay: 'narrowSymbol',
				minimumFractionDigits: 0,
				maximumFractionDigits: 0
			});
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

const createSearchedArmor = (userId?: string) => {
	if (userId) {
		searchedArmors[userId] = armors[Math.floor(Math.random() * armors.length)];
		return searchedArmors[userId];
	}
	return undefined;
};

const getSearchedArmor = (userId?: string) => {
	if (userId) {
		return searchedArmors[userId];
	}
	return undefined;
};

/** @type {PageServerLoad} */
export async function load({ cookies, locals }) {
	cookies.delete('dataArmor');
	const userData = verifyJwtToken<ResultData>(cookies.get('dataArmor'));

	if (userData?.won) {
		return {
			isWon: userData.won,
			item: userData.item,
			dataPoints: userData.dataPoints,
			totalGuesses: userData.totalGuesses,
			armors: { items: [] }
		};
	}

	const query = gql`
		{
			items(categoryNames: [Armor]) {
				id
				name
				shortName
				basePrice
				image512pxLink
				buyFor {
					priceRUB
					price
					vendor {
						name
						normalizedName
					}
				}
				properties {
					__typename
					... on ItemPropertiesArmor {
						durability
						class
						zones
						material {
							id
							name
						}
					}
				}
			}
		}
	`;

	const result = await request<GraphQlResponse<Armor, 'items'>>(
		'https://api.tarkov.dev/graphql',
		query
	);

	if (result) {
		armors = result.items;

		if (locals.user.userId) {
			createSearchedArmor(locals.user.userId);
		}
	} else {
		logger.error('Could not load Weapons from GraphQL', { query });
	}

	return {
		armors: result
	};
}

/** @type {import('./$types').Actions} */
export const actions = {
	select: async ({ request, cookies, locals }): Promise<ResultData | false> => {
		const id = (await request.formData()).get('id');
		const armor = armors.find((x) => x.id === id);
		if (!armor) return false;

		let isWon = false;

		const shouldArmor = getSearchedArmor(locals.user.userId);

		if (!shouldArmor) {
			logger.warn('Could not find weapon', { shouldArmor, userId: locals.user.userId });
			throw new ActionFailure(404, { message: 'Could not find weapon' });
		}

		const dataPoints = generateDataPoints<Armor>(dataPointInfo, armor, shouldArmor);

		/**
		 * In case a Item is guessed, which has the correct specifications, but has a similar ID
		 * -> It should still count as a win
		 */
		if (dataPoints.filter((x) => x.variant === 'true').length === dataPoints.length) {
			isWon = true;
		}

		const userData = verifyJwtToken<Partial<ResultData>>(cookies.get('dataArmor'));

		const { token } = createJwtToken<Partial<ResultData>>({
			won: isWon,
			totalGuesses: userData?.totalGuesses ? userData.totalGuesses + 1 : 1,
			dataPoints,
			item: {
				id: armor.id,
				name: armor.name
			}
		});

		if (token) {
			cookies.set('dataArmor', token);
		}

		return {
			won: isWon,
			totalGuesses: userData?.totalGuesses ? userData.totalGuesses + 1 : 1,
			item: {
				id: armor.id,
				name: armor.shortName
			},
			dataPoints
		};
	}
};
