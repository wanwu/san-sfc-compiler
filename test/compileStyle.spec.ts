import { parseSFC, compileStyle } from '../src';

test('spaces after selector', () => {
  const style = parseSFC({
    source: `<style>.foo , .bar { color: red; }</style>`,
    filename: 'test.san',
  }).styles[0];

  const res = compileStyle({
    source: style.content,
    filename: 'test.san',
    id: 'test',
    scoped: true,
    map: style.map,
  });

  expect(res.code).toMatch(`.foo [test], .bar[test] { color: red; }`);
});

test('preprocess less', () => {
  const style = parseSFC({
    source: `<style lang="less">@red: rgb(255, 0, 0);\n.color { color: @red; }\n</style>`,
    filename: 'test.san',
  }).styles[0] as any;

  const result = compileStyle({
    id: 'test',
    filename: 'test.san',
    source: style.content,
    scoped: true,
    map: style.map,
    preprocessLang: style.lang,
  });

  expect(result.code).toEqual(expect.stringContaining('color: #ff0000;'));

  expect(result.map).toBeTruthy();
});

test('preprocess sass', () => {
  const style = parseSFC({
    source: `<style lang="scss">$red: rgb(255, 0, 0);\n.color { color: $red; }\n</style>`,
    filename: 'test.san',
  }).styles[0] as any;

  const result = compileStyle({
    id: 'test',
    filename: 'test.san',
    source: style.content,
    scoped: true,
    map: style.map,
    preprocessLang: style.lang,
  });

  expect(result.code).toEqual(expect.stringContaining('color: red;'));

  expect(result.map).toBeTruthy();
});

test('css modules', () => {
  const style = parseSFC({
    source: `<style module>.red { color: red; }\ndiv { font-size: 20px }</style>`,
    filename: 'test.san',
  }).styles[0] as any;

  const result = compileStyle({
    id: 'test',
    filename: 'test.san',
    source: style.content,
    scoped: false,
    modules: true,
    map: style.map,
    preprocessLang: style.lang,
  });

  expect(result.code).toEqual(expect.stringContaining('color: red;'));

  expect(result.code).toEqual(expect.stringContaining('.red_'));

  expect(result.map).toBeTruthy();

  expect(result.cssHashMap).toBeTruthy();
});
