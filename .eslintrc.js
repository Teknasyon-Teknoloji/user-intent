const fs = require('fs');
const path = require('path');

const prettierOptions = JSON.parse(fs.readFileSync(path.resolve(__dirname, '.prettierrc'), 'utf8'));

module.exports = {
    env: {
        browser: true,
        es6: true,
    },
    extends: ['eslint:recommended', 'airbnb-base', 'prettier'],
    plugins: ['prettier'],
    parserOptions: {
        ecmaVersion: 9,
        sourceType: 'module',
    },
    ignorePatterns: ['dist/'],
    rules: {
        'prettier/prettier': ['error', prettierOptions],
        indent: ['error', 4],
        'arrow-body-style': [2, 'as-needed'],
        'import/imports-first': 0,
        'import/newline-after-import': 0,
        'import/no-dynamic-require': 0,
        'import/no-extraneous-dependencies': 0,
        'import/no-named-as-default': 0,
        'import/no-unresolved': 2,
        'import/no-webpack-loader-syntax': 0,
        'import/prefer-default-export': 0,
        'max-len': 0,
        'newline-per-chained-call': 0,
        'no-confusing-arrow': 0,
        'no-console': 1,
        'import/no-named-as-default-member': 0,
        'import/no-import-module-exports': 0,
        'no-unsafe-negation': 0,
        'no-underscore-dangle': 0,
        'no-unused-vars': 2,
        'no-use-before-define': 0,
        'prefer-template': 2,
    },
};
