module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        spotify: {
          green: '#1DB954',
          dark: '#121212',
          light: '#282828',
          lighter: '#B3B3B3',
        }
      }
    },
  },
  plugins: [],
}