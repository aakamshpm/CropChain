/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./farmer/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "primary-color": "#04293A",
      },
      fontFamily: {
        primary: ["Outfit", "sans-serif"],
        secondary: ["DM Sans", "sans-serif"],
      },
    },
  },
  plugins: [],
};
