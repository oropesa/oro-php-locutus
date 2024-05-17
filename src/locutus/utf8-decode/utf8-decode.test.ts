import { utf8Decode } from './';

describe('utf8Decode', () => {
  test('utf8Decode( str )', () => {
    expect(utf8Decode('chacho')).toBe('chacho');
  });

  test('utf8Decode( spanish )', () => {
    expect(utf8Decode('caÃ±Ã³n')).toBe('cañón');
  });
});
