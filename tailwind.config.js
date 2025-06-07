/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		"./plugin/**/*.{js,ts,jsx,tsx}", // Vite plugin 디렉터리
		"./src/**/*.{js,ts,jsx,tsx}", // next src 디렉터리
	],
	theme: {
		extend: {},
	},
	plugins: [],
};
