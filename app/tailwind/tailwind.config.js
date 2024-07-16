/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["../static/js/**/*.js"],
  theme: {
    extend: {
      colors: {
        border: '#a1a1aa',
        error: '#f87171',
      },
      backgroundColor: {
        main: '#222222',
        box: '#222222',
      },
      backgroundImage: {
        main: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='4' height='4' viewBox='0 0 4 4'%3E%3Cpath fill='%23000000' fill-opacity='1' d='M1 3h1v1H1V3zm2-2h1v1H3V1z'%3E%3C/path%3E%3C/svg%3E\")",
      },
    },
  },
  plugins: [],
}

