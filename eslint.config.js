import {
  DEFAULT_IGNORES,
  setEslintLanguageOptionsBrowser,
  setEslintPluginJest,
  setEslintPluginJestDom,
  setEslintPluginPrettier,
  setEslintPluginTypescriptEslint,
  setEslintPluginUnicorn,
} from './eslint.config.utils.js';

const allowList = ['tmp', 'utils', 'optTemp', 'strData', 'tmpArr'];

export default [
  { ignores: DEFAULT_IGNORES },
  setEslintLanguageOptionsBrowser(),
  setEslintPluginUnicorn({
    allowList,
    rules: {
      'unicorn/prefer-code-point': 'off',
      'unicorn/consistent-function-scoping': 'off',
    },
  }),
  setEslintPluginJest(),
  setEslintPluginJestDom(),
  setEslintPluginPrettier(),
  ...setEslintPluginTypescriptEslint({
    rules: {
      'no-empty': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
    },
  }),
];
