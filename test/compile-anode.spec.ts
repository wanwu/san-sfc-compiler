import compileANode from '../dist/template/anode';

test('compile apack transpile should work', () => {
  const source = `<div>anode?</div>`;

  const result = compileANode(source, 'aPack');

  expect(result).toEqual(
    expect.arrayContaining([1, 'div', 1, undefined, 3, 'anode?'])
  );
});

test('compile anode transpile should work', () => {
  const source = `<div>anode?</div>`;

  const result = compileANode(source, 'aNode');

  expect(result).toEqual(
    expect.objectContaining({
      children: [
        {
          children: [{ textExpr: { type: 1, value: 'anode?' } }],
          directives: {},
          events: [],
          props: [],
          tagName: 'div',
        },
      ],
      directives: {},
      events: [],
      props: [],
    })
  );
});
