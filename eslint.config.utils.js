import pluginJs from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier';
import eslintPluginJest from 'eslint-plugin-jest';
import eslintPluginJestDom from 'eslint-plugin-jest-dom';
import eslintPluginPrettier from 'eslint-plugin-prettier/recommended';
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
      ...eslintPluginUnicorn.configs['flat/recommended'].rules,
      'unicorn/switch-case-braces': ['error', 'avoid'],
      'unicorn/prefer-logical-operator-over-ternary': 'off',
      'unicorn/prefer-string-replace-all': 'off',
      'unicorn/no-nested-ternary': 'off',
      'unicorn/no-array-reduce': 'off',
      'unicorn/prefer-at': 'off',
      'unicorn/no-null': 'off',
      'unicorn/filename-case': ['error', { cases: { kebabCase: true, pascalCase: true } }],
      'unicorn/prevent-abbreviations': ['error', setUnicornAllowList(allowList)],
      ...rules,
    },
  };
}

//

export function setEslintPluginJest({ rules } = {}) {
  return {
    ...eslintPluginJest.configs['flat/recommended'],
    rules: {
      ...eslintPluginJest.configs['flat/recommended'].rules,
      ...rules,
    },
  };
}

export function setEslintPluginJestDom({ rules } = {}) {
  return {
    ...eslintPluginJestDom.configs['flat/recommended'],
    rules: {
      ...eslintPluginJestDom.configs['flat/recommended'].rules,
      ...rules,
    },
  };
}

//

export function setEslintPluginPrettier({ rules } = {}) {
  return {
    ...eslintPluginPrettier,
    rules: {
      ...eslintConfigPrettier.rules,
      ...rules,
    },
  };
}

//

export function setEslintPluginTypescriptEslint({ rules } = {}) {
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
