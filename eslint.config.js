import js from '@eslint/js';
import prettierConfig from 'eslint-config-prettier';
import importPlugin from 'eslint-plugin-import';
import prettier from 'eslint-plugin-prettier';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import sortExports from 'eslint-plugin-sort-exports';
import globals from 'globals';

export default [
  js.configs.recommended,
  {
    ignores: ['dist/**', 'node_modules/**', 'coverage/**']
  },
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true
        }
      }
    },
    plugins: {
      react,
      'react-hooks': reactHooks,
      import: importPlugin,
      'sort-exports': sortExports,
      prettier
    },
    settings: {
      react: {
        version: 'detect'
      },
      'import/resolver': {
        alias: {
          map: [['@', './src']],
          extensions: ['.js', '.jsx', '.ts', '.tsx']
        }
      }
    },
    rules: {
      ...react.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      ...importPlugin.configs.recommended.rules,

      // Custom rules
      // Ignore @multiversx deep subpath imports and Vite's `?react` SVG
      // virtual modules, neither of which the static resolver can follow.
      'import/no-unresolved': [
        'error',
        { ignore: ['@multiversx/.*', '\\.svg(\\?.*)?$'] }
      ],
      'sort-exports/sort-exports': 'error',
      'sort-imports': [
        'error',
        {
          ignoreCase: true,
          ignoreDeclarationSort: true,
          ignoreMemberSort: false
        }
      ],
      'import/order': [
        'error',
        {
          groups: [
            'builtin',
            'external',
            'internal',
            'parent',
            'sibling',
            'index'
          ],
          pathGroups: [
            {
              pattern: 'react',
              group: 'external',
              position: 'before'
            }
          ],
          pathGroupsExcludedImportTypes: ['react'],
          'newlines-between': 'never',
          alphabetize: {
            order: 'asc',
            caseInsensitive: true
          }
        }
      ],
      'prettier/prettier': 'error',

      // React rules
      'react/jsx-one-expression-per-line': 'off',
      'react/prop-types': 'off',
      'react/display-name': 'off',
      'react/jsx-props-no-spreading': 'off',
      'react/require-default-props': 'off',
      'react-hooks/exhaustive-deps': 'off',
      'react/jsx-curly-newline': 'off',
      'react/jsx-wrap-multilines': 'off',
      'react/destructuring-assignment': 'off',
      'react/no-array-index-key': 'off',
      'react/react-in-jsx-scope': 'off',
      'react/jsx-no-target-blank': ['error', { allowReferrer: true }],
      'react/no-unescaped-entities': 'off'
    }
  },
  {
    // Build-tool config files import the dist bundles of Vite plugins, whose
    // CJS/ESM interop shape trips up eslint-plugin-import's static analysis
    // (false-positive "no default export"/parse errors). These imports are
    // resolved correctly by Vite at runtime.
    files: ['*.config.{js,cjs}'],
    rules: {
      'import/default': 'off',
      'import/namespace': 'off',
      'import/no-named-as-default': 'off',
      'import/no-named-as-default-member': 'off'
    }
  },
  prettierConfig
];
