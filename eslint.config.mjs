/* eslint-disable n/no-unpublished-import */
import tseslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import js from '@eslint/js';
import globals from 'globals';
import n from 'eslint-plugin-n';
import prettier from 'eslint-config-prettier';

export default [
  // JavaScript recommended rules
  js.configs.recommended,

  // Node.js recommended rules
  n.configs['flat/recommended'],

  // Disable formatting rules, let Prettier handle it
  prettier,

  // TypeScript Config
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        project: './tsconfig.json', // required for type-aware linting
      },
      globals: {
        ...globals.node,
        __dirname: 'readonly',
        process: 'readonly',
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
    },
    rules: {
      // Use recommended TypeScript rules
      ...tseslint.configs.recommended.rules,

      // Your custom rules
      'prettier/prettier': 'error',
      'no-console': 'off',

      // Replace JS unused-vars with TS version
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': ['warn'],

      eqeqeq: 'error',
      semi: ['error', 'always'],
      'object-shorthand': ['error', 'always'],
      'prefer-const': [
        'error',
        {
          destructuring: 'all',
          ignoreReadBeforeAssign: false,
        },
      ],
    },
  },

  // JS files
  {
    files: ['**/*.{js,mjs,cjs}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.node,
      },
    },
  },

  // CommonJS override
  {
    files: ['**/*.cjs'],
    languageOptions: { sourceType: 'commonjs' },
  },
];
