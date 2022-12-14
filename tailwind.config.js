/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		"./pages/**/*.{js,ts,jsx,tsx}",
		"./components/**/*.{js,ts,jsx,tsx}",
	],
	theme: {
		container: {
			center: true,
		},
		colors: {
			primary: "#075985",
			primaryHover: "#0c4a6e",
			secondary: "#2C74B3",
			gray: {
				transparent: "#d1d5db",
				300: "#6b7280",
				700: "#374151",
			},
			red: "#dc2626",
			white: "white",
			yellow: "#FFC745",
			beige: "#3A4F7A",
		},
		extend: {
			transitionProperty: {
				height: "height",
			},
			keyframes: {
				dropdownFadeIn: {
					"0%": { transform: "translateY(-100%)" },
					"100%": { transform: "translateY(0)" },
				},
				dropdownFadeOut: {
					"0%": { transform: "translateY(0)" },
					"100%": { transform: "translateY(-100%)" },
				},
			},
			animation: {
				dropdownFadeIn: "dropdownFadeIn 0.4s ease",
				dropdownFadeOut: "dropdownFadeOut 0.4s ease",
			},
			height: {
				"50vh": "50vh",
				"65vh": "65vh",
				"70vh": "70vh",
				"90vh": "90vh",
			},
		},
	},
	plugins: [],
}
