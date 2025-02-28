const prettier = require('eslint-plugin-prettier');
const checkFile = require('eslint-plugin-check-file');
const globals = require('globals');
const react = require('eslint-plugin-react');
const reactHooks = require('eslint-plugin-react-hooks');

module.exports = [
  {
    plugins: {
      'check-file': checkFile,
      react: react,
      'react-hooks': reactHooks,
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
    ignores: ['node_modules/', 'build/', 'dist/'],
    files: ['src/**/*'],
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
];
