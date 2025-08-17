import { defineConfig } from 'eslint/config'
import cmyr from 'eslint-config-cmyr'

export default defineConfig([
    cmyr,
    {
        rules: {
            'no-console': 0,
        },
    },
    {
        files: ['**/*.{js,cjs,mjs,jsx,ts,tsx,mts,cts}'],
        languageOptions: {
            globals: {
                Bun: true,
            },
        },
    },
    {
        ignores: [
            'dist',
            'node_modules',
            'coverage',
            'build',
            'public',
            '.vercel',
            '.wrangler',
            '.husky',
        ],
    },
])
