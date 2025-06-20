/** @type {import('tailwindcss').Config} */
const flowbite = require("flowbite-react/tailwind");

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    flowbite.content(),
  ],
  theme: {
    extend: {
      colors: {
        "myprimary" : "#FC8637",
        "myprimary" : "#FF6868",
        "secondary" : "#3B82F6",
        "primaryBG" : "#FCFCFC"
      }
    },
  },
  plugins: [
    require('daisyui'),
    flowbite.plugin(),
  ],
}


