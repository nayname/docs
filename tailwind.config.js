/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './docs/**/*.{js,ts,jsx,tsx,mdx}',
    './snippets/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    container: { 
      center: true, 
      padding: '1rem' 
    },
    extend: {
      colors: {
        cosmos: {
          50:  '#F8F9FF',
          100: '#F1F3FF', 
          200: '#E8EAFF',
          300: '#D4D8FF',
          400: '#A8AFFF',
          500: '#7552FF',
          600: '#4B47CA',
          700: '#3D3BA3',
          800: '#2F2D7C',
          900: '#212055',
        },
        primary: {
          DEFAULT: '#4B47CA',
          light:   '#7552FF',
          dark:    '#3D3BA3',
        },
        accent: {
          DEFAULT: '#22E2A8',
          light:   '#4AE8B8',
          dark:    '#1BC799',
        },
        mint: {
          DEFAULT: '#22E2A8',
          50:  '#F0FDF9',
          100: '#DCFDF1',
          200: '#BBF9E3',
          300: '#86F0CC',
          400: '#4AE8B8',
          500: '#22E2A8',
          600: '#1BC799',
          700: '#189C7F',
          800: '#187D67',
          900: '#176756',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        soft: '0 1px 2px rgba(0,0,0,.04), 0 2px 4px rgba(0,0,0,.06)',
        glow: '0 0 15px rgba(75,71,202,.25)',
        'glow-mint': '0 0 15px rgba(34,226,168,.25)',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          '0%': { opacity: '0', transform: 'translateX(-10px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out forwards',
        'slide-in': 'slideIn 0.3s ease-out forwards',
        'scale-in': 'scaleIn 0.2s ease-out forwards',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '100': '25rem',
        '112': '28rem',
        '128': '32rem',
      },
      borderRadius: {
        '4xl': '2rem',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    function({ addUtilities }) {
      const newUtilities = {
        '.text-gradient': {
          'background': 'linear-gradient(135deg, #4B47CA 0%, #7552FF 50%, #22E2A8 100%)',
          '-webkit-background-clip': 'text',
          '-webkit-text-fill-color': 'transparent',
          'background-clip': 'text',
        },
        '.bg-gradient-cosmos': {
          'background': 'linear-gradient(135deg, #4B47CA 0%, #7552FF 50%, #22E2A8 100%)',
        },
        '.border-gradient': {
          'border': '1px solid transparent',
          'background-image': 'linear-gradient(white, white), linear-gradient(135deg, #4B47CA, #22E2A8)',
          'background-origin': 'border-box',
          'background-clip': 'content-box, border-box',
        },
        '.glass': {
          'background': 'rgba(255, 255, 255, 0.1)',
          'backdrop-filter': 'blur(10px)',
          'border': '1px solid rgba(255, 255, 255, 0.2)',
        },
        '.dark .glass': {
          'background': 'rgba(0, 0, 0, 0.1)',
          'border': '1px solid rgba(255, 255, 255, 0.1)',
        },
      };
      addUtilities(newUtilities);
    }
  ],
};

export default config;