# Oro Php Locutus

* [Overview](#overview)
* [Installation](#installation)
* [Methods](#methods)
  * [serialize( mixedValue )](#serialize-mixedvalue-)
  * [unserialize( str )](#unserialize-str-)
  * [htmlspecialchars( str, quoteStyle )](#htmlspecialchars-str-quotestyle-)
  * [utf8Encode( str )](#utf8encode-str-)
  * [utf8Decode( str )](#utf8decode-str-)
  * [md5( str )](#md5-str-)

## Overview

[Locutus](https://locutus.io/php/) is a project that seeks to assimilate other languagesâ€™ standard libraries to JavaScript.

Locutus is a huge library created by a community effort, so instead of downloading all their code, this is just a piece of it.

## Installation

```shell
npm install oro-php-locutus
```

## Methods

### serialize( mixedValue )

Here's what [Locutus JavaScript](https://github.com/locutusjs/locutus/blob/master/src/php/var/serialize.js)
equivalent to [PHP's serialize](https://www.php.net/manual/en/function.serialize.php) looks like.

```js
serialize( { chacho: true, tio: 17 } );
// 'a:2:{s:6:"chacho";b:1;s:3:"tio";i:17;}'

serialize( [ 'chacho', '', true, false, 1, 2.3 ] );
// 'a:6:{i:0;s:6:"chacho";i:1;s:0:"";i:2;b:1;i:3;b:0;i:4;i:1;i:5;d:2.3;}'
```

### unserialize( str )

Here's what [Locutus JavaScript](https://github.com/locutusjs/locutus/blob/master/src/php/var/unserialize.js)
equivalent to [PHP's unserialize](https://www.php.net/manual/en/function.unserialize.php) looks like.

```js
unserialize( 'a:2:{s:6:"chacho";b:1;s:3:"tio";i:17;}' );
// { chacho: true, tio: 17 }

unserialize( 'a:6:{i:0;s:6:"chacho";i:1;s:0:"";i:2;b:1;i:3;b:0;i:4;i:1;i:5;d:2.3;}' );
// [ 'chacho', '', true, false, 1, 2.3 ]
```

### htmlspecialchars( str, quoteStyle )

Here's what [Locutus JavaScript](https://github.com/locutusjs/locutus/blob/master/src/php/strings/htmlspecialchars.js)
equivalent to [PHP's unserialize](https://www.php.net/manual/en/function.htmlspecialchars.php) looks like.

```js
htmlspecialchars( '<a href="test">Test</a>', 'ENT_QUOTES' );
// '&amp;lt;a href=&amp;quot;test&amp;quot;&amp;gt;Test&amp;lt;/a&amp;gt;'
```

### utf8Encode( str )

Here's what [Locutus JavaScript](https://github.com/locutusjs/locutus/blob/master/src/php/xml/utf8_encode.js)
equivalent to [PHP's unserialize](https://www.php.net/manual/en/function.utf8-encode.php) looks like.

```js
utf8Encode( 'Chacho' );
// 'Chacho'

utf8Encode( 'caĂ±Ăłn' );
// 'caĂ?Â±Ă?Âłn'
```

### utf8Decode( str )

Here's what [Locutus JavaScript](https://github.com/locutusjs/locutus/blob/master/src/php/xml/utf8_decode.js)
equivalent to [PHP's unserialize](https://www.php.net/manual/en/function.utf8-decode.php) looks like.

```js
utf8Decode( 'Chacho' );
// 'Chacho'

utf8Decode( 'caĂ?Â±Ă?Âłn' );
// 'caĂ±Ăłn'
```

### md5( str )

Here's what [Locutus JavaScript](https://github.com/locutusjs/locutus/blob/master/src/php/strings/md5.js)
equivalent to [PHP's unserialize](https://www.php.net/manual/en/function.md5.php) looks like.

```js
md5( 'chacho' );
// '496c84fb22e82d68fad9e5fe8e89d03d'
```
