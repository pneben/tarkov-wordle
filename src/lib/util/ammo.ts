const caliberMap: Record<string, string> = {
	Caliber9x18PM: '9x18mm Makarov',
	Caliber762x51: '7.62x51mm NATO',
	Caliber762x25TT: '7.62x25mm Tokarev',
	Caliber9x19PARA: '9x19mm Parabellum',
	Caliber556x45NATO: '5.56x45mm NATO',
	Caliber545x39: '5.45x39mm',
	Caliber762x54R: '7.62x54mmR',
	Caliber46x30: '4.6x30mm HK',
	Caliber366TKM: '366 TKM',
	Caliber20g: '20x70mm',
	Caliber762x39: '7.62x39mm',
	Caliber127x108: '12.7x108mm',
	Caliber30x29: '.300 Blackout',
	Caliber9x21: '9x21mm Gyurza',
	Caliber40mmRU: '40x46mm',
	Caliber9x39: '9x39mm',
	Caliber127x55: '12.7x55mm STs-130',
	Caliber12g: '12x70mm',
	Caliber57x28: '5.7x28mm FN',
	Caliber1143x23ACP: '.45 ACP',
	Caliber23x75: '23x75mm',
	Caliber40x46: '40x46mm',
	Caliber762x35: '7.62x35mm',
	Caliber86x70: '8.6x70mm',
	Caliber9x33R: '9x33mm Kurz',
	Caliber26x75: '26x75mm (Flare)'
};

export const getCaliberName = (caliber?: string) => {
	if (!caliber) return undefined;

	const name = caliberMap[caliber];

	return name;
};
