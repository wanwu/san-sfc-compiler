import { parseHTML, Attribute } from '../sfc';

const ignoreList: string[] = ['html', 'svg'];

export default (source: string, scopeId: string) =>
  parseHTML(source, {
    start(tag: string, attrs: Array<Attribute>) {
      if (!ignoreList.includes(tag))
        attrs.push({
          name: scopeId,
          value: '',
        });
    },
  });
