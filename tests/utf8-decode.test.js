const { utf8Decode } = require('../dist');

describe('utf8Decode', () => {
  test('utf8Decode( undefined )', () => {
    expect(utf8Decode()).toBe('');
  });
  test('utf8Decode( int )', () => {
    expect(utf8Decode(17)).toBe('17');
  });
  test('utf8Decode( str )', () => {
    expect(utf8Decode('chacho')).toBe('chacho');
  });
  test('utf8Decode( bool )', () => {
    expect(utf8Decode(true)).toBe('true');
  });
  test('utf8Decode( arr )', () => {
    expect(utf8Decode([1, 2, 3])).toBe('1,2,3');
  });
  test('utf8Decode( obj )', () => {
    expect(utf8Decode({ chacho: true, tio: 17 })).toBe('[object Object]');
  });
  test('utf8Decode( spanish )', () => {
    expect(utf8Decode('caÃ±Ã³n')).toBe('cañón');
  });
});
