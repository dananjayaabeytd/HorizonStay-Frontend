/** @type {import('tailwindcss').Config} */
export const content = [
  "./src/**/*.{html,ts}",
  "./node_modules/flowbite/**/*.js" // add this line
];
export const theme = {
  extend: {},
};
export const plugins = [
  require('flowbite/plugin')
];