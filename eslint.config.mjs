import globals from "globals";
import pluginJs from "@eslint/js";

export default [
    {languageOptions: { globals: globals.browser }},
    pluginJs.configs.recommended,
    {
        rules: {
            'indent': ['error', 4]
        },
        ignorePatterns: ['node_modules/', 'dist/', 'build/', 'lib', 'coverage/', 'webpack.config.js'],
    },
];