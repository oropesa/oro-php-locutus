const { htmlspecialchars } = require('../dist');

describe('htmlspecialchars', () => {
  test('htmlspecialchars( undefined )', () => {
    expect(htmlspecialchars()).toBe('');
  });

  test('htmlspecialchars( int )', () => {
    expect(htmlspecialchars(17)).toBe('17');
  });

  test('htmlspecialchars( str )', () => {
    expect(htmlspecialchars('chacho')).toBe('chacho');
  });

  test('htmlspecialchars( bool )', () => {
    expect(htmlspecialchars(true)).toBe('true');
  });

  test('htmlspecialchars( arr )', () => {
    expect(htmlspecialchars([1, 2, 3])).toBe('1,2,3');
  });

  test('htmlspecialchars( obj )', () => {
    expect(htmlspecialchars({ chacho: true, tio: 17 })).toBe('[object Object]');
  });

  test('htmlspecialchars( html ) ENT_NOQUOTES (zero)', () => {
    expect(htmlspecialchars('<a href="http://localhos:3000">Test</a>', 0)).toBe(
      '&lt;a href="http://localhos:3000"&gt;Test&lt;/a&gt;',
    );
  });

  test('htmlspecialchars( html ) ENT_NOQUOTES', () => {
    expect(htmlspecialchars('<a href="http://localhos:3000">Test</a>', 'ENT_NOQUOTES')).toBe(
      '&lt;a href="http://localhos:3000"&gt;Test&lt;/a&gt;',
    );
  });

  test('htmlspecialchars( html ) ENT_QUOTES', () => {
    expect(htmlspecialchars('<a href="http://localhos:3000">Test</a>', 'ENT_QUOTES')).toBe(
      '&lt;a href=&quot;http://localhos:3000&quot;&gt;Test&lt;/a&gt;',
    );
  });

  test('htmlspecialchars( html ) default', () => {
    expect(htmlspecialchars('<a href="http://localhos:3000">Test</a>')).toBe(
      '&lt;a href=&quot;http://localhos:3000&quot;&gt;Test&lt;/a&gt;',
    );
  });

  test('htmlspecialchars( html bad )', () => {
    expect(htmlspecialchars("<a href='http://localhos:3000'>Test</a>")).toBe(
      "&lt;a href='http://localhos:3000'&gt;Test&lt;/a&gt;",
    );
  });

  test('htmlspecialchars( html bad ) ENT_QUOTES', () => {
    expect(htmlspecialchars("<a href='http://localhos:3000'>Test</a>", 'ENT_QUOTES')).toBe(
      '&lt;a href=&#039;http://localhos:3000&#039;&gt;Test&lt;/a&gt;',
    );
  });

  test('htmlspecialchars( html ) array', () => {
    expect(htmlspecialchars('ab"c\'d', ['ENT_NOQUOTES', 'ENT_QUOTES'])).toBe('ab"c&#039;d');
  });

  test('htmlspecialchars( html ) doubleEncode=false', () => {
    expect(htmlspecialchars('my "&entity;" is still here', null, null, false)).toBe(
      'my &quot;&entity;&quot; is still here',
    );
  });
});
