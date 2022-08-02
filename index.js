function initCache() {
    const store = []
    // cache only first element, second is length to jump ahead for the parser
    const cache = function cache( value ) {
        store.push( value[ 0 ] )
        return value
    }

    cache.get = ( index ) => {
        if( index >= store.length ) {
            throw RangeError( `Can't resolve reference ${index + 1}` )
        }

        return store[ index ]
    }

    return cache
}

function expectType( str, cache ) {
    const types = /^(?:N(?=;)|[bidsSaOCrR](?=:)|[^:]+(?=:))/g
    const type = (types.exec( str ) || [])[ 0 ]

    if( ! type ) {
        throw SyntaxError( 'Invalid input: ' + str )
    }

    switch( type ) {
        case 'N':
            return cache( [ null, 2 ] )
        case 'b':
            return cache( expectBool( str ) )
        case 'i':
            return cache( expectInt( str ) )
        case 'd':
            return cache( expectFloat( str ) )
        case 's':
            return cache( expectString( str ) )
        case 'S':
            return cache( expectEscapedString( str ) )
        case 'a':
            return expectArray( str, cache )
        case 'O':
            return expectObject( str, cache )
        case 'C':
            return expectClass( str, cache )
        case 'r':
        case 'R':
            return expectReference( str, cache )
        default:
            throw SyntaxError( `Invalid or unsupported data type: ${type}` )
    }
}

function expectBool( str ) {
    const reBool = /^b:([01]);/
    const [ match, boolMatch ] = reBool.exec( str ) || []

    if( ! boolMatch ) {
        throw SyntaxError( 'Invalid bool value, expected 0 or 1' )
    }

    return [ boolMatch === '1', match.length ]
}

function expectInt( str ) {
    const reInt = /^i:([+-]?\d+);/
    const [ match, intMatch ] = reInt.exec( str ) || []

    if( ! intMatch ) {
        throw SyntaxError( 'Expected an integer value' )
    }

    return [ parseInt( intMatch, 10 ), match.length ]
}

function expectFloat( str ) {
    const reFloat = /^d:(NAN|-?INF|(?:\d+\.\d*|\d*\.\d+|\d+)(?:[eE][+-]\d+)?);/
    const [ match, floatMatch ] = reFloat.exec( str ) || []

    if( ! floatMatch ) {
        throw SyntaxError( 'Expected a float value' )
    }

    let floatValue

    switch( floatMatch ) {
        case 'NAN':
            floatValue = Number.NaN
            break
        case '-INF':
            floatValue = Number.NEGATIVE_INFINITY
            break
        case 'INF':
            floatValue = Number.POSITIVE_INFINITY
            break
        default:
            floatValue = parseFloat( floatMatch )
            break
    }

    return [ floatValue, match.length ]
}

function readBytes( str, len, escapedString = false ) {
    let bytes = 0
    let out = ''
    let c = 0
    const strLen = str.length
    let wasHighSurrogate = false
    let escapedChars = 0

    while( bytes < len && c < strLen ) {
        let chr = str.charAt( c )
        const code = chr.charCodeAt( 0 )
        const isHighSurrogate = code >= 0xd800 && code <= 0xdbff
        const isLowSurrogate = code >= 0xdc00 && code <= 0xdfff

        if( escapedString && chr === '\\' ) {
            chr = String.fromCharCode( parseInt( str.substr( c + 1, 2 ), 16 ) )
            escapedChars++

            // each escaped sequence is 3 characters. Go 2 chars ahead.
            // third character will be jumped over a few lines later
            c += 2
        }

        c++

        bytes += isHighSurrogate || (isLowSurrogate && wasHighSurrogate)
            // if high surrogate, count 2 bytes, as expectation is to be followed by low surrogate
            // if low surrogate preceded by high surrogate, add 2 bytes
                 ? 2
                 : code > 0x7ff
                     // otherwise low surrogate falls into this part
                   ? 3
                   : code > 0x7f
                     ? 2
                     : 1

        // if high surrogate is not followed by low surrogate, add 1 more byte
        bytes += wasHighSurrogate && ! isLowSurrogate ? 1 : 0

        out += chr
        wasHighSurrogate = isHighSurrogate
    }

    return [ out, bytes, escapedChars ]
}

