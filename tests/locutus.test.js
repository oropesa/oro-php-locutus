const { serialize, unserialize, htmlspecialchars, md5, utf8Encode, utf8Decode } = require( '../index' );

describe('serialize', () => {
    test( 'serialize( undefined )' , () => { expect( serialize() ).toBe( 'N;' ) });
    test( 'serialize( int )' , () => { expect( serialize( 17 ) ).toBe( 'i:17;' ) });
    test( 'serialize( str )' , () => { expect( serialize( 'chacho' ) ).toBe( 's:6:"chacho";' ) });
    test( 'serialize( bool )' , () => { expect( serialize( true ) ).toBe( 'b:1;' ) });
    test( 'serialize( arr )' , () => { expect( serialize( [ 1, 2, 3 ] ) ).toBe( 'a:3:{i:0;i:1;i:1;i:2;i:2;i:3;}' ) });
    test( 'serialize( obj )' , () => { expect( serialize( { chacho: true, tio: 17 } ) ).toBe( 'a:2:{s:6:"chacho";b:1;s:3:"tio";i:17;}' ) });
});

describe('unserialize', () => {
    test( 'unserialize( undefined )' , () => { expect( unserialize() ).toBe( undefined ) });
    test( 'unserialize( int )' , () => { expect( unserialize( 17 ) ).toBe( 17 ) });
    test( 'unserialize( str )' , () => { expect( unserialize( 'chacho' ) ).toBe( 'chacho' ) });
    test( 'unserialize( bool )' , () => { expect( unserialize( true ) ).toBe( true ) });
    test( 'unserialize( arr )' , () => { expect( unserialize( [ 1, 2, 3 ] ) ).toEqual( [ 1, 2, 3 ] ) });
    test( 'unserialize( obj )' , () => { expect( unserialize( { chacho: true, tio: 17 } ) ).toEqual( { chacho: true, tio: 17 } ) });

    test( 'unserialize( ser undefined )' , () => { expect( unserialize( 'N;' ) ).toBe( null ) });
    test( 'unserialize( ser int )' , () => { expect( unserialize( 'i:17;' ) ).toBe( 17 ) });
    test( 'unserialize( ser str )' , () => { expect( unserialize( 's:6:"chacho";' ) ).toBe( 'chacho' ) });
    test( 'unserialize( ser bool )' , () => { expect( unserialize( 'b:1;' ) ).toBe( true ) });
    test( 'unserialize( ser arr )' , () => { expect( unserialize( 'a:3:{i:0;i:1;i:1;i:2;i:2;i:3;}' ) ).toEqual( [ 1, 2, 3 ] ) });
    test( 'unserialize( ser obj )' , () => { expect( unserialize( 'a:2:{s:6:"chacho";b:1;s:3:"tio";i:17;}' ) ).toEqual( { chacho: true, tio: 17 } ) });
});

describe('htmlspecialchars', () => {
    test( 'htmlspecialchars( undefined )' , () => { expect( htmlspecialchars() ).toBe( '' ) });
    test( 'htmlspecialchars( int )' , () => { expect( htmlspecialchars( 17 ) ).toBe( '17' ) });
    test( 'htmlspecialchars( str )' , () => { expect( htmlspecialchars( 'chacho' ) ).toBe( 'chacho' ) });
    test( 'htmlspecialchars( bool )' , () => { expect( htmlspecialchars( true ) ).toBe( 'true' ) });
    test( 'htmlspecialchars( arr )' , () => { expect( htmlspecialchars( [ 1, 2, 3 ] ) ).toBe( '1,2,3' ) });
    test( 'htmlspecialchars( obj )' , () => { expect( htmlspecialchars( { chacho: true, tio: 17 } ) ).toBe( '[object Object]' ) });

    test( 'htmlspecialchars( html )' , () => { expect( htmlspecialchars( "<a href='test'>Test</a>", 'ENT_QUOTES' ) ).toBe( '&lt;a href=&#039;test&#039;&gt;Test&lt;/a&gt;' ) });
    test( 'htmlspecialchars( html2 )' , () => { expect( htmlspecialchars( "ab\"c'd", [ 'ENT_NOQUOTES', 'ENT_QUOTES' ] ) ).toBe( 'ab"c&#039;d' ) });
    test( 'htmlspecialchars( html3 )' , () => { expect( htmlspecialchars( 'my "&entity;" is still here', null, null, false ) ).toBe( 'my &quot;&entity;&quot; is still here' ) });
});

describe('utf8Encode', () => {
    test( 'htmlspecialchars( undefined )' , () => { expect( htmlspecialchars() ).toBe( '' ) });
    test( 'htmlspecialchars( int )' , () => { expect( htmlspecialchars( 17 ) ).toBe( '17' ) });
    test( 'htmlspecialchars( str )' , () => { expect( htmlspecialchars( 'chacho' ) ).toBe( 'chacho' ) });
    test( 'htmlspecialchars( bool )' , () => { expect( htmlspecialchars( true ) ).toBe( 'true' ) });
    test( 'htmlspecialchars( arr )' , () => { expect( htmlspecialchars( [ 1, 2, 3 ] ) ).toBe( '1,2,3' ) });
    test( 'htmlspecialchars( obj )' , () => { expect( htmlspecialchars( { chacho: true, tio: 17 } ) ).toBe( '[object Object]' ) });
});

describe('utf8Decode', () => {
    test( 'htmlspecialchars( undefined )' , () => { expect( htmlspecialchars() ).toBe( '' ) });
    test( 'htmlspecialchars( int )' , () => { expect( htmlspecialchars( 17 ) ).toBe( '17' ) });
    test( 'htmlspecialchars( str )' , () => { expect( htmlspecialchars( 'chacho' ) ).toBe( 'chacho' ) });
    test( 'htmlspecialchars( bool )' , () => { expect( htmlspecialchars( true ) ).toBe( 'true' ) });
    test( 'htmlspecialchars( arr )' , () => { expect( htmlspecialchars( [ 1, 2, 3 ] ) ).toBe( '1,2,3' ) });
    test( 'htmlspecialchars( obj )' , () => { expect( htmlspecialchars( { chacho: true, tio: 17 } ) ).toBe( '[object Object]' ) });
});

describe('fn: md5', () => {
    test( 'fn: md5( undefined )', () => { expect( md5() ).toBe( '' ); } );
    test( 'fn: md5( null )', () => { expect( md5( null ) ).toBe( '' ); } );
    test( 'fn: md5( str empty )', () => { expect( md5( '' ) ).toBe( 'd41d8cd98f00b204e9800998ecf8427e' ); } );
    test( 'fn: md5( str )'      , () => { expect( md5( 'chacho' ) ).toBe( '496c84fb22e82d68fad9e5fe8e89d03d' ); } );
});