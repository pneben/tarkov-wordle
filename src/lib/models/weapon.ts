import type { Item } from '$lib/types/graphql';

interface ItemPropertiesWeapon {
	__typename: string;
	caliber: string;
	fireRate: number;
	fireModes: string[];
}

export interface Weapon extends Item<ItemPropertiesWeapon> {}

export class Weapon {
	constructor(args: Partial<Item<ItemPropertiesWeapon>>) {
		Object.assign(this, args || {});
	}
}
