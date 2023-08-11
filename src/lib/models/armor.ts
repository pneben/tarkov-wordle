import type { Item } from '$lib/types/graphql';
type ArmorMaterial = {
	id: string;
	name: string;
};

type ArmorZone = 'left arm' | 'right arm' | 'thorax' | 'stomach' | string;

type ItemPropertiesArmor = {
	__typename: 'ItemPropertiesArmor';
	durability: number;
	class: number;
	zones: ArmorZone[];
	material: ArmorMaterial;
};

export interface Armor extends Item<ItemPropertiesArmor> {}

export class Armor {
	constructor(args: Partial<Item<ItemPropertiesArmor>>) {
		Object.assign(this, args || {});
	}
}
