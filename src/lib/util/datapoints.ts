import type { DataPoint, DataPointInfo, ResultPointVariant } from '$lib/types/tarkovle';

export function generateDataPoints<T>(dataPointInfo: DataPointInfo<T>[], isObj: T, shouldObj: T) {
	return dataPointInfo.map<DataPoint>((info) => {
		const isVal = info.value(isObj);
		const shouldVal = info.value(shouldObj);
		let variant: ResultPointVariant = 'false';
		const value = info.format ? info.format(isVal, isObj) : `${isVal}`;
		switch (info.type) {
			case 'number':
				if (isVal === shouldVal) variant = 'true';
				if (isVal && shouldVal) {
					if (isVal > shouldVal) variant = 'lower';
					if (isVal < shouldVal) variant = 'higher';
				}
				break;
			case 'string':
				if (isVal === shouldVal) variant = 'true';
				break;

			case 'array':
				if (Array.isArray(isVal) && Array.isArray(shouldVal)) {
					let allMatch = true;
					let someMatch = false;

					if (isVal.length !== shouldVal.length) {
						allMatch = false;
					}

					for (let i = 0; i < shouldVal.length; i++) {
						if (isVal.find((x) => x === shouldVal[i])) {
							someMatch = true;
						} else {
							allMatch = false;
						}
					}

					if (allMatch) {
						variant = 'true';
					} else if (someMatch) {
						variant = 'partial-true';
					}
				}
				break;
		}

		return {
			label: info.label,
			value,
			variant
		};
	});
}
