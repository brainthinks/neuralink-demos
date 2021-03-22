module.exports = {
  env: {
    browser: true,
    es2021: true,
    jest: true,
  },
  globals: {
    React: 'readonly',
  },
  extends: [
    'plugin:react/recommended',
    'standard',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: [
    'react',
    '@typescript-eslint',
  ],
  rules: {
    'no-use-before-define': 'off',
    '@typescript-eslint/no-use-before-define': [
      'error',
    ],
    semi: [
      'error',
      'always',
    ],
    'comma-dangle': [
      'error',
      'always-multiline',
    ],
  },
};
