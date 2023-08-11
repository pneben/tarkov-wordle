import { request, gql } from 'graphql-request';
import '../lib/models/weapon';
import type { GraphQlResponse } from '../lib/types/graphql';
import type { Weapon } from '../lib/models/weapon';

/** @type {PageServerLoad} */
export async function load() {
	const query = gql`
		{
			items(categoryNames: [Weapon], limit: 5) {
				id
				name
				shortName
				properties {
					__typename
					... on ItemPropertiesWeapon {
						caliber
						fireRate
						fireModes
					}
				}
			}
		}
	`;

	const weapons = await request<GraphQlResponse<Weapon, 'items'>>(
		'https://api.tarkov.dev/graphql',
		query
	);

	return {
		weapons
	};
}
