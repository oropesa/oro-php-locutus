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

  test('htmlspecialchars( html )', () => {
    expect(htmlspecialchars('<a href="test">Test</a>', 'ENT_QUOTES')).toBe(
      '&lt;a href=&quot;test&quot;&gt;Test&lt;/a&gt;',
    );
  });
  test('htmlspecialchars( html1 )', () => {
    expect(htmlspecialchars('<a href="test">Test</a>')).toBe(
      '&lt;a href=&quot;test&quot;&gt;Test&lt;/a&gt;',
    );
  });
  test('htmlspecialchars( html bad )', () => {
    expect(htmlspecialchars("<a href='test'>Test</a>")).toBe("&lt;a href='test'&gt;Test&lt;/a&gt;");
  });
  test('htmlspecialchars( html1 bad )', () => {
    expect(htmlspecialchars("<a href='test'>Test</a>", 'ENT_QUOTES')).toBe(
      '&lt;a href=&#039;test&#039;&gt;Test&lt;/a&gt;',
    );
  });
  test('htmlspecialchars( html2 )', () => {
    expect(htmlspecialchars('ab"c\'d', ['ENT_NOQUOTES', 'ENT_QUOTES'])).toBe('ab"c&#039;d');
  });
  test('htmlspecialchars( html3 )', () => {
    expect(htmlspecialchars('my "&entity;" is still here', null, null, false)).toBe(
      'my &quot;&entity;&quot; is still here',
    );
  });
});
