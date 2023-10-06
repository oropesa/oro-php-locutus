const { utf8Encode } = require('../dist');

describe('utf8Encode', () => {
  test('utf8Encode( undefined )', () => {
    expect(utf8Encode()).toBe('');
  });
  test('utf8Encode( int )', () => {
    expect(utf8Encode(17)).toBe('17');
  });
  test('utf8Encode( str )', () => {
    expect(utf8Encode('chacho')).toBe('chacho');
  });
  test('utf8Encode( bool )', () => {
    expect(utf8Encode(true)).toBe('true');
  });
  test('utf8Encode( arr )', () => {
    expect(utf8Encode([1, 2, 3])).toBe('1,2,3');
  });
  test('utf8Encode( obj )', () => {
    expect(utf8Encode({ chacho: true, tio: 17 })).toBe('[object Object]');
  });
  test('utf8Encode( spanish )', () => {
    expect(utf8Encode('cañón')).toBe('caÃ±Ã³n');
  });
});
