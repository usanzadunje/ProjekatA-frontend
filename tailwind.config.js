const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
    purge: ["./src/**/*.html", "./src/**/*.vue"],
    darkMode: false, // or 'media' or 'class'
    theme: {
        screens: {
            '2xs': '285px',
            'xs': '375px',
            ...defaultTheme.screens,
        },
        fontSize: {
            '3xs': '.5rem',
            '2xs': '.625rem',
            ...defaultTheme.fontSize,
        },
    },
    variants: {
        extend: {},
    },
    plugins: [],
};
