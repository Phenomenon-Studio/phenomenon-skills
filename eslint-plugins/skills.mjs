// ESLint rules for skills/<group>/<skill>/*.md — the mechanical half of the review checklist
// in docs/contributing.md. Runs on @eslint/markdown's mdast, so the editor's ESLint extension
// underlines problems in place and `pnpm lint` fails CI on errors.

import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { basename, dirname, join, relative, resolve } from 'node:path';
import { ROOT, SKILLS_DIR, parseFields, readFrontmatter } from '../scripts/skills.mjs';

const docs = (description) => {
  return { description, url: 'https://phenomenon-studio.github.io/phenomenon-skills/contributing/#review-checklist' };
};

// Frontmatter of the SKILL.md being linted, with a loc per field for precise squiggles.
const frontmatter = (context) => {
  const [first] = context.sourceCode.ast.children;
  if (first?.type !== 'yaml') {
    return null;
  }
  const start = first.position.start.line + 1; // value begins after the opening ---
  const fields = parseFields(first.value);
  const locOf = (key) => {
    const line = start + (fields[key]?.line ?? -1);
    const text = context.sourceCode.lines[line - 1] ?? '';
    return fields[key]
      ? { start: { line, column: 1 }, end: { line, column: text.length + 1 } }
      : first.position;
  };
  const value = (key) => {
    return fields[key]?.value;
  };
  return { node: first, value, locOf };
};

// Run a check against the frontmatter; files without one are left to require-frontmatter.
const frontmatterRule = (meta, check) => {
  return {
    meta: { type: 'problem', ...meta },
    create(context) {
      return {
        root() {
          const fields = frontmatter(context);
          if (fields) {
            check(context, fields);
          }
        },
      };
    },
  };
};

const NAME_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const MAX_NAME = 64;
const MAX_DESCRIPTION = 1024;
const TRIGGER_PATTERN = /\b(use|apply|applies)\s+(this\s+)?(when|whenever|for)\b/i;
const SECRETS = [
  { name: 'private key', pattern: /-----BEGIN [A-Z ]*PRIVATE KEY-----/g },
  { name: 'AWS access key', pattern: /\bAKIA[0-9A-Z]{16}\b/g },
  { name: 'GitHub token', pattern: /\bgh[pousr]_[A-Za-z0-9]{36,}\b/g },
  { name: 'Slack token', pattern: /\bxox[abprs]-[A-Za-z0-9-]{10,}\b/g },
  { name: 'API secret key', pattern: /\bsk-(live-|proj-|ant-)?[A-Za-z0-9_-]{32,}\b/g },
];

// name → SKILL.md paths. Read fresh on every call: the editor's ESLint server is long-lived,
// so a cache would keep reporting names that were renamed since. A few dozen small reads.
const namesInRepo = () => {
  const names = new Map();
  for (const group of readdirSync(SKILLS_DIR, { withFileTypes: true })) {
    if (!group.isDirectory()) {
      continue;
    }
    for (const skill of readdirSync(join(SKILLS_DIR, group.name), { withFileTypes: true })) {
      const file = join(SKILLS_DIR, group.name, skill.name, 'SKILL.md');
      const name = skill.isDirectory() && existsSync(file) ? readFrontmatter(readFileSync(file, 'utf8'))?.name : null;
      if (name) {
        names.set(name, [...(names.get(name) ?? []), file]);
      }
    }
  }
  return names;
};

