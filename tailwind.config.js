/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        figma: {
          bg: '#F8F9FD',
          card: '#FFFFFF',
          sidebar: '#FFFFFF',
          textMain: '#1A1D1F',
          textMuted: '#9A9EA7',
          border: '#F0F2F6',
          purple: '#605DEC',
          purpleLight: '#EEF2FF',
          blueIconBg: '#EEF4FF',
          blueIcon: '#3B82F6',
          yellowIconBg: '#FFF8E7',
          yellowIcon: '#F59E0B',
          peachIconBg: '#FFEFEA',
          peachIcon: '#F97316',
          purpleIconBg: '#F4EFFF',
          purpleIcon: '#8B5CF6',
          pillOrderBg: '#E0F2FE',
          pillOrderText: '#0284C7',
          donutSale: '#3B82F6',
          donutDistribute: '#FBBF24',
          donutReturn: '#F97316',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'figma-soft': '0px 4px 25px rgba(0, 0, 0, 0.03)',
        'figma-card': '0px 2px 12px rgba(0, 0, 0, 0.02)',
        'figma-purple': '0px 8px 20px rgba(96, 93, 236, 0.3)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      }
    },
  },
  plugins: [],
}