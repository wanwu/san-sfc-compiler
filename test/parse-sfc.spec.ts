import { parseSFC } from '../src/sfc';

test('get template block', () => {
  const res = parseSFC({
    filename: 'test.san',
    source:
      '<template compile="anode"><div>ok</div></template>\n<style>div{color:red}</style>',
  });

  expect(res.template?.content).toMatch('<div>ok</div>');
  expect(res.filename).toBe('test.san');
});

test('get style block', () => {
  const res = parseSFC({
    filename: 'test.san',
    source:
      '<style>.red{}</style>\n<template compile="anode"><div>ok</div></template>',
  });
  expect(res.styles[0]?.content).toMatch('.red{}');
});

test('get script block', () => {
  const res = parseSFC({
    filename: 'test.san',
    source:
      '<template><div>ok</div></template>\n<script>export default{}</script>',
  });
  expect(res.script?.content).toMatch('export default{}');
});
