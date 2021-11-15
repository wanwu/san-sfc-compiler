const consolidate = require('consolidate');

import {
  TemplateCompileOptions,
  TemplateCompileResult,
} from './template/types';

import preprocess from './template/preprocess';
import addScopedId from './template/scoped';
import transformUriToRequire from './template/uri';
import compileANodeOrAPack from './template/anode';

export function compileTemplate(
  options: TemplateCompileOptions
): TemplateCompileResult {
  const {
    source,
    id = '',
    scoped = false,
    transformAssetUrls = false,
    compileANode,
    preprocessLang,
  } = options;

  let code = source;

  // preprocess template, e.g. pug -> html
  const preprocessor = preprocessLang && consolidate[preprocessLang];
  if (preprocessor) {
    code = preprocess(options, preprocessor);
  }

  // transform asset url to require
  if (transformAssetUrls) {
    code = transformUriToRequire(code);
  }

  // scoped css add id
  if (scoped) {
    code = addScopedId(code, id);
  }

  // anode or apack
  if (compileANode && compileANode !== 'none') {
    code = compileANodeOrAPack(code, compileANode);
  }

  return {
    code,
    source,
    map: {
      version: 3,
      mappings: '',
    },
  };
}