function expectString( str ) {
    // PHP strings consist of one-byte characters.
    // JS uses 2 bytes with possible surrogate pairs.
    // Serialized length of 2 is still 1 JS string character
    const reStrLength = /^s:(\d+):"/g // also match the opening " char
    const [ match, byteLenMatch ] = reStrLength.exec( str ) || []

    if( ! match ) {
        throw SyntaxError( 'Expected a string value' )
    }

    const len = parseInt( byteLenMatch, 10 )

    str = str.substr( match.length )

    const [ strMatch, bytes ] = readBytes( str, len )

    if( bytes !== len ) {
        throw SyntaxError( `Expected string of ${len} bytes, but got ${bytes}` )
    }

    str = str.substr( strMatch.length )

    // strict parsing, match closing "; chars
    if( ! str.startsWith( '";' ) ) {
        throw SyntaxError( 'Expected ";' )
    }

    return [ strMatch, match.length + strMatch.length + 2 ] // skip last ";
}

function expectEscapedString( str ) {
    const reStrLength = /^S:(\d+):"/g // also match the opening " char
    const [ match, strLenMatch ] = reStrLength.exec( str ) || []

    if( ! match ) {
        throw SyntaxError( 'Expected an escaped string value' )
    }

    const len = parseInt( strLenMatch, 10 )

    str = str.substr( match.length )

    const [ strMatch, bytes, escapedChars ] = readBytes( str, len, true )

    if( bytes !== len ) {
        throw SyntaxError( `Expected escaped string of ${len} bytes, but got ${bytes}` )
    }

    str = str.substr( strMatch.length + escapedChars * 2 )

    // strict parsing, match closing "; chars
    if( ! str.startsWith( '";' ) ) {
        throw SyntaxError( 'Expected ";' )
    }

    return [ strMatch, match.length + strMatch.length + 2 ] // skip last ";
}

function expectKeyOrIndex( str ) {
    try {
        return expectString( str )
    }
    catch( err ) {
    }

    try {
        return expectEscapedString( str )
    }
    catch( err ) {
    }

    try {
        return expectInt( str )
    }
    catch( err ) {
        throw SyntaxError( 'Expected key or index' )
    }
}

function expectObject( str, cache ) {
    // O:<class name length>:"class name":<prop count>:{<props and values>}
    // O:8:"stdClass":2:{s:3:"foo";s:3:"bar";s:3:"bar";s:3:"baz";}
    const reObjectLiteral = /^O:(\d+):"([^"]+)":(\d+):\{/
    const [ objectLiteralBeginMatch, /* classNameLengthMatch */, className, propCountMatch ] = reObjectLiteral.exec( str ) || []

    if( ! objectLiteralBeginMatch ) {
        throw SyntaxError( 'Invalid input' )
    }

    if( className !== 'stdClass' ) {
        throw SyntaxError( `Unsupported object type: ${className}` )
    }

    let totalOffset = objectLiteralBeginMatch.length

    const propCount = parseInt( propCountMatch, 10 )
    const obj = {}
    cache( [ obj ] )

    str = str.substr( totalOffset )

    for( let i = 0; i < propCount; i++ ) {
        const prop = expectKeyOrIndex( str )
        str = str.substr( prop[ 1 ] )
        totalOffset += prop[ 1 ]

        const value = expectType( str, cache )
        str = str.substr( value[ 1 ] )
        totalOffset += value[ 1 ]

        obj[ prop[ 0 ] ] = value[ 0 ]
    }

    // strict parsing, expect } after object literal
    if( str.charAt( 0 ) !== '}' ) {
        throw SyntaxError( 'Expected }' )
    }

    return [ obj, totalOffset + 1 ] // skip final }
}

