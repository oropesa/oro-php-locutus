// @see: https://github.com/locutusjs/locutus/blob/master/src/php/var/unserialize.js
//       Latest commit 5080992 04 Apr 2024

export function unserialize(string: string, showError = false): any {
  //       discuss at: https://locutus.io/php/unserialize/
  //      original by: Arpad Ray (mailto:arpad@php.net)
  //      improved by: Pedro Tainha (https://www.pedrotainha.com)
  //      improved by: Kevin van Zonneveld (https://kvz.io)
  //      improved by: Kevin van Zonneveld (https://kvz.io)
  //      improved by: Chris
  //      improved by: James
  //      improved by: Le Torbi
  //      improved by: Eli Skeggs
  //      bugfixed by: dptr1988
  //      bugfixed by: Kevin van Zonneveld (https://kvz.io)
  //      bugfixed by: Brett Zamir (https://brett-zamir.me)
  //      bugfixed by: philippsimon (https://github.com/philippsimon/)
  //       revised by: d3x
  //         input by: Brett Zamir (https://brett-zamir.me)
  //         input by: Martin (https://www.erlenwiese.de/)
  //         input by: kilops
  //         input by: Jaroslaw Czarniak
  //         input by: lovasoa (https://github.com/lovasoa/)
  //      improved by: Rafał Kukawski
  // reimplemented by: Rafał Kukawski
  //           note 1: We feel the main purpose of this function should be
  //           note 1: to ease the transport of data between php & js
  //           note 1: Aiming for PHP-compatibility, we have to translate objects to arrays
  //        example 1: unserialize('a:3:{i:0;s:5:"Kevin";i:1;s:3:"van";i:2;s:9:"Zonneveld";}')
  //        returns 1: ['Kevin', 'van', 'Zonneveld']
  //        example 2: unserialize('a:2:{s:9:"firstName";s:5:"Kevin";s:7:"midName";s:3:"van";}')
  //        returns 2: {firstName: 'Kevin', midName: 'van'}
  //        example 3: unserialize('a:3:{s:2:"ü";s:2:"ü";s:3:"四";s:3:"四";s:4:"𠜎";s:4:"𠜎";}')
  //        returns 3: {'ü': 'ü', '四': '四', '𠜎': '𠜎'}
  //        example 4: unserialize(undefined)
  //        returns 4: false
  //        example 5: unserialize('O:8:"stdClass":1:{s:3:"foo";b:1;}')
  //        returns 5: { foo: true }
  //        example 6: unserialize('a:2:{i:0;N;i:1;s:0:"";}')
  //        returns 6: [null, ""]
  //        example 7: unserialize('S:7:"\\65\\73\\63\\61\\70\\65\\64";')
  //        returns 7: 'escaped'

  try {
    if (typeof string !== 'string') {
      return string;
    }

    return expectType(string, initCache())[0];
  } catch (error) {
    if (showError) {
      console.error(error);
    }
    return string;
  }
}

function initCache() {
  const store: any[] = [];
  // cache only first element, second is length to jump ahead for the parser
  const cache = function cache(value: any[]) {
    store.push(value[0]);
    return value;
  };

  cache.get = (index: number) => {
    if (index >= store.length) {
      throw new RangeError(`Can't resolve reference ${index + 1}`);
    }

    return store[index];
  };

  return cache;
}

function expectType(string: string, cache: any): [any, number] {
  const types = /^(?:N(?=;)|[CORSabdirs](?=:)|[^:]+(?=:))/g;
  const type = (types.exec(string) || [])[0];

  if (!type) {
    throw new SyntaxError('Invalid input: ' + string);
  }

  switch (type) {
    case 'N':
      return cache([null, 2]);
    case 'b':
      return cache(expectBool(string));
    case 'i':
      return cache(expectInt(string));
    case 'd':
      return cache(expectFloat(string));
    case 's':
      return cache(expectString(string));
    case 'S':
      return cache(expectEscapedString(string));
    case 'a':
      return expectArray(string, cache);
    case 'O':
      return expectObject(string, cache);
    case 'C':
      throw new Error('Not yet implemented');
    // return expectClass(string, cache);
    case 'r':
    case 'R':
      return expectReference(string, cache);
    default:
      throw new SyntaxError(`Invalid or unsupported data type: ${type}`);
  }
}

