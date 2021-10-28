/**
 * Copyright (c) Baidu Inc. All rights reserved.
 *
 * This source code is licensed under the MIT license.
 * See LICENSE file in the project root for license information.
 *
 */
import {
  compileTemplate,
  TemplateCompileOptions,
  TemplateCompileResult,
} from './compileTemplate';
import { compileScript } from './compileScript';
import {
  compileStyle,
  compileStyleAsync,
  StyleCompileOptions,
  StyleCompileResults,
} from './compileStyle';

import { parseComponent, SFCBlock, SFCDescriptor } from './sfc';

// API
export {
  parseComponent,
  compileTemplate,
  compileScript,
  compileStyle,
  compileStyleAsync,
};

export {
  SFCBlock,
  SFCDescriptor,
  TemplateCompileOptions,
  TemplateCompileResult,
  StyleCompileOptions,
  StyleCompileResults,
};
