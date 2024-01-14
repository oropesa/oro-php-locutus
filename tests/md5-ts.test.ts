import { md5 } from '../dist';

describe('fn: md5', () => {
  // test('fn: md5( undefined )', () => {
  //   expect(md5(undefined)).toBe('');
  // });
  // test('fn: md5( null )', () => {
  //   expect(md5(null)).toBe('');
  // });
  test('fn: md5( str empty )', () => {
    expect(md5('')).toBe('d41d8cd98f00b204e9800998ecf8427e');
  });

  test('fn: md5( str )', () => {
    expect(md5('chacho')).toBe('496c84fb22e82d68fad9e5fe8e89d03d');
  });

  test('fn: md5( str 1 ) back', () => {
    expect(md5('this is a great example')).toBe('a29fe6323d82482e99cd3402f77ef330');
  });

  test('fn: md5( str 1 ) front', () => {
    jest.mock('crypto', () => ({
      createHash: () => {
        throw new Error('Error');
      },
    }));

    expect(md5('this is a great example')).toBe('a29fe6323d82482e99cd3402f77ef330');
  });
});
