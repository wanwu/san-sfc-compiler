import { parseSFC, compileTemplate } from '../src';

import {
  TemplateCompileOptions,
  TemplateCompileResult,
} from '../src/template/types';

test('should work', () => {
  const source = `<div><p>{{ helloworld }}</p></div>`;

  const result: TemplateCompileResult = compileTemplate({
    filename: 'example.san',
    source,
    compileANode: 'aPack',
  } as TemplateCompileOptions);

  expect(result.code).toEqual(
    expect.arrayContaining([
      1,
      'div',
      1,
      1,
      'p',
      1,
      undefined,
      6,
      1,
      3,
      'helloworld',
    ])
  );
});

test('preprocess pug', () => {
  const template = parseSFC({
    source:
      '<template lang="pug">\n' +
      'body\n' +
      ' h1 Pug Examples\n' +
      ' div.container\n' +
      '   p Cool Pug example!\n' +
      '</template>\n',
    filename: 'example.san',
  }).template as any;

  const result = compileTemplate({
    filename: 'example.san',
    source: template.content,
    preprocessLang: 'pug',
  });

  expect(result.code).toBe(
    '<body><h1>Pug Examples</h1><div class="container"><p>Cool Pug example!</p></div></body>'
  );
});

test('test img url to require', () => {
  const result = compileTemplate({
    source: '<div><img src="../images/profile.png" /></div>',
    filename: 'example.san',
    transformAssetUrls: true,
  });

  expect(result.code).toEqual(
    expect.stringContaining(
      '<div><img src="require(../images/profile.png);"></div>'
    )
  );
});

test('add scoped id', () => {
  const result = compileTemplate({
    source: '<div>hello</div>',
    filename: 'example.san',
    id: 'foo',
    scoped: true,
  });

  expect(result.code).toEqual(expect.stringContaining('<div foo>hello</div>'));
});
