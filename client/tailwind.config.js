/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    theme: {
      screens: {
        sm: '600px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
      },
    },
    fontSize: {
      xxs: '0.40rem',
      xs: '0.60rem',
      sm: '0.95rem',
      base: '1.25rem',
      lg: '2rem',
      xl: '2.8rem',
      '2xl': '2.25rem',
      '3xl': '2.5rem',
      '4xl': '2.75rem',
      '5xl': '3.0rem',
    },
    fontFamily: {
      nexab: ['NexaBold', 'sans-serif'],
      nexa: ['Nexa', 'sans-serif'],
      funny: ['Sunrise Orange', 'sans-serif'],
    },
    extend: {
      colors: {
        transparent: 'transparent',
        dark: '#1E4531',
        light: '#2C9464',
        text: '#000000',
      },
    },
  },
  variants: {},
  plugins: [],
};
