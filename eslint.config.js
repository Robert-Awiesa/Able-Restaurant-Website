import js        from '@eslint/js';
import reactPlugin      from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import jsxA11y          from 'eslint-plugin-jsx-a11y';

export default [
  js.configs.recommended,
  {
    files: ['**/*.{js,jsx}'],
    plugins: {
      react:         reactPlugin,
      'react-hooks': reactHooksPlugin,
      'jsx-a11y':    jsxA11y,
    },
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType:  'module',
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
      globals: {
        window:    'readonly',
        document:  'readonly',
        console:   'readonly',
      },
    },
    settings: {
      react: { version: 'detect' },
    },
    rules: {
      /* ── React ── */
      ...reactPlugin.configs.recommended.rules,
      'react/react-in-jsx-scope': 'off',  // not needed with Vite / React 17+
      'react/prop-types':         'warn',

      /* ── Hooks ── */
      ...reactHooksPlugin.configs.recommended.rules,

      /* ── Accessibility ── */
      ...jsxA11y.configs.recommended.rules,

      /* ── Security ── */
      'no-eval':                      'error',
      'no-implied-eval':              'error',
      'no-new-func':                  'error',
      'no-script-url':                'error',
      'react/no-danger':              'error',   // forbid dangerouslySetInnerHTML
      'react/no-danger-with-children':'error',

      /* ── General hygiene ── */
      'no-console':     ['warn', { allow: ['warn', 'error', 'info'] }],
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      'eqeqeq':         ['error', 'always'],
    },
  },
];
