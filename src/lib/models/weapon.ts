import type { Item } from '$lib/types/graphql';

type FireMode = 'Single fire' | 'Full Auto';

interface DefaultPreset {
	id: string;
	name: string;
	image512pxLink: string;
}

interface ItemPropertiesWeapon {
	__typename: string;
	caliber: string;
	fireModes: FireMode[];
	fireRate: number;
	defaultPreset: DefaultPreset;
}

export interface Weapon extends Item<ItemPropertiesWeapon> {}

export class Weapon {
	constructor(args: Partial<Item<ItemPropertiesWeapon>>) {
		Object.assign(this, args || {});
	}
}
