/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: '#202983', container: '#39429b', 'on-container': '#39429b' },
        secondary: { DEFAULT: '#1b6d24', container: '#a0f399' },
        tertiary: { DEFAULT: '#003e14', container: '#005820', 'on-container': '#2ad760' },
        error: { DEFAULT: '#ba1a1a', container: '#ffdad6', 'on-container': '#93000a' },
        surface: {
          DEFAULT: '#f9f9f9',
          variant: '#e2e2e2',
          'container-lowest': '#ffffff',
          'container-low': '#f3f3f3',
          'container': '#eeeeee',
          'container-high': '#e8e8e8',
          'container-highest': '#e2e2e2',
        },
        outline: { DEFAULT: '#737783', variant: '#c3c6d4' },
        'on-surface': { DEFAULT: '#1a1c1c', variant: '#434652' },
        'on-primary': '#ffffff',
      },
      fontFamily: {
        headline: ['Manrope', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
