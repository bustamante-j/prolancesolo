/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './src/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        'brand-navy': '#0b2340',
        'brand-orange': '#f39c12',
        'brand-gold': '#f6b040'
      },
      borderRadius: {
        xl: '1rem'
      }
    }
  },
  plugins: []
};