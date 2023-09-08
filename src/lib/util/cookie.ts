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
		won: false,
		streak: 0
	},
	weapon: {
		dataPoints: [],
		totalGuesses: 0,
		won: false,
		streak: 0
	},
	item: {
		totalGuesses: 0,
		won: false,
		imgSrc: undefined,
		pixelate: 3,
		streak: 0
	}
};

export function getUserInformation(cookieData?: string): CookieData {
	let userData = defaults;
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
