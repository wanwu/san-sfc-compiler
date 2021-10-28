import aNodeUtils from 'san-anode-utils';

export default function (
  source?: string,
  compileType?: 'aNode' | 'aPack' | 'none'
) {
  let result = source;
  if (compileType && compileType !== 'none') {
    const aNode = aNodeUtils.parseTemplate(source);
    switch (compileType) {
      case 'aNode':
        result = aNode;
        break;
      case 'aPack':
        if (aNode.children.length) {
          const aPack = aNodeUtils.pack(aNode.children[0]);
          result = aPack;
        }
        break;
      default:
        break;
    }
  }
  return result;
}
