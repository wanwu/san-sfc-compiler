import { parseDocument } from 'htmlparser2';
import { Element } from 'domhandler';
import render from 'dom-serializer';

export function parseHTML(source: string) {
  const doc = parseDocument(source, {
    recognizeSelfClosing: true,
    withStartIndices: true,
    withEndIndices: true,
    lowerCaseAttributeNames: false,
  });

  return doc.children || [];
}
export { render, Element };
