import { render, parseHTML, Element } from './parse';

const addId = (root: Element, id: string) => {
  if (!root.attribs) {
    root.attribs = {};
  }
  root.attribs[id] = '';
  if (root.children) {
    root.children.map((node: Element) => addId(node, id));
  }
  return root;
};

export default (source: string, id: string) => {
  const ast = parseHTML(source);

  for (let node of ast) {
    node.type === 'tag' && addId(node as Element, id);
  }

  return render(ast, {
    decodeEntities: false,
  });
};
