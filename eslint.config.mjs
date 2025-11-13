import { defineConfig } from 'eslint/config';
import babelParser from '@babel/eslint-parser';
import js from '@eslint/js';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import stylistic from '@stylistic/eslint-plugin';
import globals from 'globals';

/** @type {import('eslint').Linter.Config[]} */
export default defineConfig([
  {
    ignores: ['build/', 'buildInfos/'],
  },
  {
    name: 'Common configuration',
    plugins: {
      js,
      '@stylistic': stylistic,
    },
    extends: [
      js.configs.recommended,
      stylistic.configs.recommended,
    ],
    rules: {
      '@stylistic/semi': ['error', 'always'],
      'no-console': ['error', { allow: ['warn', 'error'] }],
    },
  },
  {
    name: 'Configuration for app source files',
    files: ['**/*.{js,mjs,cjs,jsx}'], ignores: ['eslint.config.mjs', 'webpack.js', 'babel.config.js', 'postcss.config.js', 'tailwind.config.js'],
    languageOptions: {
      sourceType: 'module',
      parser: babelParser,
      globals: {
        ...globals.browser,
        APP_ENV_APP_PUBLIC_PATH: 'readonly',
        APP_ENV_APP_TITLE: 'readonly',
        APP_ENV_COUNT_DETAILS: 'readonly',
        APP_ENV_WORKER_NAME: 'readonly',
      },
    },
    plugins: {
      react,
      reactHooks,
      jsxA11y,
    },
    extends: [
      react.configs.flat.recommended,
      react.configs.flat['jsx-runtime'],
      reactHooks.configs.flat.recommended,
      jsxA11y.flatConfigs.recommended,
    ],
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
  {
    name: 'Eslint configuration for the configuration files',
    files: ['webpack.js', 'babel.config.js', 'postcss.config.js', 'tailwind.config.js'],
    languageOptions: { sourceType: 'module', globals: globals.node },
  },
]);
