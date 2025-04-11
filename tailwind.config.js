const colors = require('tailwindcss/colors')

// https://nuxt.com/modules/tailwindcss
export default {
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: colors.blue
      }
    }
  }
}
