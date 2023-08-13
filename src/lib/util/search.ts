export class FuzzySearch<T> {
	private static fuzzyMatch(str: string, query: string): boolean {
		const strLower = str.toLowerCase();
		const queryLower = query.toLowerCase();
		let queryIndex = 0;

		for (let i = 0; i < strLower.length; i++) {
			if (strLower[i] === queryLower[queryIndex]) {
				queryIndex++;
				if (queryIndex === queryLower.length) {
					return true;
				}
			}
		}

		return false;
	}

	private static fuzzyScore(str: string, query: string): number {
		const strLower = str.toLowerCase();
		const queryLower = query.toLowerCase();
		let score = 0;
		let strIndex = 0;

		const strLength = strLower.length;
		const queryLength = queryLower.length;

		for (let i = 0; i < queryLength; i++) {
			const char = queryLower[i];

			while (strIndex < strLength && strLower[strIndex] !== char) {
				strIndex++;
			}

			if (strIndex < strLength && strLower[strIndex] === char) {
				score++;
				strIndex++;
			}
		}

		return score;
	}

	private data: T[];

	constructor(data: T[]) {
		this.data = data;
	}

	search(query: string, propertyKeys: (keyof T)[]): T[] {
		const resultsWithScore: { item: T; score: number }[] = [];

		this.data.forEach((item) => {
			let maxScore = 0;

			propertyKeys.forEach((key) => {
				if (item[key] && typeof item[key] === 'string') {
					const score = FuzzySearch.fuzzyScore(item[key] as string, query);
					if (score > maxScore) {
						maxScore = score;
					}
				}
			});

			if (maxScore > 0) {
				resultsWithScore.push({ item, score: maxScore });
			}
		});

		resultsWithScore.sort((a, b) => b.score - a.score);

		return resultsWithScore.map((result) => result.item);
	}
}
