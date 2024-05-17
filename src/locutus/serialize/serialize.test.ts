import { serialize } from './';

describe('serialize', () => {
  test('serialize( null )', () => {
    expect(serialize(null)).toBe('N;');
  });

  test('serialize( int )', () => {
    expect(serialize(17)).toBe('i:17;');
  });

  test('serialize( str )', () => {
    expect(serialize('chacho')).toBe('s:6:"chacho";');
  });

  test('serialize( bool )', () => {
    expect(serialize(true)).toBe('b:1;');
  });

  test('serialize( arr )', () => {
    expect(serialize([1, 2, 3])).toBe('a:3:{i:0;i:1;i:1;i:2;i:2;i:3;}');
  });

  test('serialize( arr2 )', () => {
    expect(serialize(['chacho', '', true, false, 1, 2.3])).toBe(
      'a:6:{i:0;s:6:"chacho";i:1;s:0:"";i:2;b:1;i:3;b:0;i:4;i:1;i:5;d:2.3;}',
    );
  });

  test('serialize( obj )', () => {
    expect(serialize({ chacho: true, tio: 17 })).toBe('a:2:{s:6:"chacho";b:1;s:3:"tio";i:17;}');
  });

  test('serialize( fn )', () => {
    expect(serialize(() => {})).toBe(';');
  });

  test('serialize( obj-fn )', () => {
    expect(serialize({ chacho: () => {}, tio: 17 })).toBe('a:1:{s:3:"tio";i:17;}');
  });

  test('serialize( obj-obj )', () => {
    expect(serialize({ chacho: { tio: 17 } })).toBe('a:1:{s:6:"chacho";a:1:{s:3:"tio";i:17;}}');
  });

  test('serialize( obj-!consctructor )', () => {
    expect(serialize({ constructor: undefined })).toBe('a:1:{s:11:"constructor";N;}');
  });

  test('serialize( obj-arr-obj )', () => {
    expect(serialize({ chacho: [{ tio: 17 }] })).toBe(
      'a:1:{s:6:"chacho";a:1:{i:0;a:1:{s:3:"tio";i:17;}}}',
    );
  });
});
