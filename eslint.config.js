import {
  setEslintLanguageOptionsBrowser,
  setEslintPluginJest,
  setEslintPluginPrettier,
  setEslintPluginTypescripEslint,
  setEslintPluginUnicorn,
} from './eslint.config.utils.js';

const ignores = ['coverage/*', 'dist/*', 'tmp.js', '**/*.test.js', '**/*.cjs'];

const allowList = ['tmp', 'optTemp', 'strData', 'tmpArr'];

export default [
  setEslintLanguageOptionsBrowser(),
  setEslintPluginUnicorn({ ignores, allowList }),
  setEslintPluginJest({ ignores }),
  setEslintPluginPrettier({ ignores }),
  ...setEslintPluginTypescripEslint({
    ignores,
    rules: {
      'no-empty': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
    },
  }),
];
