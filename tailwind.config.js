/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./docs/**/*.{js,ts,jsx,tsx,mdx}",
    "./snippets/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#4B47CA",
        light: "#7552FF",
        dark: "#22E2A8"
      }
    },
  },
  plugins: [],
}