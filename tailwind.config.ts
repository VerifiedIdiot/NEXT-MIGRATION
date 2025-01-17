/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        customRed: '#f85959',
        customBlue: '#78d5ef',
        customGray: '#b3b3b3',
      },
    },
  },
  plugins: [],
}

