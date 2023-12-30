module.exports = {
  purge: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
      'primary': '#FFDD40',
      'dark': '#373030',
      'yellow': '#FFDD40',
      },
      fontSize: {
        '12xl': '12rem',
    },
  },
    
  },
  variants: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('daisyui'),
  ],
}
