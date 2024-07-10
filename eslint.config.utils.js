import pluginJs from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier';
import eslintPluginJest from 'eslint-plugin-jest';
import eslintPluginUnicorn from 'eslint-plugin-unicorn';
import globals from 'globals';
import tseslint from 'typescript-eslint';

//

export const DEFAULT_IGNORES = ['coverage/*', 'dist/*', 'tmp.js', '**/*.test.js', '**/*.cjs'];

//

export function setEslintLanguageOptionsBrowser() {
  return { languageOptions: { globals: globals.browser } };
}

//

function setUnicornAllowList(list = []) {
  return {
    allowList: list.reduce((list, key) => {
      list[key] = true;
      return list;
    }, {}),
  };
}

export function setEslintPluginUnicorn({ rules, allowList } = {}) {
  return {
    ...eslintPluginUnicorn.configs['flat/recommended'],

    rules: {
      'unicorn/switch-case-braces': ['error', 'avoid'],
      'unicorn/prefer-string-replace-all': 'off',
      'unicorn/no-nested-ternary': 'off',
      'unicorn/no-array-reduce': 'off',
      'unicorn/no-null': 'off',
      'unicorn/prevent-abbreviations': ['error', setUnicornAllowList(allowList)],
      ...rules,
    },
  };
}

//

export function setEslintPluginJest({ rules } = {}) {
  return {
    ...eslintPluginJest.configs['flat/recommended'],
    files: ['tests/**'],
    rules: {
      ...eslintPluginJest.configs['flat/recommended'].rules,
      ...rules,
    },
  };
}

//

export function setEslintPluginPrettier({ rules } = {}) {
  return { ...eslintConfigPrettier, rules: { ...rules } };
}

//

export function setEslintPluginTypescripEslint({ rules } = {}) {
  return [
    { ...pluginJs.configs.recommended },
    ...tseslint.configs.recommended,

    {
      rules: {
        'max-params': ['error', 4],
        'no-unused-vars': 'off',
        '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
        '@typescript-eslint/no-var-requires': 'off',
        ...rules,
      },
    },
  ];
}
