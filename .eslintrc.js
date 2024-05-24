module.exports = {
    env: {
        commonjs: true,
        node: true,
        es6: true
    },
    parserOptions: {
        ecmaVersion: 'latest'
    },
    plugins: [
        'jsdoc'
    ],
    extends: [
        'eslint:recommended'
    ],
    rules: {
        'comma-dangle': [
            'error',
            'never'
        ],
        indent: [
            'error',
            4
        ],
        'jsdoc/no-undefined-types': [
            'error',
            {
                definedTypes: [
                    'Promise'
                ]
            }
        ],
        'linebreak-style': [
            'error',
            'windows'
        ],
        quotes: [
            'error',
            'single',
            {
                allowTemplateLiterals: true
            }
        ],
        'quote-props': ['error', 'as-needed'],
        'object-shorthand': ['error', 'always'],
        semi: [
            'error',
            'always'
        ]
    }
};