const rules = {
  'require-frontmatter': {
    meta: { type: 'problem', docs: docs('SKILL.md starts with --- frontmatter holding name and description') },
    create(context) {
      return {
        root(node) {
          const fields = frontmatter(context);
          if (!fields) {
            context.report({ node, message: 'Missing frontmatter: start the file with ---, name, description, ---.' });
            return;
          }
          for (const key of ['name', 'description']) {
            if (!fields.value(key)) {
              context.report({ node: fields.node, message: `Frontmatter needs \`${key}\`.` });
            }
          }
        },
      };
    },
  },

  'name-format': frontmatterRule({ docs: docs('name is kebab-case, at most 64 characters') }, (context, fields) => {
    const name = fields.value('name');
    if (name && (!NAME_PATTERN.test(name) || name.length > MAX_NAME)) {
      context.report({ loc: fields.locOf('name'), message: `Name "${name}" must be kebab-case, at most ${MAX_NAME} characters.` });
    }
  }),

  'name-matches-folder': frontmatterRule({ docs: docs('name equals the skill folder name') }, (context, fields) => {
    const name = fields.value('name');
    const folder = basename(dirname(context.filename));
    if (name && name !== folder) {
      context.report({ loc: fields.locOf('name'), message: `Name "${name}" must match its folder "${folder}".` });
    }
  }),

  'unique-name': frontmatterRule({ docs: docs('no two skills share a name') }, (context, fields) => {
    const name = fields.value('name');
    const others = (namesInRepo().get(name) ?? []).filter((file) => {
      return resolve(file) !== resolve(context.filename);
    });
    if (name && others.length) {
      context.report({ loc: fields.locOf('name'), message: `Name "${name}" is already used by ${relative(ROOT, others[0])}.` });
    }
  }),

  'description-trigger': frontmatterRule({ docs: docs('description says when to use the skill') }, (context, fields) => {
    const description = fields.value('description');
    if (description && !TRIGGER_PATTERN.test(description)) {
      context.report({ loc: fields.locOf('description'), message: 'Description must say when to use the skill ("Use when …").' });
    }
  }),

  'description-max-length': frontmatterRule({ docs: docs('description is at most 1024 characters') }, (context, fields) => {
    const description = fields.value('description');
    if (description && description.length > MAX_DESCRIPTION) {
      context.report({
        loc: fields.locOf('description'),
        message: `Description is ${description.length} characters; keep it under ${MAX_DESCRIPTION}.`,
      });
    }
  }),

  'user-invocable-boolean': frontmatterRule({ docs: docs('user-invocable is true or false') }, (context, fields) => {
    const value = fields.value('user-invocable');
    if (value !== undefined && value !== 'true' && value !== 'false') {
      context.report({ loc: fields.locOf('user-invocable'), message: `user-invocable must be true or false, got "${value}".` });
    }
  }),

  'max-lines': {
    meta: {
      type: 'suggestion',
      docs: docs('SKILL.md stays short; detail goes into reference files'),
      schema: [{ type: 'object', properties: { max: { type: 'integer', minimum: 1 } }, additionalProperties: false }],
    },
    create(context) {
      const max = context.options[0]?.max ?? 100;
      return {
        root() {
          const { lines } = context.sourceCode;
          const count = lines.at(-1) === '' ? lines.length - 1 : lines.length;
          if (count > max) {
            context.report({
              loc: { start: { line: max + 1, column: 1 }, end: { line: count, column: (lines[count - 1]?.length ?? 0) + 1 } },
              message: `SKILL.md is ${count} lines; move detail into reference files (aim for under ${max}).`,
            });
          }
        },
      };
    },
  },

  'no-broken-links': {
    meta: { type: 'problem', docs: docs('relative links point at files that exist') },
    create(context) {
      const check = (node) => {
        const { url } = node;
        // URLs and in-page anchors are out of scope; `mdc:` (Cursor-only) falls through and fails.
        if (!url || url.startsWith('#') || (/^[a-z][a-z0-9+.-]*:/i.test(url) && !url.startsWith('mdc:'))) {
          return;
        }
        const path = decodeURIComponent(url.split('#')[0]);
        if (!existsSync(resolve(dirname(context.filename), path))) {
          context.report({ node, message: `Broken link: ${url}` });
        }
      };
      return { link: check, image: check, definition: check };
    },
  },

  'no-secrets': {
    meta: { type: 'problem', docs: docs('no credentials committed in skills') },
    create(context) {
      return {
        root() {
          const { text } = context.sourceCode;
          for (const { name, pattern } of SECRETS) {
            for (const match of text.matchAll(pattern)) {
              const before = text.slice(0, match.index).split('\n');
              const line = before.length;
              const column = before.at(-1).length + 1;
              context.report({
                loc: { start: { line, column }, end: { line, column: column + match[0].length } },
                message: `Possible ${name} — skills must not contain secrets.`,
              });
            }
          }
        },
      };
    },
  },
};

export default { meta: { name: 'skills' }, rules };
