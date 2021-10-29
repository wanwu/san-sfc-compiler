# san-sfc-compiler

> Lower level utilities for compiling `.san` single file components

fork from [vuejs/component-compiler-utils](https://github.com/vuejs/component-compiler-utils)

## API

### `parseSFC`

描述：解析 .san 文件源码

使用：

```ts
parseSFC({
  source: '<div><p>{{ helloworld }}</p></div>',
  filename: 'test.san',
});

// 选项
export interface ParseOptions {
  source: string;
  filename?: string;
  sourceRoot?: string;
  needMap?: boolean;
}
```

方法 / 属性：

| 方法 / 属性 | 描述                          | 类型    |
| ----------- | ----------------------------- | ------- |
| source      | 源码                          | string  |
| filename    | 文件名                        | string  |
| sourceRoot  | sourcemap 选项                | string  |
| needMap     | sourcemap 开关（template 没有 | boolean |

返回：

```ts
export interface SFCDescriptor {
  template: SFCBlock | null;
  script: SFCBlock | null;
  styles: SFCBlock[];
  customBlocks: SFCBlock[];
}
```

其中 SFCBlock 类型为这样：

```ts
{
    type!: string;
    content!: string;
    attrs!: Record<string, string | true>;
    start!: number;
    end!: number;
    lang?: string;
    src?: string;
    scoped?: true;
    module?: string | true;
}
```

content 就是标签内容了。

### `compileTemplate`

描述：编译模板代码，即 `<template>` 标签中包含的部分

使用：

```ts
const result = compileTemplate({
  source: '<div><img src="../images/profile.png" /></div>',
  filename: 'example.san',
  transformAssetUrls: true,
});
```

方法 / 属性：

| 方法 / 属性        | 描述                         | 类型                   |
| ------------------ | ---------------------------- | ---------------------- |
| source             | 源码                         | string                 |
| filename           | 文件名                       | string                 |
| id                 | 一般用在 scoped css 时       | string                 |
| scoped             | scoped css 开关              | boolean                |
| transformAssetUrls | 将 url 转换为 require        | boolean                |
| compileANode       | 编译为 anode / apack         | 'aNode'/'aPack'/'none' |
| preprocessLang     | 预处理语言，pugjs 等         | string                 |
| preprocessOptions  | 预处理的选项，传递给预处理器 | object                 |

返回：

```ts
{
    code: '<div><img src="require(../images/profile.png);"></div>',
    source: '<div><img src="../images/profile.png" /></div>'
}
```

### `compileStyle / compileStyleAsync`

描述：编译样式代码，即 `<style>` 标签中包含的部分

使用：

```ts
const style = parseSFC({
  source: `<style lang="less">@red: rgb(255, 0, 0);\n.color { color: @red; }\n</style>`,
  filename: 'test.san',
}).styles[0] as any;

const result = compileStyle({
  id: 'test',
  filename: 'test.san',
  source: style.content,
  scoped: true,
  map: style.map,
  preprocessLang: style.lang,
});
```

方法 / 属性：

| 方法 / 属性       | 描述                                    | 类型    |
| ----------------- | --------------------------------------- | ------- |
| source            | 源码                                    | string  |
| filename          | 文件名                                  | string  |
| id                | 添加 scoped css id                      | string  |
| scoped            | scoped css 开关                         | boolean |
| preprocessLang    | 预处理语言，less sass 等                | string  |
| preprocessOptions | 预处理的选项，传递给预处理器            | object  |
| postcssOptions    | postcss 的选项，直接传递给它            | object  |
| postcssPlugins    | postcss 的插件，直接传递给它            | object  |
| map               | sourcemap 的 map，如 less => css 的映射 | object  |

返回：

```ts
{
    code: '<div><img src="require(../images/profile.png);"></div>',
    source: '<div><img src="../images/profile.png" /></div>'
}
```

### `compileScript`

描述：直接使用 ts 的 transpile 方法

```ts
export const compileScript = (source: string, config: CompilerOptions) => {
  return typescrtipt.transpile(source, config);
};
```

如果不清楚，可以参考 test 目录下的测试文件

## LICENSE

Copyright (c) Baidu Inc. All rights reserved.

This source code is licensed under the MIT license.
