/** @type {import('tailwindcss').Config} */
import scrollbarHide from 'tailwind-scrollbar-hide';

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  plugins: [
    scrollbarHide
  ],
  theme: {
    extend: {
      animation: {
        'bounce-down': 'bounceDown 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
        'scroll-up': 'scrollUp 20s linear infinite',
        'scroll-down': 'scrollDown 20s linear infinite',
        'slide-down': 'slideDown 0.5s ease-out',
        'fade-in': 'fadeIn 1s ease-out forwards',
        'glitch': 'glitch 2s infinite',
        'float': 'float 6s ease-in-out infinite',
        'loading': 'loading 1s ease-in-out infinite',
      },
      keyframes: {
        bounceDown: {
          '0%': { transform: 'translateY(-100px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scrollUp: {
          '0%': { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(-50%)' },
        },
        scrollDown: {
          '0%': { transform: 'translateY(-50%)' },
          '100%': { transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        glitch: {
          '0%, 100%': { textShadow: '0 0 20px rgba(255, 255, 255, 0.3)' },
          '25%': { textShadow: '-2px 0 #ff00ff, 2px 0 #00ffff' },
          '50%': { textShadow: '2px 0 #ff00ff, -2px 0 #00ffff' },
          '75%': { textShadow: '0 0 20px rgba(255, 255, 255, 0.3)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
          '33%': { transform: 'translateY(-20px) rotate(120deg)' },
          '66%': { transform: 'translateY(20px) rotate(240deg)' },
        },
        loading: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
      },
    },
  },
  plugins: [],
}