function expectClass( str, cache ) {
    // can't be well supported, because requires calling eval (or similar)
    // in order to call serialized constructor name
    // which is unsafe
    // or assume that constructor is defined in global scope
    // but this is too much limiting
    throw Error( 'Not yet implemented' )
}

function expectReference( str, cache ) {
    const reRef = /^[rR]:([1-9]\d*);/
    const [ match, refIndex ] = reRef.exec( str ) || []

    if( ! match ) {
        throw SyntaxError( 'Expected reference value' )
    }

    return [ cache.get( parseInt( refIndex, 10 ) - 1 ), match.length ]
}

function expectArray( str, cache ) {
    const reArrayLength = /^a:(\d+):{/
    const [ arrayLiteralBeginMatch, arrayLengthMatch ] = reArrayLength.exec( str ) || []

    if( ! arrayLengthMatch ) {
        throw SyntaxError( 'Expected array length annotation' )
    }

    str = str.substr( arrayLiteralBeginMatch.length )

    const array = expectArrayItems( str, parseInt( arrayLengthMatch, 10 ), cache )

    // strict parsing, expect closing } brace after array literal
    if( str.charAt( array[ 1 ] ) !== '}' ) {
        throw SyntaxError( 'Expected }' )
    }

    return [ array[ 0 ], arrayLiteralBeginMatch.length + array[ 1 ] + 1 ] // jump over }
}

function expectArrayItems( str, expectedItems = 0, cache ) {
    let key
    let hasStringKeys = false
    let item
    let totalOffset = 0
    let items = []
    cache( [ items ] )

    for( let i = 0; i < expectedItems; i++ ) {
        key = expectKeyOrIndex( str )

        // this is for backward compatibility with previous implementation
        if( ! hasStringKeys ) {
            hasStringKeys = (typeof key[ 0 ] === 'string')
        }

        str = str.substr( key[ 1 ] )
        totalOffset += key[ 1 ]

        // references are resolved immediately, so if duplicate key overwrites previous array index
        // the old value is anyway resolved
        // fixme: but next time the same reference should point to the new value
        item = expectType( str, cache )
        str = str.substr( item[ 1 ] )
        totalOffset += item[ 1 ]

        items[ key[ 0 ] ] = item[ 0 ]
    }

    // this is for backward compatibility with previous implementation
    if( hasStringKeys ) {
        items = Object.assign( {}, items )
    }

    return [ items, totalOffset ]
}

function unserialize( str, showError = false ) {
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
        if( typeof str !== 'string' ) {
            return str
        }

        return expectType( str, initCache() )[ 0 ]
    }
    catch( err ) {
        if( showError ) {
            console.error( err )
        }
        return str
    }
}

