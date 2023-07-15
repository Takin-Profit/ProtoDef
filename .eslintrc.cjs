// eslint-disable-next-line import/no-commonjs, unicorn/no-empty-file
module.exports = {
  env: {
    es2022: true,
    node: true
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'plugin:array-func/all',
    'plugin:yaml/recommended',
    'plugin:unicorn/recommended',
    'plugin:sonarjs/recommended',
    'plugin:github/recommended',
    'plugin:promise/recommended',
    'plugin:import/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended'
  ],
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: ['./tsconfig.json', './tsconfig.eslint.json'],
    ecmaVersion: 'latest',
    sourceType: 'module',
    extraFileExtensions: ['.json', 'yaml', 'yml']
  },
  plugins: [
    '@typescript-eslint',
    'array-func',
    'unicorn',
    'sonarjs',
    'github',
    'json-files',
    'yaml',
    'simple-import-sort',
    'eslint-plugin-tsdoc',
    'promise',
    'import',
    'prettier'
  ],
  rules: {
    'i18n-text/no-en': 0,
    'unicorn/prevent-abbreviations': 0,
    'eslint-comments/no-use': 'off',
    'no-console': 'warn',
    'no-shadow': 'off',
    'prettier/prettier': [
      'error',
      {
        semi: false,
        trailingComma: 'none',
        arrowParens: 'avoid',
        singleQuote: true
      }
    ],
    'tsdoc/syntax': 'warn',
    'filenames/match-regex': 0,
    'filenames/match-exported': 2,
    'unicorn/filename-case': 0
  },
  settings: {
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx']
    },
    'import/extensions': ['.js', '.jsx', '.ts', '.tsx', '.d.ts', 'json'],
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx', '.d.ts', 'json']
      },
      typescript: {
        alwaysTryTypes: true,
        project: './tsconfig.json'
      }
    }
  }
}
