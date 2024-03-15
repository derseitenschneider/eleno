module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'airbnb',
    'airbnb-typescript',
    'airbnb/hooks',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  overrides: [],

  settings: {
    'import/extensions': ['.js', '.jsx', '.ts', '.tsx'],
    'import-parser': {
      '@typescript-eslint/parser': '[".ts", ".tsx"]',
    },
    'import/resolver': {
      typescript: {},
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
    },
  },

  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    // project: './tsconfig.json',
    tsconfigRootDir: __dirname,
  },
  plugins: [
    '@typescript-eslint',
    'react',
    'prettier',
    'eslint-import-resolver-typescript',
  ],
  rules: {
    semi: 0,
    'react/require-default-props': [0],
    'react/react-in-jsx-scope': [0],
    'jsx-a11y/no-autofocus': 0,
    'import/no-cycle': 0,
    'react/jsx-no-bind': 0,
    'react/jsx-props-no-spreading': 0,
    '@typescript-eslint/naming-convention': 0,
  },
  ignorePatterns: ['tests/*.ts', 'playwright.config.ts'],
}
