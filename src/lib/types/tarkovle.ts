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
