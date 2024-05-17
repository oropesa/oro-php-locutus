import pluginJs from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier';
import eslintPluginJest from 'eslint-plugin-jest';
import eslintPluginUnicorn from 'eslint-plugin-unicorn';
import globals from 'globals';
import tseslint from 'typescript-eslint';

//

export function setEslintLanguageOptionsBrowser() {
  return { languageOptions: { globals: globals.browser } };
}

//

function setUnicornAllowList(list) {
  return {
    allowList: list.reduce((list, key) => {
      list[key] = true;
      return list;
    }, {}),
  };
}

export function setEslintPluginUnicorn({ ignores, rules, allowList }) {
  return {
    ...eslintPluginUnicorn.configs['flat/recommended'],
    ignores,
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

export function setEslintPluginJest({ ignores, rules }) {
  return {
    ...eslintPluginJest.configs['flat/recommended'],
    files: ['tests/**'],
    ignores,
    rules: {
      ...eslintPluginJest.configs['flat/recommended'].rules,
      ...rules,
    },
  };
}

//

export function setEslintPluginPrettier({ ignores, rules }) {
  return { ...eslintConfigPrettier, ignores, rules: { ...rules } };
}

//

export function setEslintPluginTypescripEslint({ ignores, rules }) {
  return [
    { ...pluginJs.configs.recommended, ignores },
    ...tseslint.configs.recommended,

    {
      ignores,
      rules: {
        'max-params': ['error', 4],
        'no-unused-vars': 'off',
        ...rules,
      },
    },
    {
      rules: {
        '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
        '@typescript-eslint/no-var-requires': 'off',
        ...rules,
      },
    },
  ];
}
