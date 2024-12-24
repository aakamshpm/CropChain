const colors = require("tailwindcss/colors");

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
    colors: {
      ...colors,
      "primary-color": "#04293A",
    },
    fontFamily: {
      primary: "Outfit",
      secondary: "DM Sans",
    },
  },
  plugins: [],
};
