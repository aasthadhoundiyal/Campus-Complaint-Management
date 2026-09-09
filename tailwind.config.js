/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        modernBlue: {
          navy: '#1E3A8A',       // Dark navy blue for sidebar
          navyDark: '#172554',   // Darker navy for footer/hover
          navyLight: '#1e40af',  // Lighter navy
          bright: '#3B82F6',     // Bright blue for primary buttons & active indicators
          brightHover: '#2563EB',// Hover for bright blue
          ice: '#DBEAFE',        // Light blue-tinted gray for card / tag highlights
          iceLight: '#eff6ff',   // Softest ice blue
          bg: '#F8FAFC',         // Soft off-white / light gray for main application bg
          green: '#10B981',      // Vibrant green for resolved badges or success states
          greenHover: '#059669', // Hover state for green buttons
        },
        study: {
          darkBrown: '#675647',
          darkBrownHover: '#544537',
          beige: '#E3BD98',
          beigeLight: '#eed5bc',
          offWhite: '#DFD3B5',
          offWhiteLight: '#eae1cb',
          lightGray: '#C0BDBC',
          lightGraySubtle: '#d8d6d5',
          mossGreen: '#6C6E36',
          mossGreenHover: '#585a2b',
          charcoal: '#3B3B3B',
          charcoalLight: '#555555',
        },
        brand: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      }
    },
  },
  plugins: [],
};
