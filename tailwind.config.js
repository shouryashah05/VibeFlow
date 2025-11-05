/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        midnight: '#02010A',
        abyss: '#050B1A',
        neon: '#2DE2E6',
        electric: '#7F5AF0',
        cobalt: '#0E6FFF',
        slate: '#1F2937',
      },
      fontFamily: {
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 20px rgba(47, 113, 255, 0.45)',
      },
    },
  },
  plugins: [],
};
