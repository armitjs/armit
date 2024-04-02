/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./{src,mdx}/**/*.{js,mjs,jsx,tsx,mdx}'],
  darkMode: 'class',
  theme: {},
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
    require('@tailwindcss/forms'),
  ],
};
