import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import css from '@eslint/css';

export default [
  { ignores: ['dist'] },
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2022,
      globals: globals.browser,
      parserOptions: { ecmaVersion: 'latest', ecmaFeatures: { jsx: true }, sourceType: 'module' },
    },
    plugins: { 'react-hooks': reactHooks, 'react-refresh': reactRefresh, 'jsx-a11y': jsxA11y },
    rules: {
      ...js.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      ...jsxA11y.configs.recommended.rules,
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
    },
  },
  {
    files: [
      'src/components/AskMe.jsx',
      'src/components/CommandPalette.jsx',
      'src/components/Modals.jsx',
    ],
    // These custom dialogs need keyboard and backdrop handlers on their dialog containers.
    rules: { 'jsx-a11y/no-noninteractive-element-interactions': 'off' },
  },
  {
    files: ['styles.css'],
    language: 'css/css',
    plugins: { css },
    rules: {
      ...css.configs.recommended.rules,
      // Baseline coverage is a product choice; !important protects reduced-motion overrides.
      'css/use-baseline': 'off',
      'css/no-important': 'off',
    },
  },
];
