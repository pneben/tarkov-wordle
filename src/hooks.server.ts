import type { CookieData } from '$lib/types/tarkovle';
import { getUserInformation } from '$lib/util/cookie';
import { createJwtToken, verifyJwtToken } from '$lib/util/jwt';
import { generateUserId } from '$lib/util/user';

const defaults: CookieData = {
	userId: undefined,
	armor: {
		dataPoints: [],
		totalGuesses: 0,
		won: false,
		item: undefined
	},
	weapon: {
		dataPoints: [],
		totalGuesses: 0,
		won: false,
		item: undefined
	},
	item: {
		dataPoints: [],
		totalGuesses: 0,
		won: false,
		item: undefined
	}
};

/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ event, resolve }) {
	const cookieData = event.cookies.get('user');

	event.locals.user = getUserInformation(cookieData);

	const { token } = createJwtToken<CookieData>(event.locals.user);

	if (token) {
		event.cookies.set('user', token);
	}

	const response = await resolve(event);

	return response;
}
