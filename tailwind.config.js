/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Earth-green dark theme palette
        // Primary backgrounds
        primary: '#0F0F0F',      // True black, OLED-optimized
        secondary: '#1A1A1A',    // Card backgrounds
        tertiary: '#242424',     // Inputs, elevated surfaces

        // Earth green accents
        emerald: {
          950: '#1F4A2A',        // Active/pressed state
          800: '#2E6F40',        // Primary accent (default)
          700: '#2E6F40',        // Alias for primary
          600: '#358D47',        // Hover state
          500: '#10B981',        // Success green
        },

        // Text colors
        'text-primary': '#E8E8E8',
        'text-secondary': '#A8A8A8',
        'text-muted': '#6B6B6B',

        // Borders
        border: '#303030',
        'border-focus': '#2E6F40',

        // Slate overrides for dark theme
        slate: {
          950: '#0F0F0F',
          900: '#1A1A1A',
          800: '#242424',
          700: '#303030',
          600: '#404040',
          500: '#6B6B6B',
          400: '#A8A8A8',
          300: '#E8E8E8',
          200: '#F0F0F0',
          100: '#F5F5F5',
          50: '#FAFAFA',
        },
      },
      backgroundColor: {
        primary: '#0F0F0F',
        secondary: '#1A1A1A',
        tertiary: '#242424',
      },
      textColor: {
        primary: '#E8E8E8',
        secondary: '#A8A8A8',
        muted: '#6B6B6B',
      },
      borderColor: {
        border: '#303030',
        focus: '#2E6F40',
      },
    },
  },
  plugins: [],
  darkMode: 'class',
}
