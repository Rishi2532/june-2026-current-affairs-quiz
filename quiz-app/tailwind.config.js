/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        exam: {
          nav: '#233242',
          header: '#005a9c', // SBI Blue
          btnPrimary: '#0066cc',
          bg: '#f4f6f9',
          card: '#ffffff',
          border: '#d1d5db',
          green: '#28a745',
          red: '#dc3545',
          purple: '#6f42c1',
          silver: '#6c757d',
          accent: '#0d6efd'
        }
      }
    },
  },
  plugins: [],
}

