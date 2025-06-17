/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'vvv-gold': '#FFD700',
        'vvv-gold-dark': '#B8860B',
        'vvv-black': '#000000',
        'vvv-grey-dark': '#0A0A0A',
        'vvv-grey': '#141414',
        'vvv-grey-light': '#1F1F1F',
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        'mono': ['Courier New', 'monospace'],
      },
      boxShadow: {
        'gold': '0 0 40px rgba(255, 215, 0, 0.5)',
        'gold-sm': '0 0 20px rgba(255, 215, 0, 0.3)',
        'gold-lg': '0 0 60px rgba(255, 215, 0, 0.6)',
      },
      animation: {
        'pulse-gold': 'pulse-gold 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 3s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite',
      },
      keyframes: {
        'pulse-gold': {
          '0%, 100%': {
            opacity: 1,
            boxShadow: '0 0 30px rgba(255, 215, 0, 0.4)',
          },
          '50%': {
            opacity: .9,
            boxShadow: '0 0 50px rgba(255, 215, 0, 0.6)',
          },
        },
        'shimmer': {
          '0%': { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
        'glow': {
          '0%, 100%': {
            filter: 'brightness(1) drop-shadow(0 0 20px rgba(255, 215, 0, 0.5))',
          },
          '50%': {
            filter: 'brightness(1.2) drop-shadow(0 0 30px rgba(255, 215, 0, 0.7))',
          },
        },
      },
    },
  },
  plugins: [],
}