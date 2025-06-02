/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    container: { center: true, padding: '1rem' },
    extend: {
      colors: {
        cosmos: {
          50:  '#f8f9fa',
          100: '#f1f3f4',
          200: '#e8eaed',
          300: '#dadce0',
          400: '#bdc1c6',
          500: '#9aa0a6',
          600: '#80868b',
          700: '#5f6368',
          800: '#3c4043',
          900: '#202124',
        },
        primary: {
          DEFAULT: '#6976af',   // main cosmos blue
          dark:    '#4a5a8c',
          light:   '#8b9ad1',
        },
        accent:   '#545e8c',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        soft: '0 1px 2px rgba(0,0,0,.04), 0 2px 4px rgba(0,0,0,.06)',
        glow: '0 0 15px rgba(105,118,175,.35)',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
      },
      animation: {
        'fade-in': 'fadeIn .4s ease-in forwards',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    // minimal helper classes
    function ({ addUtilities, addComponents }) {
      addUtilities({
        '.text-gradient': {
          background: 'linear-gradient(135deg,#6976af 0%,#8791bf 100%)',
          '-webkit-background-clip': 'text',
          '-webkit-text-fill-color': 'transparent',
          'background-clip': 'text',
        },
      });

      addComponents({
        '.btn': {
          '@apply inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium text-white shadow-soft transition': {},
          background: 'linear-gradient(135deg,#6976af 0%,#8791bf 100%)',
          '&:hover': { boxShadow: '0 4px 12px rgba(105,118,175,.35)' },
        },
        '.card': {
          '@apply rounded-lg border border-cosmos-200 dark:border-cosmos-700 bg-white dark:bg-cosmos-800 shadow-soft transition': {},
          '&:hover': { boxShadow: '0 8px 20px rgba(0,0,0,.08)' },
        },
        '.callout': {
          '@apply border-l-4 px-4 py-3 my-6 rounded-md bg-cosmos-50 dark:bg-cosmos-800/40': {},
          borderLeftColor: '#6976af',
        },
      });
    },
  ],
};