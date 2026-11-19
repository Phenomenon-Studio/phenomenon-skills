#!/usr/bin/env node
// Regenerates, from each skills/<group>/<skill>/SKILL.md frontmatter:
// the skill lists in docs/skills/<group>.md, the catalog in README.md, and the
// skills array of the Claude Code plugin in .claude-plugin/marketplace.json.
// Usage: node scripts/build-docs.mjs [--check]
//   --check  exit 1 if any generated section is out of date (for CI).

import { readdir, readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const REPO = 'Phenomenon-Studio/phenomenon-skills';
const ROOT = fileURLToPath(new URL('..', import.meta.url));
const SKILLS_DIR = join(ROOT, 'skills');
const DOCS_DIR = join(ROOT, 'docs', 'skills');
const MARKETPLACE = join(ROOT, '.claude-plugin', 'marketplace.json');
const PLUGIN = 'phenomenon';
const START = '<!-- skills:start -->';
const END = '<!-- skills:end -->';

const check = process.argv.includes('--check');

const parseFrontmatter = (source, file) => {
  const match = source.match(/^---\n([\s\S]*?)\n---/);
  if (!match) {
    throw new Error(`${file}: missing frontmatter`);
  }
  const fields = {};
  for (const line of match[1].split('\n')) {
    const pair = line.match(/^([\w-]+):\s*(.*)$/);
    if (pair) {
      fields[pair[1]] = pair[2].replace(/^(["'])(.*)\1$/, '$2');
    }
  }
  if (!fields.name || !fields.description) {
    throw new Error(`${file}: frontmatter needs name and description`);
  }
  return fields;
};

const listDirs = async (dir) => {
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

const loadGroups = async () => {
  const groups = [];
  for (const group of await listDirs(SKILLS_DIR)) {
    const skills = [];
    for (const dir of await listDirs(join(SKILLS_DIR, group))) {
      const file = join(SKILLS_DIR, group, dir, 'SKILL.md');
      if (!existsSync(file)) {
        continue;
      }
      const { name, description } = parseFrontmatter(await readFile(file, 'utf8'), relative(ROOT, file));
      skills.push({ name, description, path: `skills/${group}/${dir}` });
    }
    groups.push({ group, skills });
  }
  return groups;
};

const installCommand = (names) => {
  return ['```bash', `npx skills@latest add ${REPO} --skill ${names.join(' ')}`, '```'].join('\n');
};

const renderGroup = ({ skills }) => {
  const all = skills.map((skill) => {
    return skill.name;
  });
  const lines = ['Install the whole group:', '', installCommand(all), ''];
  for (const skill of skills) {
    lines.push(
      `### \`${skill.name}\``,
      '',
      skill.description,
      '',
      installCommand([skill.name]),
      '',
      `[Source](https://github.com/${REPO}/tree/main/${skill.path})`,
      '',
    );
  }
  return lines.join('\n').trimEnd();
};

const renderCatalog = (groups) => {
  const rows = groups.map(({ group, skills }) => {
    const names = skills
      .map((skill) => {
        return `\`${skill.name}\``;
      })
      .join(', ');
    return `| [${group}](docs/skills/${group}.md) | ${names} |`;
  });
  return ['| Group | Skills |', '| --- | --- |', ...rows].join('\n');
};

const replaceBlock = (source, body, file) => {
  const start = source.indexOf(START);
  const end = source.indexOf(END);
  if (start === -1 || end === -1 || end < start) {
    throw new Error(`${file}: missing ${START} / ${END} markers`);
  }
  return `${source.slice(0, start + START.length)}\n${body}\n${source.slice(end)}`;
};

const updatePluginSkills = (source, groups, file) => {
  const marketplace = JSON.parse(source);
  const plugin = marketplace.plugins?.find((entry) => {
    return entry.name === PLUGIN;
  });
  if (!plugin) {
    throw new Error(`${file}: plugin "${PLUGIN}" not found`);
  }
  plugin.skills = groups.flatMap(({ skills }) => {
    return skills.map((skill) => {
      return `./${skill.path}`;
    });
  });
  return `${JSON.stringify(marketplace, null, 2)}\n`;
};

// transform(current, name) returns the file's expected content.
const sync = async (file, transform) => {
  const name = relative(ROOT, file);
  if (!existsSync(file)) {
    throw new Error(`${name}: missing — group pages need ${START} / ${END} markers`);
  }
  const current = await readFile(file, 'utf8');
  const next = transform(current, name);
  if (current === next) {
    return false;
  }
  if (check) {
    console.error(`out of date: ${name}`);
  } else {
    await writeFile(file, next);
    console.log(`updated: ${name}`);
  }
  return true;
};

const groups = await loadGroups();
let stale = false;
const withBlock = (body) => {
  return (source, name) => {
    return replaceBlock(source, body, name);
  };
};
for (const group of groups) {
  stale = (await sync(join(DOCS_DIR, `${group.group}.md`), withBlock(renderGroup(group)))) || stale;
}
stale = (await sync(join(ROOT, 'README.md'), withBlock(renderCatalog(groups)))) || stale;
stale =
  (await sync(MARKETPLACE, (source, name) => {
    return updatePluginSkills(source, groups, name);
  })) || stale;

if (check && stale) {
  console.error('Run `node scripts/build-docs.mjs` and commit the result.');
  process.exit(1);
}
