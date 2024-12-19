const IS_PROD = process.env.NODE_ENV === 'production'
module.exports = {
    root: true,
    globals: {
        Bun: true,
    },
    env: {
    },
    extends: [
        'cmyr',
    ],
    plugins: [
    ],
    rules: {
        'no-console': 0,
    },
}
