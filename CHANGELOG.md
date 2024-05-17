## 2.1.0 / 2024-05-17
* Improved _github cicd_ replacing `actions/--@v3` by `actions/--@v4`.
* Moved _tests_ inside `src` and simplified `*.test.js` to have only the _special-js_ cases.
* Updated *eslint* to flat `eslint.config.js`.
* Simplified `tsup.config.ts`.
* Re-init `package-lock.json`.
* Updated _dev_ libs:
  * `@babel/core` from `v7.23.7` to `v7.24.5`.
  * `@babel/preset-env` from `v7.23.8` to `v7.24.5`.
  * `@babel/preset-typescript` from `v7.23.3` to `v7.24.1`.
  * `@types/jest` from `v29.5.11` to `v29.5.12`.
  * `eslint` from `v8.56.0` to `v8.57.0`.
  * `eslint-plugin-jest` from `v27.6.3` to `v28.5.0`.
  * `eslint-plugin-unicorn` from `v50.0.1` to `v53.0.0`.
  * `husky` from `v8.0.3` to `v9.0.11`.
  * `nodemon` from `v3.0.2` to `v3.1.0`.
  * `prettier` from `v3.2.1` to `v3.2.5`.
  * `tsup` from `v8.0.1` to `v8.0.2`.
  * `typescript` from `v5.3.3` to `v5.4.5`.
* Added _dev_ libs:
  * `@eslint/js` added `v9.2.0`.
  * `globals` added `v15.2.0`.
  * `typescript-eslint` added `v7.9.0`.
* Removed _dev_ libs:
  * `@typescript-eslint/eslint-plugin` removed.
  * `@typescript-eslint/parser` removed.
  * `eslint-config-alloy` removed.

## 2.0.3 / 2024-01-14
* Added _coverage_ for testing.
* Added _watcher_ for coding.
* Improved _github cicd_ replacing `npm install` to `npm ci`.
* Improved `export` declarations if index files
* Enhanced _linter_ adding some extensions.
* Enhanced _prettier_ adding import-sorter.
* Enhanced testing to achieve the `95%` of coverage (yay!).
* Added const's:
  * `HTMLSPECIALCHARS_ENT_NOQUOTES`
  * `HTMLSPECIALCHARS_ENT_HTML_QUOTE_SINGLE`
  * `HTMLSPECIALCHARS_ENT_HTML_QUOTE_DOUBLE`
  * `HTMLSPECIALCHARS_ENT_COMPAT`
  * `HTMLSPECIALCHARS_ENT_QUOTES`
  * `HTMLSPECIALCHARS_ENT_IGNORE`
* Updated _dev_ libs:
  * `@babel/core` from `v7.23.3` to `v7.23.7`.
  * `@babel/preset-env` from `v7.23.3` to `v7.23.7`.
  * `@types/jest` from `v29.5.10` to `v29.5.11`.
  * `@typescript-eslint/eslint-plugin` from `v6.12.0` to `v6.18.1`.
  * `@typescript-eslint/parser` from `v6.12.0` to `v6.18.1`.
  * `eslint` from `v8.54.0` to `v^8.56.0`.
  * `eslint-plugin-unicorn` from `v49.0.0` to `v50.0.1`.
  * `prettier` from `v3.1.0` to `v3.2.1`.
  * `typescript` from `v5.2.2` to `v5.3.3`.
* Added _dev_ libs:
  * `@trivago/prettier-plugin-sort-imports`
  * `eslint-config-prettier`
  * `eslint-plugin-jest`
  * `nodemon`

## 2.0.2 / 2023-10-24
* Fixed _github action_ `npm_publish_on_pr_merge_to_master`.
* Updated _dev_ libs:
  * `@babel/core` from `v7.23.2` to `v7.23.3`.
  * `@babel/preset-env` from `v7.23.2` to `v7.23.3`.
  * `@babel/preset-typescript` from `v7.23.2` to `v7.23.3`.
  * `@types/jest` from `v29.5.6` to `v29.5.10`.
  * `@typescript-eslint/eslint-plugin` from `v6.9.0` to `v6.12.0`.
  * `@typescript-eslint/parser` from `v6.9.0` to `v6.12.0`.
  * `eslint` from `v8.52.0` to `v8.54.0`.
  * `eslint-plugin-unicorn` from `v48.0.1` to `v49.0.0`.
  * `prettier` from `v3.0.3` to `v3.1.0`.
  * `tsup` from `v7.2.0` to `v8.0.1`.
  
## 2.0.1 / 2023-10-24
* Updated _dev_ libs:
  * `@babel/core` from `v7.23.0` to `v7.23.2`.
  * `@babel/preset-env` from `v7.22.20` to `v7.23.2`.
  * `@babel/preset-typescript` from `v7.23.0` to `v7.23.2`.
  * `@types/jest` from `v29.5.5` to `v29.5.6`.
  * `@typescript-eslint/eslint-plugin` from `v6.7.4` to `v6.9.0`.
  * `@typescript-eslint/parser` from `v6.7.4` to `v6.9.0`.
  * `eslint` from `v8.50.0` to `v8.52.0`.

## 2.0.0 / 2023-10-06
* Refactored `*.js` to `src/*.ts`.
* Updated _package_ as `type: "module"`.
* Added `tsup` and now _package_ is compiled to `cjs` _(common)_ and `mjs` _(module)_.
* Added _github actions_:
    * `validate_pr_to_master`
    * `npm_publish_on_pr_merge_to_master`.
* Added `husky` (to ensure only valid commits).
* Added `eslint` (and applied it).
* Added `prettier` (and applied it).
* Updated _package description_
* Updated _dev_ libs:
    * `@babel/core` to `v7.23.0`.
    * `@babel/preset-env` to `v7.22.20`.
    * `@babel/preset-typescript` to `v7.23.0`.
    * `@types/jest` to `v29.5.5`.
    * `babel-jest` to `v29.7.0`.
    * `jest` to `v29.7.0`.

## 1.3.0 / 2023-05-11
* Added _ts tests_.
* Improved _tests_.
* Improved _readme_.
* Updated lib-dev `jest` to `v29.5.0`.
* Updated `index.d.ts` adding `export type ENT_OPTION`.

## 1.2.0 / 2023-03-03
* Added `Typescript`.
* Updated lib-dev `jest` to `v29.4.3`.

## 1.1.1 / 2022-08-16
* Updated _php function_ `unserialize`.

## 1.1.0 / 2022-08-02
* Updated _Readme_ and `tests/`.
* Added `package-lock.json`.
* Updated lib-dev `jest` to `v28.1.3`.

## 1.0.0 / 2021-08-17
* Added `MIT License`.
* Added _package_ in `github.com` & `npmjs.com`.
* Added _unit testing_ `Jest`.
* Removed _package_ `crypto`, instead of that, it uses _nodejs built-in_.

## 0.2.0 / 2021-05-17
* Added _php functions_ `md5`, `utf8Encode`, `utf8Decode`.
* Added _node_module_ `crypto` (`md5` requires it).

## 0.1.0 / 2021-05-14
* Added changelog.
* Added _php function_ `htmlspecialchars`.

## 0.0.1 / 2021-03-22
* Init _package_.