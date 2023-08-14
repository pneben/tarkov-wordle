// See https://kit.svelte.dev/docs/types#app

import type { CookieData } from '$lib/types/tarkovle';

// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			user: CookieData;
		}
		// interface PageData {}
		// interface Platform {}
	}
}

export {};
