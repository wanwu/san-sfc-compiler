import { SourceMapGenerator } from 'source-map';

const splitRE = /\r?\n/g;
const emptyRE = /^(?:\/\/)?\s*$/;

export interface RawSourceMap {
  file?: string;
  sourceRoot?: string;
  version: string;
  sources: string[];
  names: string[];
  sourcesContent?: string[];
  mappings: string;
}

export function generateSourceMap(
  filename: string,
  source: string,
  generated: string,
  sourceRoot: string = '',
  pad?: 'line' | 'space'
): RawSourceMap {
  const map = new SourceMapGenerator({
    file: filename.replace(/\\/g, '/'),
    sourceRoot: sourceRoot.replace(/\\/g, '/'),
  });
  let offset = 0;
  if (!pad) {
    offset = source.split(generated).shift()!.split(splitRE).length - 1;
  }
  map.setSourceContent(filename, source);
  generated.split(splitRE).forEach((line, index) => {
    if (!emptyRE.test(line)) {
      map.addMapping({
        source: filename,
        original: {
          line: index + 1 + offset,
          column: 0,
        },
        generated: {
          line: index + 1,
          column: 0,
        },
      });
    }
  });
  return JSON.parse(map.toString());
}
