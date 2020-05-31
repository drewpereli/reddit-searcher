'use strict';

module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
    ecmaFeatures: {
      legacyDecorators: true,
    },
  },
  plugins: ['ember', 'import', 'prefer-let'],
  extends: ['eslint:recommended', 'plugin:ember/recommended'],
  env: {
    browser: true,
  },
  rules: {
    curly: ['error', 'all'],
    'dot-notation': 'error',
    eqeqeq: ['error', 'always'],
    'max-statements-per-line': ['error', { max: 1 }],
    'no-empty': ['error'],
    'no-unused-vars': [
      'error',
      {
        vars: 'all',
        args: 'after-used',
        ignoreRestSiblings: false,
      },
    ],
    'no-useless-concat': 'error',
    'no-useless-rename': 'error',
    'object-shorthand': ['error', 'always'],
    'one-var': [
      'error',
      {
        uninitialized: 'always',
        initialized: 'never',
      },
    ],
    'prefer-spread': 'error',
    'prefer-template': 'error',
    quotes: ['error', 'single', { avoidEscape: true }],
    'spaced-comment': ['error', 'always'],

    'no-use-before-define': ['error', { functions: false }],

    // Import plugin rules
    'import/first': 2,
    'import/newline-after-import': 2,

    // Prefer let
    'prefer-let/prefer-let': 2,

    'ember/no-new-mixins': 0,
    'ember/classic-decorator-hooks': 'error',
    'ember/classic-decorator-no-classic-methods': 'error',
    'ember/no-jquery': 'error',
  },
  overrides: [
    // node files
    {
      files: [
        '.eslintrc.js',
        '.template-lintrc.js',
        'ember-cli-build.js',
        'testem.js',
        'blueprints/*/index.js',
        'config/**/*.js',
        'lib/*/index.js',
        'server/**/*.js',
      ],
      parserOptions: {
        sourceType: 'script',
      },
      env: {
        browser: false,
        node: true,
      },
      plugins: ['node'],
      rules: Object.assign({}, require('eslint-plugin-node').configs.recommended.rules, {
        // add your custom rules and overrides for node files here

        // this can be removed once the following is fixed
        // https://github.com/mysticatea/eslint-plugin-node/issues/77
        'node/no-unpublished-require': 'off',
      }),
    },
  ],
};
