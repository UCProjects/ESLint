import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { FlatCompat } from '@eslint/eslintrc';
import globals from 'globals';
import tseslint from 'typescript-eslint';

const importPlugin = createRequire(import.meta.url)('eslint-plugin-import');

function withTokenOrComment(sourceCode) {
  const extra = {
    getTokenOrCommentBefore: (node) => sourceCode.getTokenBefore(node, { includeComments: true }),
    getTokenOrCommentAfter: (node) => sourceCode.getTokenAfter(node, { includeComments: true }),
  };
  return new Proxy(sourceCode, {
    get(target, property) {
      if (property in extra && !(property in target)) return extra[property];
      const value = Reflect.get(target, property, target);
      return typeof value === 'function' ? value.bind(target) : value;
    },
  });
}

const { create: createOrder } = importPlugin.rules.order;
importPlugin.rules.order.create = (context) => {
  const sourceCode = withTokenOrComment(context.sourceCode ?? context.getSourceCode());
  return createOrder(Object.create(context, {
    sourceCode: { value: sourceCode },
    getSourceCode: { value: () => sourceCode },
  }));
};

const compat = new FlatCompat({
  baseDirectory: fileURLToPath(new URL('.', import.meta.url)),
});

export const ignores = [
  {
    ignores: [
      '**/*.ignore*',
      '**/*.d.ts',
      'node_modules/**',
      'dist/**',
      '.vscode/**',
    ],
  },
];

export const base = [
  ...compat.extends('airbnb-base'),
  {
    linterOptions: {
      reportUnusedDisableDirectives: 'off',
    },
    languageOptions: {
      ecmaVersion: 'latest',
    },
    rules: {
      camelcase: ['warn', { ignoreGlobals: true }],
      'consistent-return': 'warn',
      'lines-between-class-members': ['error', 'always', {
        exceptAfterSingleLine: true,
      }],
      'no-param-reassign': ['warn', { props: false }],
      'no-unused-expressions': ['error', { allowShortCircuit: true }],
      'no-unused-vars': ['error', { args: 'none' }],
      'no-use-before-define': ['error', 'nofunc'],
      'prefer-destructuring': ['error', {
        AssignmentExpression: { array: true, object: false },
      }],
      'no-plusplus': ['warn', { allowForLoopAfterthoughts: true }],
      'prefer-arrow-callback': ['error', { allowNamedFunctions: true }],
      'no-useless-return': 'warn',
      'class-methods-use-this': 'off',
      'no-restricted-globals': ['error', ''],
      'no-bitwise': 'off',
      'no-mixed-operators': 'off',
      'import/no-mutable-exports': 'warn',
      'no-continue': 'off',
      'object-curly-newline': ['error', { multiline: true, consistent: true }],
      'operator-linebreak': ['error', 'after'],
      quotes: ['error', 'single', { allowTemplateLiterals: true, avoidEscape: true }],
      'no-extra-boolean-cast': 'warn',
      'import/no-extraneous-dependencies': ['error', {
        devDependencies: [
          'test/**',
          'tests/**',
          'scripts/**',
          '**/*.config.{js,cjs,mjs,ts}',
        ],
        optionalDependencies: false,
        peerDependencies: false,
        bundledDependencies: false,
      }],
      'import/no-unresolved': ['error', {
        ignore: ['^typescript-eslint$'],
      }],
      'max-len': ['error', {
        code: 120,
        ignoreComments: true,
        ignoreRegExpLiterals: true,
        ignoreStrings: true,
        ignoreTemplateLiterals: true,
        tabWidth: 2,
      }],
    },
  },
];

export const node = [
  {
    languageOptions: {
      globals: globals.node,
    },
  },
];

export const mocha = [
  {
    files: ['test/**'],
    languageOptions: {
      globals: globals.mocha,
    },
    rules: {
      'global-require': 'off',
      'import/no-dynamic-require': 'off',
      'no-console': 'off',
      'no-unused-expressions': 'off',
    },
  },
];

export const commonjs = [
  {
    languageOptions: {
      sourceType: 'commonjs',
    },
  },
  {
    files: ['**/*.mjs'],
    languageOptions: {
      sourceType: 'module',
    },
  },
];

export const typescript = [
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: tseslint.parser,
    },
    plugins: {
      '@typescript-eslint': tseslint.plugin,
    },
    rules: {
      'no-undef': 'off',
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': ['error', { args: 'none' }],
      'no-use-before-define': 'off',
      '@typescript-eslint/no-use-before-define': ['error', { functions: false }],
      '@typescript-eslint/array-type': ['error', {
        default: 'array-simple',
        readonly: 'generic',
      }],
    },
  },
];

export default [...ignores, ...base, ...node, ...mocha];
