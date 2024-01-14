// @see: https://github.com/locutusjs/locutus/blob/master/src/php/var/serialize.js
//       Latest commit 0dbbcfc on 19 Nov 2020

export function serialize(mixedValue: any) {
  //  discuss at: https://locutus.io/php/serialize/
  // original by: Arpad Ray (mailto:arpad@php.net)
  // improved by: Dino
  // improved by: Le Torbi (https://www.letorbi.de/)
  // improved by: Kevin van Zonneveld (https://kvz.io/)
  // bugfixed by: Andrej Pavlovic
  // bugfixed by: Garagoth
  // bugfixed by: Russell Walker (https://www.nbill.co.uk/)
  // bugfixed by: Jamie Beck (https://www.terabit.ca/)
  // bugfixed by: Kevin van Zonneveld (https://kvz.io/)
  // bugfixed by: Ben (https://benblume.co.uk/)
  // bugfixed by: Codestar (https://codestarlive.com/)
  // bugfixed by: idjem (https://github.com/idjem)
  //    input by: DtTvB (https://dt.in.th/2008-09-16.string-length-in-bytes.html)
  //    input by: Martin (https://www.erlenwiese.de/)
  //      note 1: We feel the main purpose of this function should be to ease
  //      note 1: the transport of data between php & js
  //      note 1: Aiming for PHP-compatibility, we have to translate objects to arrays
  //   example 1: serialize(['Kevin', 'van', 'Zonneveld'])
  //   returns 1: 'a:3:{i:0;s:5:"Kevin";i:1;s:3:"van";i:2;s:9:"Zonneveld";}'
  //   example 2: serialize({firstName: 'Kevin', midName: 'van'})
  //   returns 2: 'a:2:{s:9:"firstName";s:5:"Kevin";s:7:"midName";s:3:"van";}'
  //   example 3: serialize( {'ü': 'ü', '四': '四', '𠜎': '𠜎'})
  //   returns 3: 'a:3:{s:2:"ü";s:2:"ü";s:3:"四";s:3:"四";s:4:"𠜎";s:4:"𠜎";}'

  let value;
  let key;
  let okey;
  let ktype = '';
  let vals = '';
  let count = 0;

  // eslint-disable-next-line unicorn/consistent-function-scoping
  const _utf8Size = function (string: string) {
    return ~-encodeURI(string).split(/%..|./).length;
  };

  type GetType =
    | 'string'
    | 'number'
    | 'bigint'
    | 'boolean'
    | 'symbol'
    | 'undefined'
    | 'object'
    | 'function'
    | 'array'
    | 'null';

  // eslint-disable-next-line unicorn/consistent-function-scoping
  const _getType = function (input: any): GetType {
    let match;
    let key;
    let cons;
    let types: GetType[];
    let type: GetType = typeof input;

    if (type === 'object' && !input) {
      return 'null';
    }

    if (type === 'object') {
      if (!input.constructor) {
        return 'object';
      }
      cons = input.constructor.toString();
      match = cons.match(/(\w+)\(/);
      if (match) {
        cons = match[1].toLowerCase();
      }
      types = ['boolean', 'number', 'string', 'array'];
      for (key in types) {
        if (cons === types[key]) {
          type = types[key];
          break;
        }
      }
    }
    return type;
  };

  const type = _getType(mixedValue);

  switch (type) {
    case 'function':
      value = '';
      break;
    case 'boolean':
      value = 'b:' + (mixedValue ? '1' : '0');
      break;
    case 'number':
      value = (Math.round(mixedValue) === mixedValue ? 'i' : 'd') + ':' + mixedValue;
      break;
    case 'string':
      value = 's:' + _utf8Size(mixedValue) + ':"' + mixedValue + '"';
      break;
    case 'array':
    case 'object':
      value = 'a';
      /*
      if (type === 'object') {
        var objname = mixedValue.constructor.toString().match(/(\w+)\(\)/);
        if (objname === undefined) {
          return;
        }
        objname[1] = serialize(objname[1]);
        val = 'O' + objname[1].substring(1, objname[1].length - 1);
      }
      */

      for (key in mixedValue) {
        if (Object.prototype.hasOwnProperty.call(mixedValue, key)) {
          ktype = _getType(mixedValue[key]);
          if (ktype === 'function') {
            continue;
          }

          okey = /^\d+$/.test(key) ? Number.parseInt(key, 10) : key;
          vals += serialize(okey) + serialize(mixedValue[key]);
          count++;
        }
      }
      value += ':' + count + ':{' + vals + '}';
      break;
    // case 'undefined':
    default:
      // Fall-through
      // if the JS object has a property which contains a null value,
      // the string cannot be unserialized by PHP
      value = 'N';
      break;
  }

  if (type !== 'object' && type !== 'array') {
    value += ';';
  }

  return value;
}
