const { serialize } = require('./');

describe('serialize', () => {
  test('serialize( undefined )', () => {
    expect(serialize()).toBe('N;');
  });
});
