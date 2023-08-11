import jwt from 'jsonwebtoken';

export const createJwtToken = <T>(data: T) => {
	let token: string | undefined;

	if (data !== null && data !== undefined) {
		token = jwt.sign(data, import.meta.env.VITE_JWT_SECRET);
	}

	return { token };
};

export const verifyJwtToken = <T>(token?: string): T | null => {
	if (!token) return null;
	const data = jwt.verify(token, import.meta.env.VITE_JWT_SECRET) as T;

	return data;
};
