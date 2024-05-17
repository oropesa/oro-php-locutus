import { htmlspecialchars } from './';

describe('htmlspecialchars', () => {
  test('htmlspecialchars( str )', () => {
    expect(htmlspecialchars('chacho')).toBe('chacho');
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
    expect(htmlspecialchars('my "&entity;" is still here', undefined, null, false)).toBe(
      'my &quot;&entity;&quot; is still here',
    );
  });
});
