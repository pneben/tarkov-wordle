export type GraphQlResponse<TItem, TItemType extends 'maps' | 'items'> = {
	[key in TItemType]: TItem[];
};

export interface Item<T> {
	id: string;
	name: string;
	shortName: string;
	basePrice: number;
	buyFor: ItemPrice[];
	image512pxLink: string;
	properties: T;
}

export type Vendor = {
	name: string;
	normalizedName: string;
};

export type ItemPrice = {
	priceRUB: number;
	price: number;
	vendor: Vendor;
};
