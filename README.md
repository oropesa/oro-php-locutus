# Oro Php Locutus

* [Overview](#overview)
* [Installation](#installation)
* [Methods](#methods)
  * [serialize()](#serialize)
  * [unserialize()](#unserialize)
  * [htmlspecialchars()](#htmlspecialchars)
  * [utf8Encode()](#utf8encode)
  * [utf8Decode()](#utf8decode)
  * [md5()](#md5)

## Overview

[Locutus](https://locutus.io/php/) is a project that seeks to assimilate other languages’ standard libraries to JavaScript.

Locutus is a huge library created by a community effort, so instead of downloading all their code, this is just a piece of it.

This package is a fork of few Locutus functions that have been rewritten in TypeScript.

These functions have no dependencies and are _browser friendly_.

## Installation

```shell
npm install oro-php-locutus
```

## Methods

### serialize()
```ts
serialize( mixedValue: any ): string
```

Here's what [Locutus JavaScript](https://github.com/locutusjs/locutus/blob/master/src/php/var/serialize.js)
equivalent to [PHP's serialize](https://www.php.net/manual/en/function.serialize.php) looks like.

```js
// cjs
const { serialize } = require( 'oro-php-locutus' );
// mjs, ts
import { serialize } from 'oro-php-locutus';

serialize( { chacho: true, tio: 17 } );
// 'a:2:{s:6:"chacho";b:1;s:3:"tio";i:17;}'

serialize( [ 'chacho', '', true, false, 1, 2.3 ] );
// 'a:6:{i:0;s:6:"chacho";i:1;s:0:"";i:2;b:1;i:3;b:0;i:4;i:1;i:5;d:2.3;}'
```

### unserialize()
```ts
unserialize( str: string ): string
```

Here's what [Locutus JavaScript](https://github.com/locutusjs/locutus/blob/master/src/php/var/unserialize.js)
equivalent to [PHP's unserialize](https://www.php.net/manual/en/function.unserialize.php) looks like.

```js
// cjs
const { unserialize } = require( 'oro-php-locutus' );
// mjs, ts
import { unserialize } from 'oro-php-locutus';

unserialize( 'a:2:{s:6:"chacho";b:1;s:3:"tio";i:17;}' );
// { chacho: true, tio: 17 }

unserialize( 'a:6:{i:0;s:6:"chacho";i:1;s:0:"";i:2;b:1;i:3;b:0;i:4;i:1;i:5;d:2.3;}' );
// [ 'chacho', '', true, false, 1, 2.3 ]
```

### htmlspecialchars()
```ts
htmlspecialchars(
  string: string,
  quoteStyle?: ENT_OPTION | ENT_OPTION[],
  charset?: null,
  doubleEncode?: boolean
): string

type ENT_OPTION =
  | 0 | 'ENT_NOQUOTES'
  | 1 | 'ENT_HTML_QUOTE_SINGLE'
  | 2 | 'ENT_HTML_QUOTE_DOUBLE'
      | 'ENT_COMPAT'
  | 3 | 'ENT_QUOTES'
  | 4 | 'ENT_IGNORE'
```

Here's what [Locutus JavaScript](https://github.com/locutusjs/locutus/blob/master/src/php/strings/htmlspecialchars.js)
equivalent to [PHP's unserialize](https://www.php.net/manual/en/function.htmlspecialchars.php) looks like.

```js
// js
const { htmlspecialchars } = require( 'oro-php-locutus' );
// ts
import { htmlspecialchars } from 'oro-php-locutus';

htmlspecialchars( '<a href="test">Test</a>', 'ENT_QUOTES' );
// '&amp;lt;a href=&amp;quot;test&amp;quot;&amp;gt;Test&amp;lt;/a&amp;gt;'
```

### utf8Encode()
```ts
utf8Encode( str: string ): string
```

Here's what [Locutus JavaScript](https://github.com/locutusjs/locutus/blob/master/src/php/xml/utf8_encode.js)
equivalent to [PHP's unserialize](https://www.php.net/manual/en/function.utf8-encode.php) looks like.

```js
// cjs
const { utf8Encode } = require( 'oro-php-locutus' );
// mjs, ts
import { utf8Encode } from 'oro-php-locutus';

utf8Encode( 'Chacho' );
// 'Chacho'

utf8Encode( 'cañón' );
// 'caÃ±Ã³n'
```

### utf8Decode()
```ts
utf8Decode( str: string ): string
```

Here's what [Locutus JavaScript](https://github.com/locutusjs/locutus/blob/master/src/php/xml/utf8_decode.js)
equivalent to [PHP's unserialize](https://www.php.net/manual/en/function.utf8-decode.php) looks like.

```js
// cjs
const { utf8Decode } = require( 'oro-php-locutus' );
// mjs, ts
import { utf8Decode } from 'oro-php-locutus';

utf8Decode( 'Chacho' );
// 'Chacho'

utf8Decode( 'caÃ±Ã³n' );
// 'cañón'
```

### md5()
```ts
md5( str: string ): string
```

Here's what [Locutus JavaScript](https://github.com/locutusjs/locutus/blob/master/src/php/strings/md5.js)
equivalent to [PHP's unserialize](https://www.php.net/manual/en/function.md5.php) looks like.

```js
// cjs
const { md5 } = require( 'oro-php-locutus' );
// mjs, ts
import { md5 } from 'oro-php-locutus';

md5( 'chacho' );
// '496c84fb22e82d68fad9e5fe8e89d03d'
```
