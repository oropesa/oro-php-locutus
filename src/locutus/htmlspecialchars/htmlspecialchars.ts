// @see: https://github.com/locutusjs/locutus/blob/master/src/php/strings/htmlspecialchars.js
//       Latest commit 5080992 on 04 Apr 2024

type ENT_OPTION_STRING =
  | 'ENT_NOQUOTES'
  | 'ENT_HTML_QUOTE_SINGLE'
  | 'ENT_HTML_QUOTE_DOUBLE'
  | 'ENT_COMPAT'
  | 'ENT_QUOTES'
  | 'ENT_IGNORE';

type ENT_OPTION_NUMBER = 0 | 1 | 2 | 3 | 4;

export type ENT_OPTION = ENT_OPTION_STRING | ENT_OPTION_NUMBER;

export const HTMLSPECIALCHARS_ENT_NOQUOTES: ENT_OPTION_STRING = 'ENT_NOQUOTES' as const;
export const HTMLSPECIALCHARS_ENT_HTML_QUOTE_SINGLE: ENT_OPTION_STRING =
  'ENT_HTML_QUOTE_SINGLE' as const;
export const HTMLSPECIALCHARS_ENT_HTML_QUOTE_DOUBLE: ENT_OPTION_STRING =
  'ENT_HTML_QUOTE_DOUBLE' as const;
export const HTMLSPECIALCHARS_ENT_COMPAT: ENT_OPTION_STRING = 'ENT_COMPAT' as const;
export const HTMLSPECIALCHARS_ENT_QUOTES: ENT_OPTION_STRING = 'ENT_QUOTES' as const;
export const HTMLSPECIALCHARS_ENT_IGNORE: ENT_OPTION_STRING = 'ENT_IGNORE' as const;

export function htmlspecialchars(
  string: string,
  quoteStyle?: ENT_OPTION | ENT_OPTION[],
  charset?: null,
  doubleEncode?: boolean,
) {
  //       discuss at: https://locutus.io/php/htmlspecialchars/
  //      original by: Mirek Slugen
  //      improved by: Kevin van Zonneveld (https://kvz.io)
  //      bugfixed by: Nathan
  //      bugfixed by: Arno
  //      bugfixed by: Brett Zamir (https://brett-zamir.me)
  //      bugfixed by: Brett Zamir (https://brett-zamir.me)
  //       revised by: Kevin van Zonneveld (https://kvz.io)
  //         input by: Ratheous
  //         input by: Mailfaker (https://www.weedem.fr/)
  //         input by: felix
  // reimplemented by: Brett Zamir (https://brett-zamir.me)
  //           note 1: charset argument not supported
  //        example 1: htmlspecialchars("<a href='test'>Test</a>", 'ENT_QUOTES')
  //        returns 1: '&lt;a href=&#039;test&#039;&gt;Test&lt;/a&gt;'
  //        example 2: htmlspecialchars("ab\"c'd", ['ENT_NOQUOTES', 'ENT_QUOTES'])
  //        returns 2: 'ab"c&#039;d'
  //        example 3: htmlspecialchars('my "&entity;" is still here', null, null, false)
  //        returns 3: 'my &quot;&entity;&quot; is still here'
  let optTemp: ENT_OPTION_NUMBER = 0;
  let index = 0;
  let noquotes = false;
  if (quoteStyle === undefined || quoteStyle === null) {
    quoteStyle = 2;
  }
  string = string || '';
  string = string.toString();
  if (doubleEncode !== false) {
    // Put this first to avoid double-encoding
    string = string.replace(/&/g, '&amp;');
  }
  string = string.replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const OPTS: { [key in ENT_OPTION_STRING]: ENT_OPTION_NUMBER } = {
    ENT_NOQUOTES: 0,
    ENT_HTML_QUOTE_SINGLE: 1,
    ENT_HTML_QUOTE_DOUBLE: 2,
    ENT_COMPAT: 2,
    ENT_QUOTES: 3,
    ENT_IGNORE: 4,
  } as const;
  if (quoteStyle === 0) {
    noquotes = true;
  }
  if (typeof quoteStyle !== 'number') {
    // Allow for a single string or an array of string flags
    quoteStyle = Array.isArray(quoteStyle) ? quoteStyle : [quoteStyle];
    for (index = 0; index < quoteStyle.length; index++) {
      // Resolve string input to bitwise e.g. 'ENT_IGNORE' becomes 4
      if (OPTS[quoteStyle[index] as ENT_OPTION_STRING] === 0) {
        noquotes = true;
      } else if (OPTS[quoteStyle[index] as ENT_OPTION_STRING]) {
        optTemp = (optTemp | OPTS[quoteStyle[index] as ENT_OPTION_STRING]) as ENT_OPTION_NUMBER;
      }
    }
    quoteStyle = optTemp;
  }
  if (quoteStyle & OPTS.ENT_HTML_QUOTE_SINGLE) {
    string = string.replace(/'/g, '&#039;');
  }
  if (!noquotes) {
    string = string.replace(/"/g, '&quot;');
  }
  return string;
}
