/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        pixel: ['"Silkscreen", sans-serif'],
      },
      screens: {
        sm: '768px',
      },
      perspective: {
        '1000': '1000px',
      },
      transform: {
        'preserve-3d': 'preserve-3d',
      },
      rotate: {
        'y-180': 'rotateY(180deg)',
      },
      backface: {
        'hidden': 'hidden',
      },
    },
  },
  plugins: [],
};

