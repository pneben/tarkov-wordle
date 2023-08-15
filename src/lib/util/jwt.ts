import jwt from 'jsonwebtoken';
import { env } from '$env/dynamic/private';

export const createJwtToken = <T>(data: T) => {
	let token: string | undefined;

	if (data !== null && data !== undefined) {
		if (!env.SECRET_JWT) {
			throw new Error('No SECRET_JWT set');
		}
		token = jwt.sign(data, env.SECRET_JWT);
	}

	return { token };
};

export const verifyJwtToken = <T>(token?: string): T | null => {
	if (!token) return null;
	if (!env.SECRET_JWT) {
		throw new Error('No SECRET_JWT set');
	}
	try {
		const data = jwt.verify(token, env.SECRET_JWT) as T;

		return data;
	} catch (e) {
		throw new Error('Could not verify JWT');
	}
};
