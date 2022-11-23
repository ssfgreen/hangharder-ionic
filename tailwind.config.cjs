/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#1caff6',
        success: '#58cb05',
        error: '#ff4b4b',
        warning: '#ff9601'
      }
    }
  },
  darkMode: 'class',
  plugins: []
};
