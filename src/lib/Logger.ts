export class Logger {
	loggerName: string | undefined;
	constructor(loggerName: string) {
		this.loggerName = loggerName;
	}
	log(msg?: string, obj?: object): void {
		console.log(
			'\x1b[32m[%s]\x1b[32m %s [LOG]\t%s\x1b[0m',
			this.loggerName,
			new Date().toISOString(),
			msg || ''
		);
		if (obj) {
			console.dir(obj);
		}
	}

	error(msg?: string, obj?: object): void {
		console.log(
			'\x1b[32m[%s]\x1b[41m %s [ERROR]\t%s\x1b[0m',
			this.loggerName,
			new Date().toISOString(),
			msg || ''
		);
		if (obj) {
			console.dir(obj);
		}
		console.trace();
	}

	warn(msg?: string, obj?: object): void {
		console.log(
			'\x1b[32m[%s]\x1b[33m %s [WARN]\t%s\x1b[0m',
			this.loggerName,
			new Date().toISOString(),
			msg || ''
		);
		if (obj) {
			console.dir(obj);
		}
	}
}
