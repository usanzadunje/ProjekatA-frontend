module.exports = {
    purge: ["./src/**/*.html", "./src/**/*.vue"],
    darkMode: false, // or 'media' or 'class'
    theme: {
        extend: {
            top: {
                '2/5': '40%',
            }
        },
    },
    variants: {
        extend: {},
    },
    plugins: [],
};
