module.exports = {
    env: {
      node: true,
      jest: true,
      es6: true
    },
    extends: ['eslint:recommended'],
    parserOptions: {
      ecmaVersion: 2020
    },
    rules: {
      'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
      'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off'
    }
  };