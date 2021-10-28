import { parseHTML, Attribute } from '../sfc';

const uriMap: Record<string, string[]> = {
  audio: ['src'],
  video: ['src', 'poster'],
  source: ['src'],
  img: ['src'],
  image: ['xlink:href', 'href'],
  use: ['xlink:href', 'href'],
};

export default (source: string) =>
  parseHTML(source, {
    start(tag: string, attrs: Array<Attribute>) {
      if (tag in uriMap) {
        for (let i = 0; i < attrs.length; i++) {
          const attr = attrs[i];
          if (uriMap[tag].includes(attr.name)) {
            const src = attr.value;
            attr.value = `require('${src}')'`;
          }
        }
      }
    },
  });
