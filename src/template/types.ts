import { RawSourceMap } from 'src/sourcemap';

export interface TemplateCompileOptions {
  source: string;
  filename: string;
  id?: string;
  scoped?: boolean;
  transformAssetUrls?: boolean;
  compileANode?: 'aNode' | 'aPack' | 'none';
  preprocessLang?: string;
  preprocessOptions?: any;
}

export interface TemplateCompileResult {
  map?: RawSourceMap | any;
  code: string;
  source: string;
}
