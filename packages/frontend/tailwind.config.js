/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      backgroundImage: {
        'text-lines':
          'linear-gradient(to right, #fff 5px, transparent 1px),  linear-gradient(#ccc 1px, transparent 1px)',
      },
      backgroundSize: {
        'text-lines': '20px 35px',
      },
      backgroundPosition: {
        'text-lines': '-4px 0',
      },
    },
  },
  plugins: [require('@tailwindcss/forms')({ strategy: 'class' })],
};
