import type { Armor } from '$lib/models/armor';
import type { Item } from './graphql';

export type ResultPointVariant = 'false' | 'true' | 'higher' | 'lower' | 'partial-true';

export interface DataPoint {
	label: string;
	value: string;
	variant: ResultPointVariant;
}

export interface ResultItemData {
	id: string;
	name: string;
}

export interface ResultData {
	won: boolean;
	totalGuesses: number;
	item: ResultItemData;
	dataPoints: DataPoint[];
	streak: number;
}

export interface CookieData {
	userId?: string;
	weapon: Partial<ResultData>;
	armor: Partial<ResultData>;
	item: Partial<ResultDataItem>;
}

export type DataPointInfo<T> = {
	label: string;
	type: string;
	value: (obj: T) => string | string[] | number | undefined;
	format?: (val: string | string[] | number | undefined, object: T) => string;
};

export type ResultDataItem = {
	won: boolean;
	imgSrc: string;
	totalGuesses: number;
	pixelate?: number;
	item?: Item<null>;
	streak?: number;
};
