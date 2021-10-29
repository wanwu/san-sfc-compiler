import { compileScript } from '../';

test('ts transpile should work', () => {
  const source = `let a:string = '%'`;

  const result = compileScript(source, {
    sourceMap: false,
    noUnusedLocals: true,
  });

  expect(result).toEqual(expect.stringContaining(`var a = '%'`));
});
