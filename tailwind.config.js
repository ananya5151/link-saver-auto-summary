/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class", // This line is essential
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};