function expectBool(string: string): [boolean, number] {
  const reBool = /^b:([01]);/;
  const [match, boolMatch] = reBool.exec(string) || [];

  if (!boolMatch) {
    throw new SyntaxError('Invalid bool value, expected 0 or 1');
  }

  return [boolMatch === '1', match!.length];
}

function expectInt(string: string): [number, number] {
  const reInt = /^i:([+-]?\d+);/;
  const [match, intMatch] = reInt.exec(string) || [];

  if (!intMatch) {
    throw new SyntaxError('Expected an integer value');
  }

  return [Number.parseInt(intMatch, 10), match!.length];
}

function expectFloat(string: string): [number, number] {
  const reFloat = /^d:(NAN|-?INF|(?:\d+\.\d*|\d*\.\d+|\d+)(?:[Ee][+-]\d+)?);/;
  const [match, floatMatch] = reFloat.exec(string) || [];

  if (!floatMatch) {
    throw new SyntaxError('Expected a float value');
  }

  let floatValue;

  switch (floatMatch) {
    case 'NAN':
      floatValue = Number.NaN;
      break;
    case '-INF':
      floatValue = Number.NEGATIVE_INFINITY;
      break;
    case 'INF':
      floatValue = Number.POSITIVE_INFINITY;
      break;
    default:
      floatValue = Number.parseFloat(floatMatch);
      break;
  }

  return [floatValue, match!.length];
}

function readBytes(string: string, length: number, escapedString = false): [string, number, number] {
  let bytes = 0;
  let out = '';
  let c = 0;
  const stringLength = string.length;
  let wasHighSurrogate = false;
  let escapedChars = 0;

  while (bytes < length && c < stringLength) {
    let chr = string.charAt(c);
    const code = chr.charCodeAt(0);
    const isHighSurrogate = code >= 0xd8_00 && code <= 0xdb_ff;
    const isLowSurrogate = code >= 0xdc_00 && code <= 0xdf_ff;

    if (escapedString && chr === '\\') {
      chr = String.fromCharCode(Number.parseInt(string.slice(c + 1, 2), 16));
      escapedChars++;

      // each escaped sequence is 3 characters. Go 2 chars ahead.
      // third character will be jumped over a few lines later
      c += 2;
    }

    c++;

    bytes +=
      isHighSurrogate || (isLowSurrogate && wasHighSurrogate)
        ? // if high surrogate, count 2 bytes, as expectation is to be followed by low surrogate
          // if low surrogate preceded by high surrogate, add 2 bytes
          2
        : code > 0x7_ff
          ? // otherwise low surrogate falls into this part
            3
          : code > 0x7f
            ? 2
            : 1;

    // if high surrogate is not followed by low surrogate, add 1 more byte
    bytes += wasHighSurrogate && !isLowSurrogate ? 1 : 0;

    out += chr;
    wasHighSurrogate = isHighSurrogate;
  }

  return [out, bytes, escapedChars];
}

function expectString(string: string): [string, number] {
  // PHP strings consist of one-byte characters.
  // JS uses 2 bytes with possible surrogate pairs.
  // Serialized length of 2 is still 1 JS string character
  const reStringLength = /^s:(\d+):"/g; // also match the opening " char
  const [match, byteLengthMatch] = reStringLength.exec(string) || [];

  if (!match) {
    throw new SyntaxError('Expected a string value');
  }

  const length = Number.parseInt(byteLengthMatch, 10);

  string = string.slice(match.length);

  const [stringMatch, bytes] = readBytes(string, length);

  if (bytes !== length) {
    throw new SyntaxError(`Expected string of ${length} bytes, but got ${bytes}`);
  }

  string = string.slice(stringMatch.length);

  // strict parsing, match closing "; chars
  if (!string.startsWith('";')) {
    throw new SyntaxError('Expected ";');
  }

  return [stringMatch, match.length + stringMatch.length + 2]; // skip last ";
}

function expectEscapedString(string: string): [string, number] {
  const reStringLength = /^S:(\d+):"/g; // also match the opening " char
  const [match, stringLengthMatch] = reStringLength.exec(string) || [];

  if (!match) {
    throw new SyntaxError('Expected an escaped string value');
  }

  const length = Number.parseInt(stringLengthMatch, 10);

  string = string.slice(match.length);

  const [stringMatch, bytes, escapedChars] = readBytes(string, length, true);

  if (bytes !== length) {
    throw new SyntaxError(`Expected escaped string of ${length} bytes, but got ${bytes}`);
  }

  string = string.slice(stringMatch.length + escapedChars * 2);

  // strict parsing, match closing "; chars
  if (!string.startsWith('";')) {
    throw new SyntaxError('Expected ";');
  }

  return [stringMatch, match.length + stringMatch.length + 2]; // skip last ";
}

