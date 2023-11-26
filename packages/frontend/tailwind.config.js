import forms from "@tailwindcss/forms";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        /**
         * Palette from
         * https://coolors.co/6dd3ce-c8e9a0-f7a278-a13d63-351e29
         */
        tiffanyblue: {
          DEFAULT: "#6dd3ce",
          100: "#0f3130",
          200: "#1e635f",
          300: "#2c948f",
          400: "#3cc5be",
          500: "#6dd3ce",
          600: "#8bdcd8",
          700: "#a8e5e2",
          800: "#c5eeec",
          900: "#e2f6f5",
        },
        teagreen: {
          DEFAULT: "#c8e9a0",
          100: "#2a400f",
          200: "#537f1e",
          300: "#7dbf2d",
          400: "#a3da60",
          500: "#c8e9a0",
          600: "#d3edb3",
          700: "#def2c6",
          800: "#e9f6d9",
          900: "#f4fbec",
        },
        atomictangerine: {
          DEFAULT: "#f7a278",
          100: "#451a04",
          200: "#8b3408",
          300: "#d04d0c",
          400: "#f37333",
          500: "#f7a278",
          600: "#f9b593",
          700: "#fac7ae",
          800: "#fcdac9",
          900: "#fdece4",
        },
        quinacridonemagenta: {
          DEFAULT: "#a13d63",
          100: "#210c14",
          200: "#411928",
          300: "#62253c",
          400: "#823150",
          500: "#a13d63",
          600: "#c05981",
          700: "#d083a0",
          800: "#e0acc0",
          900: "#efd6df",
        },
        darkpurple: {
          DEFAULT: "#351e29",
          100: "#0a0608",
          200: "#150c10",
          300: "#1f1218",
          400: "#2a1820",
          500: "#351e29",
          600: "#6b3c53",
          700: "#a25b7d",
          800: "#c191a9",
          900: "#e0c8d4",
        },
      },
      backgroundImage: {
        "text-lines":
          "linear-gradient(to right, transparent 5px, transparent 1px),  linear-gradient(#ccc 1px, transparent 1px)",
      },
      backgroundSize: {
        "text-lines": "20px 35px",
      },
      backgroundPosition: {
        "text-lines": "-4px 0",
      },
    },
  },
  plugins: [forms({ strategy: "class" })],
};
