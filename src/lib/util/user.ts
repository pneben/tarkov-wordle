export function generateUserId() {
	const timestamp: number = Date.now();
	const randomPart: number = Math.floor(Math.random() * 10000);
	return `${timestamp}-${randomPart}`;
}
