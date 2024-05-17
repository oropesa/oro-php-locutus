const { htmlspecialchars } = require('./');

describe('htmlspecialchars', () => {
  test('htmlspecialchars( undefined )', () => {
    expect(htmlspecialchars()).toBe('');
  });
});
