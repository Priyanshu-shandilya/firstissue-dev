/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',

  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],

  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#1a8a5a',
          light: '#e1f5ee',
          dark: '#0f6e56',
        },
      },
    },
  },

  plugins: [],
}