function serialize( mixedValue ) {
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

    let val, key, okey
    let ktype = ''
    let vals = ''
    let count = 0

    const _utf8Size = function( str ) {
        return ~-encodeURI( str ).split( /%..|./ ).length
    }

    const _getType = function( inp ) {
        let match
        let key
        let cons
        let types
        let type = typeof inp

        if( type === 'object' && ! inp ) {
            return 'null'
        }

        if( type === 'object' ) {
            if( ! inp.constructor ) {
                return 'object'
            }
            cons = inp.constructor.toString()
            match = cons.match( /(\w+)\(/ )
            if( match ) {
                cons = match[ 1 ].toLowerCase()
            }
            types = [ 'boolean', 'number', 'string', 'array' ]
            for( key in types ) {
                if( cons === types[ key ] ) {
                    type = types[ key ]
                    break
                }
            }
        }
        return type
    }

    const type = _getType( mixedValue )

    switch( type ) {
        case 'function':
            val = ''
            break
        case 'boolean':
            val = 'b:' + (mixedValue ? '1' : '0')
            break
        case 'number':
            val = (Math.round( mixedValue ) === mixedValue ? 'i' : 'd') + ':' + mixedValue
            break
        case 'string':
            val = 's:' + _utf8Size( mixedValue ) + ':"' + mixedValue + '"'
            break
        case 'array':
        case 'object':
            val = 'a'
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

            for( key in mixedValue ) {
                if( mixedValue.hasOwnProperty( key ) ) {
                    ktype = _getType( mixedValue[ key ] )
                    if( ktype === 'function' ) {
                        continue
                    }

                    okey = (key.match( /^[0-9]+$/ ) ? parseInt( key, 10 ) : key)
                    vals += serialize( okey ) + serialize( mixedValue[ key ] )
                    count++
                }
            }
            val += ':' + count + ':{' + vals + '}'
            break
        case 'undefined':
        default:
            // Fall-through
            // if the JS object has a property which contains a null value,
            // the string cannot be unserialized by PHP
            val = 'N'
            break
    }

    if( type !== 'object' && type !== 'array' ) {
        val += ';'
    }

    return val
}

function htmlspecialchars( string, quoteStyle, charset, doubleEncode ) {
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
    let optTemp = 0
    let i = 0
    let noquotes = false
    if( typeof quoteStyle === 'undefined' || quoteStyle === null ) {
        quoteStyle = 2
    }
    string = string || ''
    string = string.toString()
    if( doubleEncode !== false ) {
        // Put this first to avoid double-encoding
        string = string.replace( /&/g, '&amp;' )
    }
    string = string
        .replace( /</g, '&lt;' )
        .replace( />/g, '&gt;' )
    const OPTS = {
        ENT_NOQUOTES: 0,
        ENT_HTML_QUOTE_SINGLE: 1,
        ENT_HTML_QUOTE_DOUBLE: 2,
        ENT_COMPAT: 2,
        ENT_QUOTES: 3,
        ENT_IGNORE: 4
    }
    if( quoteStyle === 0 ) {
        noquotes = true
    }
    if( typeof quoteStyle !== 'number' ) {
        // Allow for a single string or an array of string flags
        quoteStyle = [].concat( quoteStyle )
        for( i = 0; i < quoteStyle.length; i++ ) {
            // Resolve string input to bitwise e.g. 'ENT_IGNORE' becomes 4
            if( OPTS[ quoteStyle[ i ] ] === 0 ) {
                noquotes = true
            }
            else if( OPTS[ quoteStyle[ i ] ] ) {
                optTemp = optTemp | OPTS[ quoteStyle[ i ] ]
            }
        }
        quoteStyle = optTemp
    }
    if( quoteStyle & OPTS.ENT_HTML_QUOTE_SINGLE ) {
        string = string.replace( /'/g, '&#039;' )
    }
    if( ! noquotes ) {
        string = string.replace( /"/g, '&quot;' )
    }
    return string
}

function utf8Encode( argString ) {
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

    if( argString === null || typeof argString === 'undefined' ) {
        return ''
    }

    // .replace(/\r\n/g, "\n").replace(/\r/g, "\n");
    const string = (argString + '')
    let utftext = ''
    let start
    let end
    let stringl = 0

    start = end = 0
    stringl = string.length
    for( let n = 0; n < stringl; n++ ) {
        let c1 = string.charCodeAt( n )
        let enc = null

        if( c1 < 128 ) {
            end++
        }
        else if( c1 > 127 && c1 < 2048 ) {
            enc = String.fromCharCode(
                (c1 >> 6) | 192, (c1 & 63) | 128
            )
        }
        else if( (c1 & 0xF800) !== 0xD800 ) {
            enc = String.fromCharCode(
                (c1 >> 12) | 224, ((c1 >> 6) & 63) | 128, (c1 & 63) | 128
            )
        }
        else {
            // surrogate pairs
            if( (c1 & 0xFC00) !== 0xD800 ) {
                throw new RangeError( 'Unmatched trail surrogate at ' + n )
            }
            const c2 = string.charCodeAt( ++n )
            if( (c2 & 0xFC00) !== 0xDC00 ) {
                throw new RangeError( 'Unmatched lead surrogate at ' + (n - 1) )
            }
            c1 = ((c1 & 0x3FF) << 10) + (c2 & 0x3FF) + 0x10000
            enc = String.fromCharCode(
                (c1 >> 18) | 240, ((c1 >> 12) & 63) | 128, ((c1 >> 6) & 63) | 128, (c1 & 63) | 128
            )
        }
        if( enc !== null ) {
            if( end > start ) {
                utftext += string.slice( start, end )
            }
            utftext += enc
            start = end = n + 1
        }
    }

    if( end > start ) {
        utftext += string.slice( start, stringl )
    }

    return utftext
}

function utf8Decode( strData ) {
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

    if( strData === null || typeof strData === 'undefined' ) {
        return ''
    }

    const tmpArr = []
    let i = 0
    let c1 = 0
    let seqlen = 0

    strData += ''

    while( i < strData.length ) {
        c1 = strData.charCodeAt( i ) & 0xFF
        seqlen = 0

        // https://en.wikipedia.org/wiki/UTF-8#Codepage_layout
        if( c1 <= 0xBF ) {
            c1 = (c1 & 0x7F)
            seqlen = 1
        }
        else if( c1 <= 0xDF ) {
            c1 = (c1 & 0x1F)
            seqlen = 2
        }
        else if( c1 <= 0xEF ) {
            c1 = (c1 & 0x0F)
            seqlen = 3
        }
        else {
            c1 = (c1 & 0x07)
            seqlen = 4
        }

        for( let ai = 1; ai < seqlen; ++ai ) {
            c1 = ((c1 << 0x06) | (strData.charCodeAt( ai + i ) & 0x3F))
        }

        if( seqlen === 4 ) {
            c1 -= 0x10000
            tmpArr.push( String.fromCharCode( 0xD800 | ((c1 >> 10) & 0x3FF) ) )
            tmpArr.push( String.fromCharCode( 0xDC00 | (c1 & 0x3FF) ) )
        }
        else {
            tmpArr.push( String.fromCharCode( c1 ) )
        }

        i += seqlen
    }

    return tmpArr.join( '' )
}

function md5( str ) {
    //  discuss at: https://locutus.io/php/md5/
    // original by: Webtoolkit.info (https://www.webtoolkit.info/)
    // improved by: Michael White (https://getsprink.com)
    // improved by: Jack
    // improved by: Kevin van Zonneveld (https://kvz.io)
    //    input by: Brett Zamir (https://brett-zamir.me)
    // bugfixed by: Kevin van Zonneveld (https://kvz.io)
    //      note 1: Keep in mind that in accordance with PHP, the whole string is buffered and then
    //      note 1: hashed. If available, we'd recommend using Node's native crypto modules directly
    //      note 1: in a steaming fashion for faster and more efficient hashing
    //   example 1: md5('Kevin van Zonneveld')
    //   returns 1: '6e658d4bfcb59cc13f96c14450ac40b9'

    if( str === undefined || str === null ) { return ''; }

    let hash
    try {
        const crypto = require( 'crypto' )
        const md5sum = crypto.createHash( 'md5' )
        md5sum.update( str )
        hash = md5sum.digest( 'hex' )
    }
    catch( e ) {
        hash = undefined
    }

    if( hash !== undefined ) {
        return hash
    }

    let xl

    const _rotateLeft = function( lValue, iShiftBits ) {
        return (lValue << iShiftBits) | (lValue >>> (32 - iShiftBits))
    }

    const _addUnsigned = function( lX, lY ) {
        let lX4, lY4, lX8, lY8, lResult
        lX8 = (lX & 0x80000000)
        lY8 = (lY & 0x80000000)
        lX4 = (lX & 0x40000000)
        lY4 = (lY & 0x40000000)
        lResult = (lX & 0x3FFFFFFF) + (lY & 0x3FFFFFFF)
        if( lX4 & lY4 ) {
            return (lResult ^ 0x80000000 ^ lX8 ^ lY8)
        }
        if( lX4 | lY4 ) {
            if( lResult & 0x40000000 ) {
                return (lResult ^ 0xC0000000 ^ lX8 ^ lY8)
            }
            else {
                return (lResult ^ 0x40000000 ^ lX8 ^ lY8)
            }
        }
        else {
            return (lResult ^ lX8 ^ lY8)
        }
    }

    const _F = function( x, y, z ) {
        return (x & y) | ((~x) & z)
    }
    const _G = function( x, y, z ) {
        return (x & z) | (y & (~z))
    }
    const _H = function( x, y, z ) {
        return (x ^ y ^ z)
    }
    const _I = function( x, y, z ) {
        return (y ^ (x | (~z)))
    }

    const _FF = function( a, b, c, d, x, s, ac ) {
        a = _addUnsigned( a, _addUnsigned( _addUnsigned( _F( b, c, d ), x ), ac ) )
        return _addUnsigned( _rotateLeft( a, s ), b )
    }

    const _GG = function( a, b, c, d, x, s, ac ) {
        a = _addUnsigned( a, _addUnsigned( _addUnsigned( _G( b, c, d ), x ), ac ) )
        return _addUnsigned( _rotateLeft( a, s ), b )
    }

    const _HH = function( a, b, c, d, x, s, ac ) {
        a = _addUnsigned( a, _addUnsigned( _addUnsigned( _H( b, c, d ), x ), ac ) )
        return _addUnsigned( _rotateLeft( a, s ), b )
    }

    const _II = function( a, b, c, d, x, s, ac ) {
        a = _addUnsigned( a, _addUnsigned( _addUnsigned( _I( b, c, d ), x ), ac ) )
        return _addUnsigned( _rotateLeft( a, s ), b )
    }

    const _convertToWordArray = function( str ) {
        let lWordCount
        const lMessageLength = str.length
        const lNumberOfWordsTemp1 = lMessageLength + 8
        const lNumberOfWordsTemp2 = (lNumberOfWordsTemp1 - (lNumberOfWordsTemp1 % 64)) / 64
        const lNumberOfWords = (lNumberOfWordsTemp2 + 1) * 16
        const lWordArray = new Array( lNumberOfWords - 1 )
        let lBytePosition = 0
        let lByteCount = 0
        while( lByteCount < lMessageLength ) {
            lWordCount = (lByteCount - (lByteCount % 4)) / 4
            lBytePosition = (lByteCount % 4) * 8
            lWordArray[ lWordCount ] = (lWordArray[ lWordCount ] |
                                        (str.charCodeAt( lByteCount ) << lBytePosition))
            lByteCount++
        }
        lWordCount = (lByteCount - (lByteCount % 4)) / 4
        lBytePosition = (lByteCount % 4) * 8
        lWordArray[ lWordCount ] = lWordArray[ lWordCount ] | (0x80 << lBytePosition)
        lWordArray[ lNumberOfWords - 2 ] = lMessageLength << 3
        lWordArray[ lNumberOfWords - 1 ] = lMessageLength >>> 29
        return lWordArray
    }

    const _wordToHex = function( lValue ) {
        let wordToHexValue = ''
        let wordToHexValueTemp = ''
        let lByte
        let lCount

        for( lCount = 0; lCount <= 3; lCount++ ) {
            lByte = (lValue >>> (lCount * 8)) & 255
            wordToHexValueTemp = '0' + lByte.toString( 16 )
            wordToHexValue = wordToHexValue + wordToHexValueTemp.substr( wordToHexValueTemp.length - 2, 2 )
        }
        return wordToHexValue
    }

    let x = []
    let k
    let AA
    let BB
    let CC
    let DD
    let a
    let b
    let c
    let d
    const S11 = 7
    const S12 = 12
    const S13 = 17
    const S14 = 22
    const S21 = 5
    const S22 = 9
    const S23 = 14
    const S24 = 20
    const S31 = 4
    const S32 = 11
    const S33 = 16
    const S34 = 23
    const S41 = 6
    const S42 = 10
    const S43 = 15
    const S44 = 21

    str = utf8Encode( str )
    x = _convertToWordArray( str )
    a = 0x67452301
    b = 0xEFCDAB89
    c = 0x98BADCFE
    d = 0x10325476

    xl = x.length
    for( k = 0; k < xl; k += 16 ) {
        AA = a
        BB = b
        CC = c
        DD = d
        a = _FF( a, b, c, d, x[ k + 0 ], S11, 0xD76AA478 )
        d = _FF( d, a, b, c, x[ k + 1 ], S12, 0xE8C7B756 )
        c = _FF( c, d, a, b, x[ k + 2 ], S13, 0x242070DB )
        b = _FF( b, c, d, a, x[ k + 3 ], S14, 0xC1BDCEEE )
        a = _FF( a, b, c, d, x[ k + 4 ], S11, 0xF57C0FAF )
        d = _FF( d, a, b, c, x[ k + 5 ], S12, 0x4787C62A )
        c = _FF( c, d, a, b, x[ k + 6 ], S13, 0xA8304613 )
        b = _FF( b, c, d, a, x[ k + 7 ], S14, 0xFD469501 )
        a = _FF( a, b, c, d, x[ k + 8 ], S11, 0x698098D8 )
        d = _FF( d, a, b, c, x[ k + 9 ], S12, 0x8B44F7AF )
        c = _FF( c, d, a, b, x[ k + 10 ], S13, 0xFFFF5BB1 )
        b = _FF( b, c, d, a, x[ k + 11 ], S14, 0x895CD7BE )
        a = _FF( a, b, c, d, x[ k + 12 ], S11, 0x6B901122 )
        d = _FF( d, a, b, c, x[ k + 13 ], S12, 0xFD987193 )
        c = _FF( c, d, a, b, x[ k + 14 ], S13, 0xA679438E )
        b = _FF( b, c, d, a, x[ k + 15 ], S14, 0x49B40821 )
        a = _GG( a, b, c, d, x[ k + 1 ], S21, 0xF61E2562 )
        d = _GG( d, a, b, c, x[ k + 6 ], S22, 0xC040B340 )
        c = _GG( c, d, a, b, x[ k + 11 ], S23, 0x265E5A51 )
        b = _GG( b, c, d, a, x[ k + 0 ], S24, 0xE9B6C7AA )
        a = _GG( a, b, c, d, x[ k + 5 ], S21, 0xD62F105D )
        d = _GG( d, a, b, c, x[ k + 10 ], S22, 0x2441453 )
        c = _GG( c, d, a, b, x[ k + 15 ], S23, 0xD8A1E681 )
        b = _GG( b, c, d, a, x[ k + 4 ], S24, 0xE7D3FBC8 )
        a = _GG( a, b, c, d, x[ k + 9 ], S21, 0x21E1CDE6 )
        d = _GG( d, a, b, c, x[ k + 14 ], S22, 0xC33707D6 )
        c = _GG( c, d, a, b, x[ k + 3 ], S23, 0xF4D50D87 )
        b = _GG( b, c, d, a, x[ k + 8 ], S24, 0x455A14ED )
        a = _GG( a, b, c, d, x[ k + 13 ], S21, 0xA9E3E905 )
        d = _GG( d, a, b, c, x[ k + 2 ], S22, 0xFCEFA3F8 )
        c = _GG( c, d, a, b, x[ k + 7 ], S23, 0x676F02D9 )
        b = _GG( b, c, d, a, x[ k + 12 ], S24, 0x8D2A4C8A )
        a = _HH( a, b, c, d, x[ k + 5 ], S31, 0xFFFA3942 )
        d = _HH( d, a, b, c, x[ k + 8 ], S32, 0x8771F681 )
        c = _HH( c, d, a, b, x[ k + 11 ], S33, 0x6D9D6122 )
        b = _HH( b, c, d, a, x[ k + 14 ], S34, 0xFDE5380C )
        a = _HH( a, b, c, d, x[ k + 1 ], S31, 0xA4BEEA44 )
        d = _HH( d, a, b, c, x[ k + 4 ], S32, 0x4BDECFA9 )
        c = _HH( c, d, a, b, x[ k + 7 ], S33, 0xF6BB4B60 )
        b = _HH( b, c, d, a, x[ k + 10 ], S34, 0xBEBFBC70 )
        a = _HH( a, b, c, d, x[ k + 13 ], S31, 0x289B7EC6 )
        d = _HH( d, a, b, c, x[ k + 0 ], S32, 0xEAA127FA )
        c = _HH( c, d, a, b, x[ k + 3 ], S33, 0xD4EF3085 )
        b = _HH( b, c, d, a, x[ k + 6 ], S34, 0x4881D05 )
        a = _HH( a, b, c, d, x[ k + 9 ], S31, 0xD9D4D039 )
        d = _HH( d, a, b, c, x[ k + 12 ], S32, 0xE6DB99E5 )
        c = _HH( c, d, a, b, x[ k + 15 ], S33, 0x1FA27CF8 )
        b = _HH( b, c, d, a, x[ k + 2 ], S34, 0xC4AC5665 )
        a = _II( a, b, c, d, x[ k + 0 ], S41, 0xF4292244 )
        d = _II( d, a, b, c, x[ k + 7 ], S42, 0x432AFF97 )
        c = _II( c, d, a, b, x[ k + 14 ], S43, 0xAB9423A7 )
        b = _II( b, c, d, a, x[ k + 5 ], S44, 0xFC93A039 )
        a = _II( a, b, c, d, x[ k + 12 ], S41, 0x655B59C3 )
        d = _II( d, a, b, c, x[ k + 3 ], S42, 0x8F0CCC92 )
        c = _II( c, d, a, b, x[ k + 10 ], S43, 0xFFEFF47D )
        b = _II( b, c, d, a, x[ k + 1 ], S44, 0x85845DD1 )
        a = _II( a, b, c, d, x[ k + 8 ], S41, 0x6FA87E4F )
        d = _II( d, a, b, c, x[ k + 15 ], S42, 0xFE2CE6E0 )
        c = _II( c, d, a, b, x[ k + 6 ], S43, 0xA3014314 )
        b = _II( b, c, d, a, x[ k + 13 ], S44, 0x4E0811A1 )
        a = _II( a, b, c, d, x[ k + 4 ], S41, 0xF7537E82 )
        d = _II( d, a, b, c, x[ k + 11 ], S42, 0xBD3AF235 )
        c = _II( c, d, a, b, x[ k + 2 ], S43, 0x2AD7D2BB )
        b = _II( b, c, d, a, x[ k + 9 ], S44, 0xEB86D391 )
        a = _addUnsigned( a, AA )
        b = _addUnsigned( b, BB )
        c = _addUnsigned( c, CC )
        d = _addUnsigned( d, DD )
    }

    const temp = _wordToHex( a ) + _wordToHex( b ) + _wordToHex( c ) + _wordToHex( d )

    return temp.toLowerCase()
}

//@see: https://github.com/locutusjs/locutus/blob/master/src/php/var/serialize.js
//      Latest commit 0dbbcfc on 19 Nov 2020

//@see: https://github.com/locutusjs/locutus/blob/master/src/php/var/unserialize.js
//      Latest commit 0dbbcfc on 19 Nov 2020

//@see: https://github.com/locutusjs/locutus/blob/master/src/php/strings/htmlspecialchars.js
//      Latest commit 0dbbcfc on 19 Nov 2020

//@see: https://github.com/locutusjs/locutus/blob/master/src/php/xml/utf8_encode.js
//      Latest commit 0dbbcfc on 19 Nov 2020

//@see: https://github.com/locutusjs/locutus/blob/master/src/php/xml/utf8_decode.js
//      Latest commit 0dbbcfc on 19 Nov 2020

//@see: https://github.com/locutusjs/locutus/blob/master/src/php/strings/md5.js
//      Latest commit 0dbbcfc on 19 Nov 2020

module.exports = { serialize, unserialize, htmlspecialchars, md5, utf8Encode, utf8Decode }