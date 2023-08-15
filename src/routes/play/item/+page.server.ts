import { Logger } from '$lib/Logger';
import type { GraphQlResponse, Item } from '$lib/types/graphql';
import type { CookieData, ResultDataItem } from '$lib/types/tarkovle';
import { createJwtToken, verifyJwtToken } from '$lib/util/jwt';
import request, { gql } from 'graphql-request';
import Jimp from 'jimp';

const logger = new Logger('play/item/server');

const searchedItems: Record<string, Item<null>> = {};

const DEFAULT_PIXELATION = 3 as const;

let items: Item<null>[] = [];

const pixelateImage = async (id: string, strength: number): Promise<string> => {
	return new Promise((resolve) => {
		Jimp.read(`https://assets.tarkov.dev/${id}-grid-image.jpg`, (err, img) => {
			if (err) {
				logger.error('Could not get Image', err);
			}
			img.scale(img.getHeight() > 100 ? 2 : 3);
			if (strength > 0) {
				img.pixelate(Math.floor(Math.min(img.getHeight(), img.getWidth()) / strength));
			}
			img.getBase64(Jimp.AUTO, (err, res) => {
				if (err) {
					logger.error('Could not get Base64 Image', err);
				}

				resolve(res);
			});
		});
	});
};

const getSearchedItem = (userId?: string) => {
	if (userId) {
		return searchedItems[userId];
	}
	return undefined;
};

const createSearchedItem = (userId?: string) => {
	if (userId) {
		const recentArmor = getSearchedItem(userId);
		if (recentArmor) {
			searchedItems[userId] = [...items].filter((x) => x.id !== recentArmor.id)[
				Math.floor(Math.random() * items.length)
			];
		} else {
			searchedItems[userId] = items[Math.floor(Math.random() * items.length)];
		}
		return searchedItems[userId];
	}
	return undefined;
};

/** @type {PageServerLoad} */
export async function load({ cookies, locals }) {
	const userData = verifyJwtToken<Partial<ResultDataItem>>(cookies.get('dataItem'));

	const { token } = createJwtToken<Partial<ResultDataItem>>({
		won: false,
		totalGuesses: 0,
		pixelate: DEFAULT_PIXELATION
	});

	if (token) {
		cookies.set('dataItem', token);
	}

	const query = gql`
		{
			items(categoryNames: [BarterItem]) {
				shortName
				name
				id
			}
		}
	`;

	const result = await request<GraphQlResponse<Item<null>, 'items'>>(
		'https://api.tarkov.dev/graphql',
		query
	);

	if (result) {
		items = result.items;

		if (locals.user.userId) {
			createSearchedItem(locals.user.userId);
		}
	} else {
		logger.error('Could not load Armors from GraphQL', { query });
	}

	const base64 = await pixelateImage(
		getSearchedItem(locals.user.userId)?.id || '',
		DEFAULT_PIXELATION
	).catch((e) => {
		throw new Error(e);
	});

	return {
		imgSrc: base64,
		items: result,
		totalGuesses: userData?.totalGuesses
	};
}

/** @type {import('./$types').Actions} */
export const actions = {
	select: async ({ request, cookies, locals }): Promise<ResultDataItem | false> => {
		const id = (await request.formData()).get('id');

		const searchedItem = getSearchedItem(locals.user.userId);

		if (!searchedItem) {
			return {
				imgSrc: '',
				totalGuesses: (locals.user.item.totalGuesses || 0) + 1,
				won: false
			};
		}

		const correct = id === searchedItem.id;

		const base64 = await pixelateImage(
			searchedItem.id,
			correct ? 0 : (locals.user.item.pixelate || DEFAULT_PIXELATION) + 3
		).catch((e) => {
			throw new Error(e);
		});

		const { token } = createJwtToken<CookieData>({
			...locals.user,
			item: {
				won: correct,
				totalGuesses: locals.user.item.totalGuesses ? locals.user.item.totalGuesses + 1 : 1,
				item: correct ? searchedItem : undefined,
				pixelate: !correct
					? (locals.user.item.pixelate || DEFAULT_PIXELATION) + 3
					: DEFAULT_PIXELATION
			}
		});

		if (token) {
			cookies.set('user', token);
		}

		if (correct) {
			logger.log(`User ${locals.user.userId} has won. Item was ${searchedItem.name}`);
			return {
				imgSrc: base64,
				totalGuesses: (locals.user.item.totalGuesses || 0) + 1,
				won: true,
				item: searchedItem
			};
		}

		return {
			imgSrc: base64,
			totalGuesses: (locals.user.item.totalGuesses || 0) + 1,
			won: false
		};
	}
};
