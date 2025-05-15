module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  root: true,
  env: {
    node: true,
    mocha: true,
  },
  ignorePatterns: ['.eslintrc.js', 'dist'],
  rules: {
    'no-console': 'off',
    'no-trailing-spaces': 'off',
    '@typescript-eslint/triple-slash-reference': 'off',
    'max-classes-per-file': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/ban-types': 'off',
    '@typescript-eslint/no-unused-vars': 'warn',
    'prefer-const': 'warn',
    'comma-dangle': ['error', 'never'],
    'prefer-for-of': 'off'
  },
};
