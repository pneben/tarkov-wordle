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
		totalGuesses: 0,
		won: false,
		imgSrc: undefined,
		pixelate: 3
	}
};

export function getUserInformation(cookieData?: string): CookieData {
	let userData: CookieData = defaults;
	let isData: CookieData | null = null;

	try {
		isData = verifyJwtToken<CookieData>(cookieData);
	} catch (e) {
		logger.warn(`Couldn't get JWT Data`, e);
	}

	userData = { ...userData, ...isData };
	if (!userData.userId) {
		userData.userId = generateUserId();
		logger.log('New User', userData);
	}
	return userData;
}
