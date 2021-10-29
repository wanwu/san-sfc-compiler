/**
 * Copyright (c) Baidu Inc. All rights reserved.
 *
 * This source code is licensed under the MIT license.
 * See LICENSE file in the project root for license information.
 *
 */
import { compileTemplate } from './compileTemplate';
import {
  TemplateCompileOptions,
  TemplateCompileResult,
} from './template/types';

import { compileStyle, compileStyleAsync } from './compileStyle';
import { StyleCompileOptions, StyleCompileResults } from './style/types';

import { compileScript } from './compileScript';

import { parseSFC, ParseOptions, SFCBlock, SFCDescriptor } from './sfc';

// API
export {
  parseSFC,
  compileTemplate,
  compileScript,
  compileStyle,
  compileStyleAsync,
};

// types
export {
  SFCBlock,
  SFCDescriptor,
  ParseOptions,
  TemplateCompileOptions,
  TemplateCompileResult,
  StyleCompileOptions,
  StyleCompileResults,
};
