/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			colors: {
				arrowtown: {
					50: '#f5f5f1',
					100: '#e6e4db',
					200: '#cfcab9',
					300: '#b3ab91',
					400: '#9d9172',
					500: '#948668',
					600: '#7a6b54',
					700: '#625546',
					800: '#55483e',
					900: '#4a4039',
					950: '#2a221e'
				}
			}
		},
		container: {
			center: true
		}
	},

	plugins: [require('daisyui')]
};
