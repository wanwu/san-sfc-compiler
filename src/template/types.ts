export interface TemplateCompileOptions {
  source: string;
  filename: string;
  parser: VueTemplateCompiler;
  parserOptions?: VueTemplateCompilerOptions;
  transformAssetUrls?: AssetURLOptions | boolean;
  transformAssetUrlsOptions?: TransformAssetUrlsOptions;
  preprocessLang?: string;
  preprocessOptions?: any;
  transpileOptions?: any;
  compileANode?: boolean;
  compileAPack?: boolean;
}

export interface TemplateCompileResult {
  ast: Object | undefined;
  code: string;
  source: string;
}
