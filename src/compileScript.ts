// transpile ts content
import typescrtipt, { CompilerOptions } from 'typescript';

export const compileScript = (source: string, config: CompilerOptions) => {
  return typescrtipt.transpile(source, config);
};
