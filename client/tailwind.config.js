/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    screens: {
      sm: '420px',
      md: '768px',
      lg: '1024px',
      xl: '1320px',
    },
    extend: {
      colors: {
        primary: "#242424",
        green: {
          500: "#50DB97",
          900: "#089E97",
        },
        red: "#FF385C",
        orange: "#FFC149",
        brown: "#C69022",
        purple: "#6c1ccc",
        blue: {
          100: "#F3F7FF",
          500: "#001F7E",
        },
        gray: {
          100: "#F7F7F7",
          200: "#DDDDDD",
          300: "#EBEBEB",
          500: "#BDBDBD",
          700: "#6a6a6a",
        },
      },
      boxShadow: {
        gray: "0 3px 12px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.08)"
      }
    },
    fontFamily: {
      mulish: ['Mulish', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont']
    },
  },
  plugins: [],
}

