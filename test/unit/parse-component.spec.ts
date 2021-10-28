import { parseComponent } from '../../src/sfc';

test('spaces after selector', () => {
  const res = parseComponent(
    '<template compile="anode"><div>ok</div></template><style>div{color:red}</style>'
  );
  expect(res.template?.content).toMatch('<div>ok</div>');
});
