/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        'gradient-x': {
          '0%': { 'background-position': '0% 50%' },
          '50%': { 'background-position': '100% 50%' },
          '100%': { 'background-position': '0% 50%' },
        },
        float: {
          '0%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
          '100%': { transform: 'translateY(0px)' },
        },
        slideIn: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideOut: {
          '0%': { transform: 'translateX(0)', opacity: '1' },
          '100%': { transform: 'translateX(-50px)', opacity: '0' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        completion: {
          '0%': { 'background-color': 'rgba(255, 255, 255, 0.9)' },
          '50%': { 'background-color': 'rgba(209, 250, 229, 0.9)' },
          '100%': { 'background-color': 'rgba(209, 250, 229, 0.9)' },
        },
      },
      animation: {
        'gradient-x': 'gradient-x 15s ease infinite',
        float: 'float 6s ease-in-out infinite',
        slideIn: 'slideIn 0.5s ease-out forwards',
        slideOut: 'slideOut 0.3s ease-out forwards',
        fadeIn: 'fadeIn 0.4s ease-out forwards',
        slideDown: 'slideDown 0.3s ease-out forwards',
        completion: 'completion 0.5s ease-out forwards',
      },
    },
  },
  plugins: [],
}
