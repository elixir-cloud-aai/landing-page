const prettier = require('eslint-plugin-prettier');
const checkFile = require('eslint-plugin-check-file');
const globals = require('globals');
const nextCoreWebVitals = require('eslint-config-next/core-web-vitals');
const nextTypescript = require('eslint-config-next/typescript');
const prettierConfig = require('eslint-config-prettier');

// Next.js's recommended flat config (with typescript-eslint, which parses
// the `.ts`/`.tsx` sources), then the project's own rules
module.exports = [
  {
    ignores: [
      '.next/',
      'out/',
      // Generated or third-party files; the handwritten service worker is linted
      'public/*',
      '!public/sw.js',
      'coverage/',
      'node_modules/',
      '.npm-cache/',
      'next-env.d.ts',
    ],
  },
  ...nextCoreWebVitals,
  ...nextTypescript,
  prettierConfig,
  {
    plugins: {
      'check-file': checkFile,
      prettier: prettier,
    },
    rules: {
      // Possible errors
      'no-console': 'warn',
      // Best practices
      'dot-notation': 'error',
      'no-else-return': 'error',
      'no-floating-decimal': 'error',
      'no-sequences': 'error',
      // Stylistic
      'array-bracket-spacing': 'error',
      'computed-property-spacing': ['error', 'never'],
      curly: 'error',
      'no-lonely-if': 'error',
      'no-unneeded-ternary': 'error',
      'one-var-declaration-per-line': 'error',
      quotes: [
        'error',
        'single',
        {
          allowTemplateLiterals: true,
          avoidEscape: true,
        },
      ],
      // ES6
      'array-callback-return': 'error',
      'prefer-const': 'error',
      // Imports
      'import/prefer-default-export': 'off',
      'sort-imports': [
        'error',
        {
          ignoreCase: true,
          ignoreDeclarationSort: true,
        },
      ],
      'no-unused-expressions': 'off',
      'no-prototype-builtins': 'off',
      // REACT
      'react/jsx-uses-react': 'off',
      'react/react-in-jsx-scope': 'off',
      'jsx-a11y/href-no-hash': [0],
      'react/display-name': 0,
      'react/no-deprecated': 'error',
      'react/no-unsafe': [
        'error',
        {
          checkAliases: true,
        },
      ],
      'react/jsx-sort-props': [
        'error',
        {
          ignoreCase: false,
        },
      ],
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 0,
      'react/jsx-fragments': ['error', 'syntax'],
      'react/jsx-no-useless-fragment': 'error',
      // Prettier
      // eslint looks for the prettier config at the top level of the package/app
      // but the config lives in the `config/` directory. Passing the config here
      // to get around this.
      'prettier/prettier': 'error',
      'no-process-env': 'off',
    },
    settings: {
      react: {
        version: 'detect',
        reactStrictMode: true,
      },
    },
    languageOptions: {
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.commonjs,
        ...globals.es2021,
      },
    },
  },
  {
    rules: {
      // Switching to next/image changes how images load and are sized; a
      // change of its own, not part of enabling the linter
      '@next/next/no-img-element': 'off',
    },
  },
  // The scripts are command-line tools that report on the console
  {
    files: ['scripts/**'],
    rules: { 'no-console': 'off' },
  },
  // The service worker runs with the service worker's globals
  {
    files: ['public/sw.js'],
    languageOptions: { globals: { ...globals.serviceworker } },
  },
  // The configuration files are CommonJS
  {
    files: ['**/*.js'],
    rules: { '@typescript-eslint/no-require-imports': 'off' },
  },
];
