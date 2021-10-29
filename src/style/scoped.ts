const selectorParser = require('postcss-selector-parser');

export default function (scopeId: string) {
  const keyframes: any = {};

  // 处理选择器
  const rewriteSelector = (node: any) => {
    if (!node.selector) {
      if (node.type === 'atrule') {
        // 媒体查询 https://astexplorer.net/#/2uBU1BLuJ1
        // 还有一些不常用的语法，不过这里不考虑
        if (node.name === 'media') {
          node.each(rewriteSelector);
        } else if (/-?keyframes$/.test(node.name)) {
          keyframes[node.params] = node.params = node.params + '-' + scopeId;
        }
      }
      return;
    }
    node.selector = selectorParser((selectors: any) => {
      selectors.each((s: any) => {
        const attrNode = selectorParser.attribute({
          attribute: scopeId,
        });
        s.append(attrNode);
      });
    }).processSync(node.selector);
  };

  // 处理动画名称
  const rewriteAnimation = (decl: any) => {
    if (/^(-\w+-)?animation-name$/.test(decl.prop)) {
      decl.value = decl.value
        .split(',')
        .map((v: any) => keyframes[v.trim()] || v.trim())
        .join(',');
    }
    if (/^(-\w+-)?animation$/.test(decl.prop)) {
      decl.value = decl.value
        .split(',')
        .map((v: any) => {
          const vals = v.trim().split(/\s+/);
          // eslint-disable-next-line max-nested-callbacks
          const i = vals.findIndex((val: any) => keyframes[val]);
          if (i !== -1) {
            vals.splice(i, 1, keyframes[vals[i]]);
            return vals.join(' ');
          }
          return v;
        })
        .join(',');
    }
  };

  return {
    postcssPlugin: 'set-scope-id',
    Once(root: any) {
      // step1
      root.each((node: any) => rewriteSelector(node));
      // step2
      if (Object.keys(keyframes).length) {
        root.walkDecls((decl: any) => rewriteAnimation(decl));
      }
    },
  };
}

module.exports.postcss = true;
