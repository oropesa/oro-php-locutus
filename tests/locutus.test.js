const { serialize, unserialize, htmlspecialchars, md5, utf8Encode, utf8Decode } = require( '../index' );

describe('serialize', () => {
    test( 'serialize( undefined )', () => { expect( serialize() ).toBe( 'N;' ) });
    test( 'serialize( int )'      , () => { expect( serialize( 17 ) ).toBe( 'i:17;' ) });
    test( 'serialize( str )'      , () => { expect( serialize( 'chacho' ) ).toBe( 's:6:"chacho";' ) });
    test( 'serialize( bool )'     , () => { expect( serialize( true ) ).toBe( 'b:1;' ) });
    test( 'serialize( arr )'      , () => { expect( serialize( [ 1, 2, 3 ] ) ).toBe( 'a:3:{i:0;i:1;i:1;i:2;i:2;i:3;}' ) });
    test( 'serialize( obj )'      , () => { expect( serialize( { chacho: true, tio: 17 } ) ).toBe( 'a:2:{s:6:"chacho";b:1;s:3:"tio";i:17;}' ) });
    test( 'serialize( arr2 )'     , () => { expect( serialize( [ 'chacho', '', true, false, 1, 2.3 ] ) ).toBe( 'a:6:{i:0;s:6:"chacho";i:1;s:0:"";i:2;b:1;i:3;b:0;i:4;i:1;i:5;d:2.3;}' ) });
});

describe('unserialize', () => {
    test( 'unserialize( undefined )', () => { expect( unserialize() ).toBe( undefined ) });
    test( 'unserialize( int )'      , () => { expect( unserialize( 17 ) ).toBe( 17 ) });
    test( 'unserialize( str )'      , () => { expect( unserialize( 'chacho' ) ).toBe( 'chacho' ) });
    test( 'unserialize( bool )'     , () => { expect( unserialize( true ) ).toBe( true ) });
    test( 'unserialize( arr )'      , () => { expect( unserialize( [ 1, 2, 3 ] ) ).toEqual( [ 1, 2, 3 ] ) });
    test( 'unserialize( obj )'      , () => { expect( unserialize( { chacho: true, tio: 17 } ) ).toEqual( { chacho: true, tio: 17 } ) });

    test( 'unserialize( ser undefined )', () => { expect( unserialize( 'N;' ) ).toBe( null ) });
    test( 'unserialize( ser int )'      , () => { expect( unserialize( 'i:17;' ) ).toBe( 17 ) });
    test( 'unserialize( ser str )'      , () => { expect( unserialize( 's:6:"chacho";' ) ).toBe( 'chacho' ) });
    test( 'unserialize( ser bool )'     , () => { expect( unserialize( 'b:1;' ) ).toBe( true ) });
    test( 'unserialize( ser arr )'      , () => { expect( unserialize( 'a:3:{i:0;i:1;i:1;i:2;i:2;i:3;}' ) ).toEqual( [ 1, 2, 3 ] ) });
    test( 'unserialize( ser obj )'      , () => { expect( unserialize( 'a:2:{s:6:"chacho";b:1;s:3:"tio";i:17;}' ) ).toEqual( { chacho: true, tio: 17 } ) });
    test( 'unserialize( ser arr 2 )'    , () => { expect( unserialize( 'a:6:{i:0;s:6:"chacho";i:1;s:0:"";i:2;b:1;i:3;b:0;i:4;i:1;i:5;d:2.3;}' ) ).toEqual( [ 'chacho', '', true, false, 1, 2.3 ] ) });

    test( 'unserialize( ser param length )', () => { expect( unserialize( 'a:4:{s:5:"width";s:4:"2.55";s:6:"length";s:4:"2.27";s:8:"width_mm";s:3:"0.9";s:9:"length_mm";s:3:"0.8";}' ) ).toEqual( { width: '2.55', length: '2.27', width_mm: '0.9', length_mm: '0.8' } ) });
});

