import config from './index.js';

export default [
  ...config,
  {
    files: ['eslint.config.js'],
    rules: {
      'import/extensions': ['error', 'always'],
    },
  },
];
