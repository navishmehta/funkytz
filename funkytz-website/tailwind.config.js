/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        funky: {
          orange: '#FF5722',
          'orange-dark': '#E0431A',
          black: '#0F0F0F',
          teal: '#1FAFA0',
          cream: '#F7F5F2',
          yellow: '#FFC400',
        },
      },
      fontFamily: {
        display: ['"Archivo Black"', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        comic: '4px 4px 0px rgba(15,15,15,1)',
        'comic-sm': '2px 2px 0px rgba(15,15,15,1)',
      },
      animation: {
        marquee: 'marquee 25s linear infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        }
      }
    },
  },
  plugins: [],
}
