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
        // Primary theme colors matching docs.json
        primary: "#4B47CA",
        light: "#39A6A3",
        dark: "#22E2A8",

        // Space theme palette
        "cosmos-space-dark": "#231E23",
        "cosmos-teal": "#39A6A3",
        "cosmos-light-mint": "#DEEEE2",
        "cosmos-bright-green": "#ABF1363",
        "cosmos-deep-blue": "#4B47CA",
        "cosmos-mint": "#22E2A8",
        "cosmos-cobalt": "#4251FA",
        "cosmos-deep-purple": "#7522B5",
        "cosmos-orange": "#FF5628",
        "cosmos-pink": "#E64F8F",
        "cosmos-cyan": "#40B3FF"
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'SF Mono', 'Monaco', 'Cascadia Code', 'Roboto Mono', 'Consolas', 'Courier New', 'monospace']
      }
    },
  },
  plugins: [],
  // Prevent Tailwind from overriding custom styles
  important: false,
  corePlugins: {
    preflight: true
  }
}