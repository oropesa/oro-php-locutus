import { unserialize } from '../dist';

const error = jest.spyOn(console, 'error').mockImplementation(() => {});

describe('unserialize', () => {
  // test('unserialize( undefined )', () => {
  //   expect(unserialize(undefined)).toBe(undefined);
  // });
  // test('unserialize( int )', () => {
  //   expect(unserialize(17)).toBe(17);
  // });

  test('unserialize( str )', () => {
    expect(unserialize('chacho')).toBe('chacho');
  });

  test('unserialize( ser undefined )', () => {
    expect(unserialize('N;')).toBe(null);
  });

  test('unserialize( ser int )', () => {
    expect(unserialize('i:17;')).toBe(17);
  });

  test('unserialize( ser float )', () => {
    expect(unserialize('d:1.7;')).toBe(1.7);
  });

  test('unserialize( ser special numbers )', () => {
    expect(unserialize('a:3:{s:3:"nan";d:NAN;s:3:"min";d:-INF;s:3:"max";d:INF;}')).toEqual({
      max: Number.POSITIVE_INFINITY,
      min: Number.NEGATIVE_INFINITY,
      nan: Number.NaN,
    });
  });

  test('unserialize( ser str )', () => {
    expect(unserialize('s:6:"chacho";')).toBe('chacho');
  });

  test('unserialize( ser escaped str )', () => {
    expect(unserialize('S:9:""I\'m bad"";')).toBe('"I\'m bad"');
  });

  test('unserialize( ser bool )', () => {
    expect(unserialize('b:1;')).toBe(true);
  });

  test('unserialize( ser arr )', () => {
    expect(unserialize('a:3:{i:0;i:1;i:1;i:2;i:2;i:3;}')).toEqual([1, 2, 3]);
  });

  test('unserialize( ser arr 2 )', () => {
    expect(
      unserialize('a:6:{i:0;s:6:"chacho";i:1;s:0:"";i:2;b:1;i:3;b:0;i:4;i:1;i:5;d:2.3;}'),
    ).toEqual(['chacho', '', true, false, 1, 2.3]);
  });

  test('unserialize( ser reference )', () => {
    expect(unserialize('a:2:{i:0;s:6:"chacho";i:1;R:2;}')).toEqual(['chacho', 'chacho']);
  });

  test('unserialize( ser reference 2 )', () => {
    expect(unserialize('a:2:{i:0;s:6:"chacho";i:1;r:2;}')).toEqual(['chacho', 'chacho']);
  });

  test('unserialize( ser obj )', () => {
    expect(unserialize('a:2:{s:6:"chacho";b:1;s:3:"tio";i:17;}')).toEqual({
      chacho: true,
      tio: 17,
    });
  });

  test('unserialize( ser php-obj )', () => {
    expect(unserialize('a:1:{s:6:"chacho";O:8:"stdClass":1:{s:4:"loco";s:3:"tio";}}')).toEqual({
      chacho: { loco: 'tio' },
    });
  });

  test('unserialize( ser param length )', () => {
    expect(
      unserialize(
        'a:4:{s:5:"width";s:4:"2.55";s:6:"length";s:4:"2.27";s:8:"width_mm";s:3:"0.9";s:9:"length_mm";s:3:"0.8";}',
      ),
    ).toEqual({ width: '2.55', length: '2.27', width_mm: '0.9', length_mm: '0.8' });
  });

  //

  test('unserialize( error default )', () => {
    expect(unserialize('x:1;', true)).toBe('x:1;');
    expect(error).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'SyntaxError',
        message: 'Invalid or unsupported data type: x',
      }),
    );
    error.mockReset();
  });

  test('unserialize( error class )', () => {
    expect(unserialize('C:1;', true)).toBe('C:1;');
    expect(error).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'Error',
        message: 'Not yet implemented',
      }),
    );
    error.mockReset();
  });

  test('unserialize( error bool )', () => {
    expect(unserialize('b:2;', true)).toBe('b:2;');
    expect(error).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'SyntaxError',
        message: 'Invalid bool value, expected 0 or 1',
      }),
    );
    error.mockReset();
  });

  test('unserialize( error int )', () => {
    expect(unserialize('i:1.2;', true)).toBe('i:1.2;');
    expect(error).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'SyntaxError',
        message: 'Expected an integer value',
      }),
    );
    error.mockReset();
  });

  test('unserialize( error float )', () => {
    expect(unserialize('d:abc;', true)).toBe('d:abc;');
    expect(error).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'SyntaxError',
        message: 'Expected a float value',
      }),
    );
    error.mockReset();
  });

  test('unserialize( error str )', () => {
    expect(unserialize('s:123;', true)).toBe('s:123;');
    expect(error).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'SyntaxError',
        message: 'Expected a string value',
      }),
    );
    error.mockReset();
  });

  test('unserialize( error str end)', () => {
    expect(unserialize('s:6:"chacho;', true)).toBe('s:6:"chacho;');
    expect(error).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'SyntaxError',
        message: 'Expected ";',
      }),
    );
    error.mockReset();
  });

  test('unserialize( error escaped str end)', () => {
    expect(unserialize('S:9:""I\'m bad";', true)).toBe('S:9:""I\'m bad";');
    expect(error).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'SyntaxError',
        message: 'Expected ";',
      }),
    );
    error.mockReset();
  });

  test('unserialize( error php-obj type)', () => {
    expect(unserialize('a:1:{s:6:"chacho";O:8:"chacho";}', true)).toBe(
      'a:1:{s:6:"chacho";O:8:"chacho";}',
    );
    expect(error).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'SyntaxError',
        message: 'Invalid input',
      }),
    );
    error.mockReset();
  });

  test('unserialize( error php-obj classname)', () => {
    expect(unserialize('a:1:{s:6:"chacho";O:8:"chacho":1:{s:4:"loco";s:3:"tio";}}', true)).toBe(
      'a:1:{s:6:"chacho";O:8:"chacho":1:{s:4:"loco";s:3:"tio";}}',
    );
    expect(error).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'SyntaxError',
        message: 'Unsupported object type: chacho',
      }),
    );
    error.mockReset();
  });

  test('unserialize( error php-obj end)', () => {
    expect(unserialize('a:1:{s:6:"chacho";O:8:"stdClass":1:{s:4:"loco";s:3:"tio";}', true)).toBe(
      'a:1:{s:6:"chacho";O:8:"stdClass":1:{s:4:"loco";s:3:"tio";}',
    );
    expect(error).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'SyntaxError',
        message: 'Expected }',
      }),
    );
    error.mockReset();
  });

  test('unserialize( error reference index )', () => {
    expect(unserialize('a:2:{i:0;s:6:"chacho";i:1;r:3;}', true)).toEqual(
      'a:2:{i:0;s:6:"chacho";i:1;r:3;}',
    );
    expect(error).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'RangeError',
        message: "Can't resolve reference 3",
      }),
    );
    error.mockReset();
  });

  test('unserialize( error reference )', () => {
    expect(unserialize('a:2:{i:0;s:6:"chacho";i:1;r:abc;}', true)).toEqual(
      'a:2:{i:0;s:6:"chacho";i:1;r:abc;}',
    );
    expect(error).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'SyntaxError',
        message: 'Expected reference value',
      }),
    );
    error.mockReset();
  });

  test('unserialize( error arr )', () => {
    expect(unserialize('a:abc:{i:0;i:1;}', true)).toEqual('a:abc:{i:0;i:1;}');
    expect(error).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'SyntaxError',
        message: 'Expected array length annotation',
      }),
    );
    error.mockReset();
  });

  test('unserialize( error arr end )', () => {
    expect(unserialize('a:1:{i:0;i:1;', true)).toEqual('a:1:{i:0;i:1;');
    expect(error).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'SyntaxError',
        message: 'Expected }',
      }),
    );
    error.mockReset();
  });
});
