// @see: https://github.com/locutusjs/locutus/blob/master/src/php/xml/utf8_decode.js
//       Latest commit 0dbbcfc on 19 Nov 2020

export function utf8Decode(string: string) {
  // eslint-disable-line camelcase
  //  discuss at: https://locutus.io/php/utf8_decode/
  // original by: Webtoolkit.info (https://www.webtoolkit.info/)
  //    input by: Aman Gupta
  //    input by: Brett Zamir (https://brett-zamir.me)
  // improved by: Kevin van Zonneveld (https://kvz.io)
  // improved by: Norman "zEh" Fuchs
  // bugfixed by: hitwork
  // bugfixed by: Onno Marsman (https://twitter.com/onnomarsman)
  // bugfixed by: Kevin van Zonneveld (https://kvz.io)
  // bugfixed by: kirilloid
  // bugfixed by: w35l3y (https://www.wesley.eti.br)
  //   example 1: utf8_decode('Kevin van Zonneveld')
  //   returns 1: 'Kevin van Zonneveld'

  let strData = string;
  if (strData === null || strData === undefined) {
    return '';
  }

  const tmpArr = [];
  let index = 0;
  let c1 = 0;
  let seqlen = 0;

  strData = String(strData);

  while (index < strData.length) {
    c1 = strData.charCodeAt(index) & 0xff;
    seqlen = 0;

    // https://en.wikipedia.org/wiki/UTF-8#Codepage_layout
    if (c1 <= 0xbf) {
      c1 = c1 & 0x7f;
      seqlen = 1;
    } else if (c1 <= 0xdf) {
      c1 = c1 & 0x1f;
      seqlen = 2;
    } else if (c1 <= 0xef) {
      c1 = c1 & 0x0f;
      seqlen = 3;
    } else {
      c1 = c1 & 0x07;
      seqlen = 4;
    }

    for (let ai = 1; ai < seqlen; ++ai) {
      c1 = (c1 << 0x06) | (strData.charCodeAt(ai + index) & 0x3f);
    }

    if (seqlen === 4) {
      c1 -= 0x1_00_00;
      tmpArr.push(
        String.fromCharCode(0xd8_00 | ((c1 >> 10) & 0x3_ff)),
        String.fromCharCode(0xdc_00 | (c1 & 0x3_ff)),
      );
    } else {
      tmpArr.push(String.fromCharCode(c1));
    }

    index += seqlen;
  }

  return tmpArr.join('');
}
