/* eslint-disable unicorn/prefer-module */
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './public/*.html', './src/**/*.{html, css, js}'],
  // https://tailwindcss.com/docs/dark-mode - remove prior to production
  darkMode: ['selector', '[data-mode="dark"]'],
  theme: {
    // Override screen sizes
    // https://tailwindcss.com/docs/screens
    // All other screen sizes (such as xl) are removed and not available as screen modifiers.
    screens: {
      'sm': '576px',
      // => @media (min-width: 576px) { ... }

      'md': '960px',
      // => @media (min-width: 960px) { ... }

      'lg': '1440px',
      // => @media (min-width: 1440px) { ... }
    },
    colors: {
      transparent: 'transparent',
      current: 'currentColor',

      // White variants
      'white': 'hsl(0deg 0 100% / 100%)', // #ffffff
      'ecru': 'hsl(156deg 19% 95% / 100%)', // #eff4f2

      // Teal variants, primary colour
      'teal': {
        50: 'hsl(169deg 48% 90% / 100%)', // #daf2ee
        100: 'hsl(169deg 47% 81% / 100%)', // #b6e5dc
        200: 'hsl(169deg 47% 71% / 100%)', // #92d8cb
        300: 'hsl(169deg 48% 62% / 100%)', // #6eccbb
        400: 'hsl(169deg 47% 52% / 100%)', // #4abea9
        500: 'hsl(var(--color42eal) / 1)', // #26b298
        600: 'hsl(169deg 64% 35% / 100%)', // #20947f
        700: 'hsl(169deg 65% 28% / 100%)', // #197766
        800: 'hsl(169deg 65% 21% / 100%)', // #13594c
        900: 'hsl(169deg 64% 14% / 100%)', // #0d3c33
        DEFAULT: 'hsl(var(--color-teal) / 1)' // 500
      },

      // Plum variants, secondary colour
      'plum': {
        50: 'hsl(324deg 49% 90% / 100%)', // #f2d9e8
        100: 'hsl(324deg 48% 80% / 100%)', // #e4b3d0
        200: 'hsl(324deg 49% 70% / 100%)', // #d88eba
        300: 'hsl(324deg 49% 60% / 100%)', // #cb68a3
        400: 'hsl(324deg 49% 50% / 100%)', // #be428c
        500: 'hsl(var(--color-plum) / 1)', // #b11d75
        600: 'hsl(324deg 72% 32% / 100%)', // #941862
        700: 'hsl(324deg 72% 27% / 100%)', // #76134e
        800: 'hsl(324deg 71% 20% / 100%)', // #590f3b
        900: 'hsl(324deg 71% 14% / 100%)', // #3b0a27
        DEFAULT: 'hsl(var(--color-plum) / 1)' // 500
      },

      // Black variants, tertiary colour
      'black': {
        50: 'hsl(0deg 0 90% / 100%)', // #e5e5e5
        100: 'hsl(0deg 0 80% / 100%)', // #ccc
        200: 'hsl(0deg 0 70% / 100%)', // #b2b2b2
        300: 'hsl(0deg 0 60% / 100%)', // #999
        400: 'hsl(0deg 0 50% / 100%)', // #7f7f7f
        500: 'hsl(206deg 0 40% / 100%)', // #666
        600: 'hsl(0deg 0 30% / 100%)', // #4d4d4d
        700: 'hsl(0deg 0 20% / 100%)', // #333
        800: 'hsl(0deg 0 10% / 100%)', // #1a1a1a
        900: 'hsl(var(--color-black) / 1)', // #000
        DEFAULT: 'hsl(var(--color-black) / 1)' // 900
      },

      // Corporate colours
      'corporate-blue': 'hsl(202deg 100% 35% / 100%)', // #0073b4
      'corporate-blue-dark': 'hsl(202deg 93% 21% / 100%)', // #055785
      'corporate-grey': 'hsl(202deg 2% 35% / 100%)', // #575a5b
      'corporate-yellow': 'hsl(40deg 100% 67% / 100%)', // #ffc658
      'corporate-yellow-dark': 'hsl(40deg 87% 56% / 100%)', // #f0ad2c
      'corporate-yellow-light': 'hsl(39deg 100% 74% / 100%)', // #ffd179

      // Current student green
      'current-student-green': {
        50: 'hsl(159deg 37% 65% / 100%)',
        100: 'hsl(159deg 37% 47% / 100%)',
        200: 'hsl(159deg 37% 44% / 100%)',
        300: 'hsl(159deg 37% 41% / 100%)',
        400: 'hsl(159deg 36% 35% / 100%)',
        500: 'hsl(159deg 36% 31% / 100%)'
      },

      primary: 'hsl(var(--color-teal) / 1)',
      secondary: 'hsl(var(--color-plum) / 1)',
      tertiary: 'hsl(var(--color-black) / 1)'

    },
    fontFamily: {
       // Barlow is unavailable the font stack will fallback to system fonts
      'body': ['Barlow', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', 'sans-serif', 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'],
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
  extend: {
    spacing: {
      'prose': '72ch',
    }
  }
}
