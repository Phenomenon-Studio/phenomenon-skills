// Rewrites relative links between docs/*.md files (which work on GitHub)
// into site routes: ./skills/tanstack.md#x -> /<base>/skills/tanstack/#x
import { dirname, posix, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const DOCS_ROOT = fileURLToPath(new URL('../../docs', import.meta.url));

const toRoute = (url, filePath, base) => {
  const match = url.match(/^(\.{1,2}\/[^#?]*?)\.md(#.*)?$/);
  if (!match) {
    return url;
  }
  const target = relative(DOCS_ROOT, resolve(dirname(filePath), match[1])).split('\\').join('/');
  const slug = target === 'index' ? '' : `${target.replace(/\/index$/, '')}/`;
  return posix.join(base, '/', slug) + (slug ? '' : '/') + (match[2] ?? '');
};

export const remarkDocsLinks = ({ base }) => {
  return (tree, file) => {
    const walk = (node) => {
      if (node.type === 'link' || node.type === 'definition') {
        node.url = toRoute(node.url, file.path, base);
      }
      node.children?.forEach(walk);
    };
    walk(tree);
  };
};
