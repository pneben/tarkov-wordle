import type { GraphQlResponse, Item } from '$lib/types/graphql';
import type { ResultDataItem } from '$lib/types/tarkovle';
import { createJwtToken, verifyJwtToken } from '$lib/util/jwt';
import request, { gql } from 'graphql-request';
import Jimp from 'jimp';

let searchedItem: Item<null>;

const DEFAULT_PIXELATION = 3 as const;

const pixelateImage = async (id: string, strength: number): Promise<string> => {
	return new Promise((resolve) => {
		Jimp.read(`https://assets.tarkov.dev/${id}-grid-image.jpg`, (err, img) => {
			if (err) throw new Error('Could not load image');
			img.scale(img.getHeight() > 100 ? 2 : 3);
			if (strength > 0) {
				img.pixelate(Math.floor(Math.min(img.getHeight(), img.getWidth()) / strength));
			}
			img.getBase64(Jimp.AUTO, (err, res) => {
				if (err) throw err;

				resolve(res);
			});
		});
	});
};

/** @type {PageServerLoad} */
export async function load({ cookies }) {
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

	searchedItem = result.items[Math.floor(Math.random() * result.items.length)];

	const base64 = await pixelateImage(searchedItem.id, DEFAULT_PIXELATION).catch((e) => {
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
	select: async ({ request, cookies }): Promise<ResultDataItem | false> => {
		const id = (await request.formData()).get('id');

		const userData = verifyJwtToken<Partial<ResultDataItem>>(cookies.get('dataItem'));

		const correct = id === searchedItem.id;

		const base64 = await pixelateImage(
			searchedItem.id,
			correct ? 0 : (userData?.pixelate || DEFAULT_PIXELATION) + 3
		).catch((e) => {
			throw new Error(e);
		});

		const { token } = createJwtToken<Partial<ResultDataItem>>({
			won: correct,
			totalGuesses: userData?.totalGuesses ? userData.totalGuesses + 1 : 1,
			item: correct ? searchedItem : undefined,
			pixelate: !correct ? (userData?.pixelate || DEFAULT_PIXELATION) + 3 : DEFAULT_PIXELATION
		});

		if (token) {
			cookies.set('dataItem', token);
		}

		if (correct) {
			return {
				imgSrc: base64,
				totalGuesses: (userData?.totalGuesses || 0) + 1,
				won: true,
				item: searchedItem
			};
		}

		return {
			imgSrc: base64,
			totalGuesses: (userData?.totalGuesses || 0) + 1,
			won: false
		};
	}
};