const { unserialize } = require('../dist');

describe('unserialize', () => {
  test('unserialize( undefined )', () => {
    expect(unserialize()).toBe(undefined);
  });
  test('unserialize( int )', () => {
    expect(unserialize(17)).toBe(17);
  });
  test('unserialize( str )', () => {
    expect(unserialize('chacho')).toBe('chacho');
  });
  test('unserialize( bool )', () => {
    expect(unserialize(true)).toBe(true);
  });
  test('unserialize( arr )', () => {
    expect(unserialize([1, 2, 3])).toEqual([1, 2, 3]);
  });
  test('unserialize( obj )', () => {
    expect(unserialize({ chacho: true, tio: 17 })).toEqual({ chacho: true, tio: 17 });
  });

  test('unserialize( ser undefined )', () => {
    expect(unserialize('N;')).toBe(null);
  });
  test('unserialize( ser int )', () => {
    expect(unserialize('i:17;')).toBe(17);
  });
  test('unserialize( ser str )', () => {
    expect(unserialize('s:6:"chacho";')).toBe('chacho');
  });
  test('unserialize( ser bool )', () => {
    expect(unserialize('b:1;')).toBe(true);
  });
  test('unserialize( ser arr )', () => {
    expect(unserialize('a:3:{i:0;i:1;i:1;i:2;i:2;i:3;}')).toEqual([1, 2, 3]);
  });
  test('unserialize( ser obj )', () => {
    expect(unserialize('a:2:{s:6:"chacho";b:1;s:3:"tio";i:17;}')).toEqual({
      chacho: true,
      tio: 17,
    });
  });
  test('unserialize( ser arr 2 )', () => {
    expect(
      unserialize('a:6:{i:0;s:6:"chacho";i:1;s:0:"";i:2;b:1;i:3;b:0;i:4;i:1;i:5;d:2.3;}'),
    ).toEqual(['chacho', '', true, false, 1, 2.3]);
  });

  test('unserialize( ser param length )', () => {
    expect(
      unserialize(
        'a:4:{s:5:"width";s:4:"2.55";s:6:"length";s:4:"2.27";s:8:"width_mm";s:3:"0.9";s:9:"length_mm";s:3:"0.8";}',
      ),
    ).toEqual({ width: '2.55', length: '2.27', width_mm: '0.9', length_mm: '0.8' });
  });
});
