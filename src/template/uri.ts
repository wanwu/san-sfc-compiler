import { render, parseHTML, Element } from './parse';

const uriMap: Record<string, string[]> = {
  audio: ['src'],
  video: ['src', 'poster'],
  source: ['src'],
  img: ['src'],
  image: ['xlink:href', 'href'],
  use: ['xlink:href', 'href'],
};

const uri2Require = (root: Element) => {
  if (!root.attribs) return root;

  const name = root.name;
  const attrs = uriMap[name];
  if (name in uriMap)
    for (let i = 0; i < uriMap[name].length; i++) {
      const attr = attrs[i];
      if (attr in root.attribs) {
        const src = root.attribs[attr];
        root.attribs[attr] = `require(${src});`;
      }
    }

  if (root.children) {
    root.children.map((node) => {
      if (node.type === 'tag') {
        uri2Require(node as Element);
      }
    });
  }
  return root;
};

export default (source: string) => {
  const ast = parseHTML(source);

  for (let node of ast) {
    if (node.type === 'tag') {
      uri2Require(node as Element);
    }
  }

  return render(ast, {
    decodeEntities: false,
  });
};
