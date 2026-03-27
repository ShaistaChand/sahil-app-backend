/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // ← This line scans all your React files for Tailwind classes
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}








// /** @type {import('tailwindcss').Config} */
// export default {
//   content: [],
//   theme: {
//     extend: {},
//   },
//   plugins: [],
// }

// // tailwind.config.js
// module.exports = {
//   content: [
//     "./index.html",
//     "./src/**/*.{js,ts,jsx,tsx}", // This path should cover your React components
//   ],
//   theme: {
//     extend: {},
//   },
//   plugins: [],
// }