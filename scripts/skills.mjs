// Shared by build-docs.mjs and eslint-plugins/skills.mjs: finds skills/<group>/<skill>/SKILL.md
// and reads their frontmatter.

import { readdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

export const ROOT = fileURLToPath(new URL('..', import.meta.url));
export const SKILLS_DIR = join(ROOT, 'skills');

// Flat `key: value` lines between the --- fences: { key: { value, line } }, line 0-based
// within the block. Skills only use scalar fields, so no YAML parser is needed.
export const parseFields = (block) => {
  const fields = {};
  block.split('\n').forEach((text, line) => {
    const pair = text.match(/^([\w-]+):\s*(.*)$/);
    if (pair) {
      fields[pair[1]] = { value: pair[2].replace(/^(["'])(.*)\1$/, '$2'), line };
    }
  });
  return fields;
};

// Frontmatter as { key: value }; null when the file has none.
export const readFrontmatter = (source) => {
  const match = source.match(/^---\n([\s\S]*?)\n---/);
  if (!match) {
    return null;
  }
  return Object.fromEntries(
    Object.entries(parseFields(match[1])).map(([key, { value }]) => {
      return [key, value];
    }),
  );
};

export const listDirs = async (dir) => {
  const entries = await readdir(dir, { withFileTypes: true });
  return entries
    .filter((entry) => {
      return entry.isDirectory();
    })
    .map((entry) => {
      return entry.name;
    })
    .sort();
};

// Every skill folder, grouped: [{ group, skills: [{ dir, path, file }] }].
// `file` is the SKILL.md path, or null when the folder has none.
export const listSkillDirs = async () => {
  const groups = [];
  for (const group of await listDirs(SKILLS_DIR)) {
    const skills = [];
    for (const dir of await listDirs(join(SKILLS_DIR, group))) {
      const file = join(SKILLS_DIR, group, dir, 'SKILL.md');
      skills.push({ dir, path: `skills/${group}/${dir}`, file: existsSync(file) ? file : null });
    }
    groups.push({ group, skills });
  }
  return groups;
};
