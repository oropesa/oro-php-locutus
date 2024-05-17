import { utf8Encode } from './';

describe('utf8Encode', () => {
  test('utf8Encode( str )', () => {
    expect(utf8Encode('chacho')).toBe('chacho');
  });

  test('utf8Encode( spanish )', () => {
    expect(utf8Encode('cañón')).toBe('caÃ±Ã³n');
  });
});
