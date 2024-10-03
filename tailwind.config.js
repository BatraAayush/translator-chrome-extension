// tailwind.config.js
module.exports = {
  content: [
    './src/**/*.{html,js}',  // Scans all HTML and JS files in src folder
    './src/**/*.html',       // Explicitly scans all HTML files inside src folder
    './*.html',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
