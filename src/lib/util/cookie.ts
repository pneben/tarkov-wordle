import { Logger } from '$lib/Logger';
import type { CookieData } from '$lib/types/tarkovle';
import { verifyJwtToken } from './jwt';
import { generateUserId } from './user';

const logger = new Logger('util/cookie');

const defaults: CookieData = {
	userId: undefined,
	armor: {
		dataPoints: [],
		totalGuesses: 0,
		won: false
	},
	weapon: {
		dataPoints: [],
		totalGuesses: 0,
		won: false
	},
	item: {
		dataPoints: [],
		totalGuesses: 0,
		won: false
	}
};

export function getUserInformation(cookieData?: string): CookieData {
	let userData: CookieData = defaults;
	let isData: CookieData | null = null;

	try {
		isData = verifyJwtToken<CookieData>(cookieData);
	} catch (e) {
		console.warn(e);
	}

	userData = { ...userData, ...isData };
	if (!userData.userId) {
		userData.userId = generateUserId();
		logger.log('New User', userData);
	}
	return userData;
}
