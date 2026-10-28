/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Baloo Bhaijaan 2"', 'Cairo', 'sans-serif'],
        body: ['Cairo', 'sans-serif'],
      },
      colors: {
        candy: {
          pink: '#ff6fa5',
          rose: '#ffd6e6',
          blue: '#48b6ff',
          sky: '#d4f1ff',
          yellow: '#ffd84d',
          sun: '#fff4cc',
          mint: '#5ce6a8',
          leaf: '#d6ffe9',
          grape: '#c084fc',
          cream: '#ff9',
          coral: '#ff8a6e',
        },
      },
      boxShadow: {
        candy: '0 8px 0 0 rgba(0,0,0,0.12)',
        'candy-sm': '0 4px 0 0 rgba(0,0,0,0.12)',
        glow: '0 0 24px rgba(255,216,77,0.7)',
      },
      borderRadius: {
        candy: '1.75rem',
      },
      keyframes: {
        bob: {
          '0%,100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
      },
      animation: {
        bob: 'bob 2.2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
