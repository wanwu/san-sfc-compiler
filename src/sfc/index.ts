import mapValues from 'lodash.mapvalues';
import { parseComponent as _parseComponent, SFCBlockRaw } from './sfc-parser';

// types
export { Attribute } from './sfc-parser';

import { generateSourceMap } from '../sourcemap';

export class SFCBlock {
  type!: string;
  content!: string;
  attrs!: Record<string, string | true>;
  start!: number;
  end!: number;
  lang?: string;
  src?: string;
  scoped?: true;
  module?: string | true;
  map?: any;

  constructor(block: SFCBlockRaw) {
    Object.keys(block).forEach((_key) => {
      const key = _key as keyof SFCBlockRaw & any;
      Object.defineProperties(this, {
        [key]: {
          value: block[key],
          enumerable: true,
          configurable: true,
          writable: true,
        },
      });
    });
  }
}

export interface SFCDescriptor {
  template: SFCBlock | null;
  script: SFCBlock | null;
  styles: SFCBlock[];
  customBlocks?: SFCBlock[];
  filename?: string;
}

export interface ParseOptions {
  source: string;
  filename?: string;
  sourceRoot?: string;
  needMap?: boolean;
}

const lineComment = '\n';
const addLineComment = (source: string, block: SFCBlock | null) => {
  if (!block) return block;
  const lines = source.substr(0, block.start).split(/\r?\n/g).length - 1;
  block.content = lineComment.repeat(lines) + block.content;
  return block;
};

export function parseSFC(options: ParseOptions): SFCDescriptor {
  const { source, filename = '', sourceRoot = '', needMap = true } = options;

  const addMap = (block: SFCBlockRaw | null) => {
    if (!block) return block;
    if (needMap) {
      if (!block.src && block.type !== 'template' && needMap) {
        block.map = generateSourceMap(
          filename,
          source,
          block.content,
          sourceRoot,
          'line'
        );
      }
      return block;
    }
  };
  const output = mapValues(_parseComponent(source), (value) => {
    if (Array.isArray(value)) {
      return value.map((v) => new SFCBlock(v)).map((style) => addMap(style));
    } else {
      const block = addLineComment(source, value);
      return block && addMap(new SFCBlock(block));
    }
  }) as SFCDescriptor;
  // 返回 .san 文件名
  output.filename = filename;

  return output;
}
