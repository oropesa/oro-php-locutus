const { unserialize } = require('./');

describe('unserialize', () => {
  test('unserialize( undefined )', () => {
    expect(unserialize()).toBe(undefined);
  });

  test('unserialize( int )', () => {
    expect(unserialize(17)).toBe(17);
  });
});
