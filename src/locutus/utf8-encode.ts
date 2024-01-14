// @see: https://github.com/locutusjs/locutus/blob/master/src/php/xml/utf8_encode.js
//       Latest commit 0dbbcfc on 19 Nov 2020

export function utf8Encode(string: string) {
  // eslint-disable-line camelcase
  //  discuss at: https://locutus.io/php/utf8_encode/
  // original by: Webtoolkit.info (https://www.webtoolkit.info/)
  // improved by: Kevin van Zonneveld (https://kvz.io)
  // improved by: sowberry
  // improved by: Jack
  // improved by: Yves Sucaet
  // improved by: kirilloid
  // bugfixed by: Onno Marsman (https://twitter.com/onnomarsman)
  // bugfixed by: Onno Marsman (https://twitter.com/onnomarsman)
  // bugfixed by: Ulrich
  // bugfixed by: Rafał Kukawski (https://blog.kukawski.pl)
  // bugfixed by: kirilloid
  //   example 1: utf8_encode('Kevin van Zonneveld')
  //   returns 1: 'Kevin van Zonneveld'

  if (string === null || string === undefined) {
    return '';
  }

  // .replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  const strData = String(string);
  let utftext = '';
  let start;
  let end;
  const stringl = strData.length;

  start = end = 0;
  for (let n = 0; n < stringl; n++) {
    let c1 = strData.charCodeAt(n);
    let enc = null;

    if (c1 < 128) {
      end++;
    } else if (c1 > 127 && c1 < 2048) {
      enc = String.fromCharCode((c1 >> 6) | 192, (c1 & 63) | 128);
    } else if ((c1 & 0xf8_00) !== 0xd8_00) {
      enc = String.fromCharCode((c1 >> 12) | 224, ((c1 >> 6) & 63) | 128, (c1 & 63) | 128);
    } else {
      // surrogate pairs
      if ((c1 & 0xfc_00) !== 0xd8_00) {
        throw new RangeError('Unmatched trail surrogate at ' + n);
      }
      const c2 = strData.charCodeAt(++n);
      if ((c2 & 0xfc_00) !== 0xdc_00) {
        throw new RangeError('Unmatched lead surrogate at ' + (n - 1));
      }
      c1 = ((c1 & 0x3_ff) << 10) + (c2 & 0x3_ff) + 0x1_00_00;
      enc = String.fromCharCode(
        (c1 >> 18) | 240,
        ((c1 >> 12) & 63) | 128,
        ((c1 >> 6) & 63) | 128,
        (c1 & 63) | 128,
      );
    }
    if (enc !== null) {
      if (end > start) {
        utftext += strData.slice(start, end);
      }
      utftext += enc;
      start = end = n + 1;
    }
  }

  if (end > start) {
    utftext += strData.slice(start, stringl);
  }

  return utftext;
}
