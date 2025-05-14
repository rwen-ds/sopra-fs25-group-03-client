/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
    "./app/**/*.{js,ts,jsx,tsx}",        // all pages
    "./app/styles/**/*.{css,scss}"       // globals.css`
    ],
    safelist: ['animate-scroll', 'feedback-track'],
    plugins: [require('daisyui')],
  };
  