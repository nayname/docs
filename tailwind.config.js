/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./docs/**/*.{js,ts,jsx,tsx,mdx}",
    "./snippets/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // Minimal extensions - let Mintlify handle the main theming
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'SF Mono', 'Monaco', 'Cascadia Code', 'Roboto Mono', 'Consolas', 'Courier New', 'monospace']
      }
    },
  },
  plugins: [],
  important: false,
  corePlugins: {
    preflight: false
  }
}