function expectKeyOrIndex(string: string): [string | number, number] {
  try {
    return expectString(string);
  } catch {}

  try {
    return expectEscapedString(string);
  } catch {}

  try {
    return expectInt(string);
  } catch {
    throw new SyntaxError('Expected key or index');
  }
}

function expectObject(string: string, cache: any): [object, number] {
  // O:<class name length>:"class name":<prop count>:{<props and values>}
  // O:8:"stdClass":2:{s:3:"foo";s:3:"bar";s:3:"bar";s:3:"baz";}
  const reObjectLiteral = /^O:(\d+):"([^"]+)":(\d+):{/;
  const [objectLiteralBeginMatch /* classNameLengthMatch */, , className, propertyCountMatch] =
    reObjectLiteral.exec(string) || [];

  if (!objectLiteralBeginMatch) {
    throw new SyntaxError('Invalid input');
  }

  if (className !== 'stdClass') {
    throw new SyntaxError(`Unsupported object type: ${className}`);
  }

  let totalOffset = objectLiteralBeginMatch.length;

  const propertyCount = Number.parseInt(propertyCountMatch, 10);
  const object: { [key in string]: any } = {};
  cache([object]);

  string = string.slice(totalOffset);

  for (let index = 0; index < propertyCount; index++) {
    const property = expectKeyOrIndex(string);
    string = string.slice(property[1]);
    totalOffset += property[1];

    const value = expectType(string, cache);
    string = string.slice(value[1]);
    totalOffset += value[1];

    object[property[0]] = value[0];
  }

  // strict parsing, expect } after object literal
  if (string.charAt(0) !== '}') {
    throw new SyntaxError('Expected }');
  }

  return [object, totalOffset + 1]; // skip final }
}

// function expectClass(string, cache) {
//   // can't be well supported, because requires calling eval (or similar)
//   // in order to call serialized constructor name
//   // which is unsafe
//   // or assume that constructor is defined in global scope
//   // but this is too much limiting
//   throw new Error('Not yet implemented');
// }

function expectReference(string: string, cache: any): [any, number] {
  const reReference = /^[Rr]:([1-9]\d*);/;
  const [match, referenceIndex] = reReference.exec(string) || [];

  if (!match) {
    throw new SyntaxError('Expected reference value');
  }

  return [cache.get(Number.parseInt(referenceIndex, 10) - 1), match.length];
}

function expectArray(string: string, cache: any): [any, number] {
  const reArrayLength = /^a:(\d+):{/;
  const [arrayLiteralBeginMatch, arrayLengthMatch] = reArrayLength.exec(string) || [];

  if (!arrayLengthMatch) {
    throw new SyntaxError('Expected array length annotation');
  }

  string = string.slice(arrayLiteralBeginMatch!.length);

  const array = expectArrayItems(string, Number.parseInt(arrayLengthMatch, 10), cache);

  // strict parsing, expect closing } brace after array literal
  if (string.charAt(array[1]) !== '}') {
    throw new SyntaxError('Expected }');
  }

  return [array[0], arrayLiteralBeginMatch!.length + array[1] + 1]; // jump over }
}

function expectArrayItems(string: string, expectedItems = 0, cache: any): [object, number] {
  let key;
  let item;
  let totalOffset = 0;
  let hasContinousIndexes = true;
  let lastIndex = -1;
  let items: { [key in string]: any } = {};
  cache([items]);

  for (let index = 0; index < expectedItems; index++) {
    key = expectKeyOrIndex(string);

    hasContinousIndexes = hasContinousIndexes && typeof key[0] === 'number' && key[0] === lastIndex + 1;
    lastIndex = key[0] as number;

    string = string.slice(key[1]);
    totalOffset += key[1];

    // references are resolved immediately, so if duplicate key overwrites previous array index
    // the old value is anyway resolved
    // fixme: but next time the same reference should point to the new value
    item = expectType(string, cache);
    string = string.slice(item[1]);
    totalOffset += item[1];

    items[key[0]] = item[0];
  }

  if (hasContinousIndexes) {
    items = Object.values(items);
  }

  return [items, totalOffset];
}
