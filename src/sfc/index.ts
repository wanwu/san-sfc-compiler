import mapValues from 'lodash.mapvalues';
import { parseComponent as _parseComponent, SFCBlockRaw } from './sfc-parser';
import { equalsRecord } from './utils';

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
        },
      });
    });
  }

  equals(block: SFCBlock): boolean {
    if (this === block) {
      return true;
    }

    return (
      this.type === block.type &&
      this.content === block.content &&
      this.start === block.start &&
      this.end === block.end &&
      this.lang === block.lang &&
      this.src === block.src &&
      this.scoped === block.scoped &&
      this.module === block.module &&
      equalsRecord(this.attrs, block.attrs)
    );
  }

  calcGlobalOffset(offset: number): number {
    return this.start + offset;
  }

  calcGlobalRange(range: [number, number]): [number, number] {
    return [this.calcGlobalOffset(range[0]), this.calcGlobalOffset(range[1])];
  }
}

export interface SFCDescriptor {
  template: SFCBlock | null;
  script: SFCBlock | null;
  styles: SFCBlock[];
  customBlocks: SFCBlock[];
}

export interface ParseOptions {
  source: string;
  filename?: string;
  sourceRoot?: string;
  needMap?: boolean;
}

export function parseSFC(options: ParseOptions): SFCDescriptor {
  const { source, filename = '', sourceRoot = '', needMap = true } = options;

  const addMap = (block: SFCBlockRaw) => {
    if (!block.src && needMap) {
      block.map = generateSourceMap(
        filename,
        source,
        block.content,
        sourceRoot,
        'line'
      );
    }
    return block;
  };

  const output = mapValues(_parseComponent(source), (value) => {
    if (Array.isArray(value)) {
      return value.map((v) => new SFCBlock(v)).map((style) => addMap(style));
    } else {
      return value && addMap(new SFCBlock(value));
    }
  }) as SFCDescriptor;

  return output;
}
