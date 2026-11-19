#!/usr/bin/env node
// Regenerates, from each skills/<group>/<skill>/SKILL.md frontmatter:
// - docs/skills/<group>/index.md: the generated block (hand-written intro stays);
// - docs/skills/<group>/<skill>.md: frontmatter + generated block, created when missing
//   (hand-written notes after the block stay);
// - the catalog in README.md;
// - the skills array of the Claude Code plugin in .claude-plugin/marketplace.json.
// Usage: node scripts/build-docs.mjs [--check]
//   --check  exit 1 if any generated section is out of date (for CI).

import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
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
      const fields = parseFrontmatter(await readFile(file, 'utf8'), relative(ROOT, file));
      skills.push({
        name: fields.name,
        description: fields.description,
        userInvocable: fields['user-invocable'] !== 'false',
        path: `skills/${group}/${dir}`,
      });
    }
    groups.push({ group, skills });
  }
  return groups;
};

const installCommand = (names) => {
  return ['```bash', `npx skills@latest add ${REPO} --skill ${names.join(' ')}`, '```'].join('\n');
};

// Descriptions are plain text; keep `<placeholder>` from turning into HTML.
const escapeMarkdown = (text) => {
  return text.replace(/</g, '&lt;');
};

const renderGroup = ({ skills }) => {
  const all = skills.map((skill) => {
    return skill.name;
  });
  const lines = ['## Skills', ''];
  for (const skill of skills) {
    lines.push(`- [\`${skill.name}\`](./${skill.name}.md) — ${escapeMarkdown(skill.description)}`);
  }
  lines.push('', 'Install the whole group:', '', installCommand(all));
  return lines.join('\n');
};

const renderSkill = (skill, groupTitle) => {
  const invocation = skill.userInvocable
    ? `**User-invoked** — type \`/${skill.name}\`, or the agent loads it when the task matches the description.`
    : '**Model-invoked** — the agent loads it on its own when the task matches; hidden from the `/` menu.';
  return [
    escapeMarkdown(skill.description),
    '',
    invocation,
    '',
    installCommand([skill.name]),
    '',
    `Part of [${groupTitle}](./index.md) · [Source](https://github.com/${REPO}/tree/main/${skill.path})`,
  ].join('\n');
};

// Skill pages: the generator owns everything up to END; notes after it are hand-written.
const withSkillPage = (skill, groupTitle) => {
  return (source) => {
    const end = source.indexOf(END);
    const tail = end === -1 ? '\n' : source.slice(end + END.length);
    const frontmatter = ['---', `title: ${skill.name}`, `description: ${JSON.stringify(skill.description)}`, '---'];
    return `${frontmatter.join('\n')}\n\n${START}\n${renderSkill(skill, groupTitle)}\n${END}${tail}`;
  };
};

const renderCatalog = (groups) => {
  const rows = groups.map(({ group, skills }) => {
    const names = skills
      .map((skill) => {
        return `\`${skill.name}\``;
      })
      .join(', ');
    return `| [${group}](docs/skills/${group}/index.md) | ${names} |`;
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
// Files listed in `creatable` may be missing; they are created from transform('').
const sync = async (file, transform, { creatable = false } = {}) => {
  const name = relative(ROOT, file);
  if (!existsSync(file) && !creatable) {
    throw new Error(`${name}: missing — group pages need ${START} / ${END} markers`);
  }
  const current = existsSync(file) ? await readFile(file, 'utf8') : '';
  const next = transform(current, name);
  if (current === next) {
    return false;
  }
  if (check) {
    console.error(`out of date: ${name}`);
  } else {
    await mkdir(dirname(file), { recursive: true });
    await writeFile(file, next);
    console.log(`updated: ${name}`);
  }
  return true;
};

const groupTitle = (source, name) => {
  const title = source.match(/^title:\s*(.+)$/m)?.[1];
  if (!title) {
    throw new Error(`${name}: frontmatter needs a title`);
  }
  return title.trim();
};

const groups = await loadGroups();
let stale = false;
const withBlock = (body) => {
  return (source, name) => {
    return replaceBlock(source, body, name);
  };
};
for (const group of groups) {
  const groupDir = join(DOCS_DIR, group.group);
  const indexFile = join(groupDir, 'index.md');
  stale = (await sync(indexFile, withBlock(renderGroup(group)))) || stale;
  const title = groupTitle(await readFile(indexFile, 'utf8'), relative(ROOT, indexFile));
  const pages = new Set(['index.md']);
  for (const skill of group.skills) {
    pages.add(`${skill.name}.md`);
    stale = (await sync(join(groupDir, `${skill.name}.md`), withSkillPage(skill, title), { creatable: true })) || stale;
  }
  // A page whose skill is gone would keep publishing it.
  for (const file of await readdir(groupDir)) {
    if (file.endsWith('.md') && !pages.has(file)) {
      console.error(`orphan page: ${relative(ROOT, join(groupDir, file))} — its skill no longer exists; delete it`);
      stale = true;
      process.exitCode = 1;
    }
  }
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
