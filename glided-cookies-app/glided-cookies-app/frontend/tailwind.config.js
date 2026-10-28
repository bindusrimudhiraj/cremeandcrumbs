/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Cormorant Garamond"', '"DM Serif Display"', 'Georgia', 'serif'],
        sans:  ['"Nunito"', 'system-ui', 'sans-serif'],
      },
      colors: {
        cream: {
          50:  '#FFF8F2',
          100: '#FFF0E0',
          200: '#FDDBB4',
          300: '#F9C88A',
          400: '#F0B267',
          500: '#C8926A',
          600: '#9E6E4E',
          700: '#7A5038',
          800: '#5A3620',
          900: '#3C2010',
        },
        gold: {
          300: '#FBDC8A',
          400: '#F5C842',
          500: '#E8821A',
          600: '#C96A0E',
          700: '#A85208',
        },
        espresso: {
          100: '#F5E8EF',
          200: '#E8C8D8',
          300: '#CC93AE',
          400: '#AA5E82',
          500: '#7D3257',
          600: '#5C1F3E',
          700: '#3F0F28',
          800: '#2D0A1C',
          900: '#1A0510',
        },
      },
      animation: {
        'fade-in':  'fadeIn 0.6s ease-out forwards',
        'slide-up': 'slideUp 0.5s ease-out forwards',
      },
      keyframes: {
        fadeIn:  { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideUp: { '0%': { opacity: '0', transform: 'translateY(20px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
      },
    },
  },
  plugins: [],
}
