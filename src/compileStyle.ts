import postcss, { ProcessOptions, LazyResult, Result } from 'postcss';

import {
  StyleCompileOptions,
  StyleCompileResults,
  AsyncStyleCompileOptions,
  StylePreprocessor,
  StylePreprocessorResults,
} from './style/types';

import { processors } from './style/preprocess';
import scopedPlugin from './style/scoped';
import mutePlugin from './style/mute';
import cssModulesPlugin from 'postcss-modules-sync';

export function compileStyle(
  options: StyleCompileOptions
): StyleCompileResults {
  return doCompileStyle({ ...options, isAsync: false });
}

export function compileStyleAsync(
  options: StyleCompileOptions
): Promise<StyleCompileResults> {
  return Promise.resolve(doCompileStyle({ ...options, isAsync: true }));
}

export function doCompileStyle(
  options: AsyncStyleCompileOptions
): StyleCompileResults | any {
  const {
    filename,
    id = '',
    scoped = false,
    modules = false,
    mute = true, // 去除 postcss 控制台信息
    preprocessLang,
    postcssOptions,
    postcssPlugins,
  } = options;
  const preprocessor = preprocessLang && processors[preprocessLang];
  const preProcessedSource = preprocessor && preprocess(options, preprocessor);
  const map = preProcessedSource ? preProcessedSource.map : options.map;
  const source = preProcessedSource ? preProcessedSource.code : options.source;

  const plugins = (postcssPlugins || []).slice();

  if (scoped) {
    plugins.push(scopedPlugin(id));
  }

  if (mute) {
    plugins.push(mutePlugin);
  }

  let cssHashMap = {};
  if (modules) {
    plugins.push(
      cssModulesPlugin({
        getJSON: (tokens: any) => (cssHashMap = tokens),
      })
    );
  }

  const postCSSOptions: ProcessOptions = {
    ...postcssOptions,
    to: filename,
    from: filename,
  };
  if (map) {
    postCSSOptions.map = {
      inline: false,
      annotation: false,
      prev: map,
    };
  }

  let result, code, outMap;
  const errors: any[] = [];
  if (preProcessedSource && preProcessedSource.errors.length) {
    errors.push(...preProcessedSource.errors);
  }
  try {
    result = postcss(plugins).process(source, postCSSOptions);

    // In async mode, return a promise.
    if (options.isAsync) {
      return result
        .then(
          (result: Result | LazyResult): StyleCompileResults => ({
            code: result.css || '',
            source,
            map: result.map && result.map.toJSON(),
            errors,
            rawResult: result,
          })
        )
        .catch(
          (error: Error): StyleCompileResults => ({
            code: '',
            source,
            map: undefined,
            errors: [...errors, error.message],
            rawResult: undefined,
          })
        );
    }

    // force synchronous transform (we know we only have sync plugins)
    code = result.css;
    outMap = result.map;
  } catch (e) {
    errors.push(e);
  }

  return {
    code,
    source,
    rawResult: result,
    map: outMap && outMap.toJSON(),
    errors,
    cssHashMap,
  };
}

function preprocess(
  options: StyleCompileOptions,
  preprocessor: StylePreprocessor
): StylePreprocessorResults {
  return preprocessor.render(
    options.source,
    options.map,
    Object.assign(
      {
        filename: options.filename,
      },
      options.preprocessOptions
    )
  );
}
