import type { Armor } from '$lib/models/armor';

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
}

export type DataPointInfo<T> = {
	label: string;
	type: string;
	value: (obj: T) => string | string[] | number | undefined;
	format?: (val: string | string[] | number | undefined, object: T) => string;
};
