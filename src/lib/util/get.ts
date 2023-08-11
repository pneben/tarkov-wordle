export function get(obj: any, props: string[]): any {
	return obj && props.reduce((result, prop) => (result == null ? undefined : result[prop]), obj);
}