describe('htmlspecialchars', () => {
    test( 'htmlspecialchars( undefined )', () => { expect( htmlspecialchars() ).toBe( '' ) });
    test( 'htmlspecialchars( int )'      , () => { expect( htmlspecialchars( 17 ) ).toBe( '17' ) });
    test( 'htmlspecialchars( str )'      , () => { expect( htmlspecialchars( 'chacho' ) ).toBe( 'chacho' ) });
    test( 'htmlspecialchars( bool )'     , () => { expect( htmlspecialchars( true ) ).toBe( 'true' ) });
    test( 'htmlspecialchars( arr )'      , () => { expect( htmlspecialchars( [ 1, 2, 3 ] ) ).toBe( '1,2,3' ) });
    test( 'htmlspecialchars( obj )'      , () => { expect( htmlspecialchars( { chacho: true, tio: 17 } ) ).toBe( '[object Object]' ) });

    test( 'htmlspecialchars( html )'    , () => { expect( htmlspecialchars( '<a href="test">Test</a>', 'ENT_QUOTES' ) ).toBe( '&lt;a href=&quot;test&quot;&gt;Test&lt;/a&gt;' ) });
    test( 'htmlspecialchars( html1 )'   , () => { expect( htmlspecialchars( '<a href="test">Test</a>' ) ).toBe( "&lt;a href=&quot;test&quot;&gt;Test&lt;/a&gt;" ) });
    test( 'htmlspecialchars( html bad )', () => { expect( htmlspecialchars( "<a href='test'>Test</a>" ) ).toBe( "&lt;a href='test'&gt;Test&lt;/a&gt;" ) });
    test( 'htmlspecialchars( html2 )'   , () => { expect( htmlspecialchars( "ab\"c'd", [ 'ENT_NOQUOTES', 'ENT_QUOTES' ] ) ).toBe( 'ab"c&#039;d' ) });
    test( 'htmlspecialchars( html3 )'   , () => { expect( htmlspecialchars( 'my "&entity;" is still here', null, null, false ) ).toBe( 'my &quot;&entity;&quot; is still here' ) });
});

describe('utf8Encode', () => {
    test( 'utf8Encode( undefined )', () => { expect( utf8Encode() ).toBe( '' ) });
    test( 'utf8Encode( int )'      , () => { expect( utf8Encode( 17 ) ).toBe( '17' ) });
    test( 'utf8Encode( str )'      , () => { expect( utf8Encode( 'chacho' ) ).toBe( 'chacho' ) });
    test( 'utf8Encode( bool )'     , () => { expect( utf8Encode( true ) ).toBe( 'true' ) });
    test( 'utf8Encode( arr )'      , () => { expect( utf8Encode( [ 1, 2, 3 ] ) ).toBe( '1,2,3' ) });
    test( 'utf8Encode( obj )'      , () => { expect( utf8Encode( { chacho: true, tio: 17 } ) ).toBe( '[object Object]' ) });
    test( 'utf8Encode( spanish )'  , () => { expect( utf8Encode( 'cañón' ) ).toBe( 'caÃ±Ã³n' ) });
});

describe('utf8Decode', () => {
    test( 'utf8Decode( undefined )', () => { expect( utf8Decode() ).toBe( '' ) });
    test( 'utf8Decode( int )'      , () => { expect( utf8Decode( 17 ) ).toBe( '17' ) });
    test( 'utf8Decode( str )'      , () => { expect( utf8Decode( 'chacho' ) ).toBe( 'chacho' ) });
    test( 'utf8Decode( bool )'     , () => { expect( utf8Decode( true ) ).toBe( 'true' ) });
    test( 'utf8Decode( arr )'      , () => { expect( utf8Decode( [ 1, 2, 3 ] ) ).toBe( '1,2,3' ) });
    test( 'utf8Decode( obj )'      , () => { expect( utf8Decode( { chacho: true, tio: 17 } ) ).toBe( '[object Object]' ) });
    test( 'utf8Decode( spanish )'  , () => { expect( utf8Decode( 'caÃ±Ã³n' ) ).toBe( 'cañón' ) });
});

describe('fn: md5', () => {
    test( 'fn: md5( undefined )', () => { expect( md5() ).toBe( '' ); } );
    test( 'fn: md5( null )'     , () => { expect( md5( null ) ).toBe( '' ); } );
    test( 'fn: md5( str empty )', () => { expect( md5( '' ) ).toBe( 'd41d8cd98f00b204e9800998ecf8427e' ); } );
    test( 'fn: md5( str )'      , () => { expect( md5( 'chacho' ) ).toBe( '496c84fb22e82d68fad9e5fe8e89d03d' ); } );
});