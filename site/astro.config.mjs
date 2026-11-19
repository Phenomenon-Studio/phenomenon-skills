// @ts-check
import { readdirSync, readFileSync } from 'node:fs';
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import mermaid from 'astro-mermaid';
import { remarkDocsLinks } from './src/remarkDocsLinks.mjs';
import { claudeGrammar } from './src/claudeGrammar.mjs';

const base = '/phenomenon-skills';

// Starlight's `autogenerate` only matches entries under src/content/docs, so it finds
// nothing in our ../docs collection. Build the Skills sidebar from docs/skills/<group>/:
// one collapsible group per folder (ordered by the index page's `sidebar.order`), with the
// group overview first and one link per generated skill page (titled with the skill name).
const skillsDir = new URL('../docs/skills/', import.meta.url);
const skillGroups = readdirSync(skillsDir, { withFileTypes: true })
  .filter((entry) => {
    return entry.isDirectory();
  })
  .map(({ name }) => {
    const groupDir = new URL(`${name}/`, skillsDir);
    const index = readFileSync(new URL('index.md', groupDir), 'utf8');
    const order = index.match(/^\s+order:\s*(\d+)/m)?.[1];
    const skills = readdirSync(groupDir)
      .filter((file) => {
        return file.endsWith('.md') && file !== 'index.md';
      })
      .sort()
      .map((file) => {
        return `skills/${name}/${file.slice(0, -3)}`;
      });
    return {
      label: index.match(/^title:\s*(.+)$/m)?.[1].trim() ?? name,
      order: order ? Number(order) : Infinity,
      collapsed: true,
      items: [{ label: 'Overview', slug: `skills/${name}` }, ...skills],
    };
  })
  .sort((a, b) => {
    return a.order - b.order || a.label.localeCompare(b.label);
  })
  .map(({ order, ...group }) => {
    return group;
  });

export default defineConfig({
  site: 'https://phenomenon-studio.github.io',
  base,
  markdown: {
    remarkPlugins: [[remarkDocsLinks, { base }]],
  },
  integrations: [
    // must come before starlight so ```mermaid fences aren't treated as code
    // `base` theme + autoTheme off: colors come from theme.css (Starlight tokens), so one
    // render serves light and dark without a re-render on toggle.
    mermaid({
      theme: 'base',
      autoTheme: false,
      enableLog: false,
      mermaidConfig: {
        // `classic`: Mermaid 12's default `neo` look pads decisions with a fixed 70x32px
        look: 'classic',
        themeVariables: { fontFamily: "'Albert Sans', Arial, sans-serif", fontSize: '15px' },
        flowchart: { curve: 'linear', padding: 14, nodeSpacing: 40, rankSpacing: 48, wrappingWidth: 220 },
      },
    }),
    starlight({
      title: 'Phenomenon skills',
      logo: { src: './src/assets/mark.svg' },
      favicon: '/favicon.svg',
      customCss: ['./src/styles/theme.css'],
      expressiveCode: {
        // first dark, then light: Starlight swaps them with the site theme toggle
        themes: ['github-dark', 'github-light'],
        styleOverrides: { borderRadius: '8px' },
        shiki: { langs: [claudeGrammar] },
      },
      head: [
        { tag: 'link', attrs: { rel: 'preconnect', href: 'https://fonts.googleapis.com' } },
        { tag: 'link', attrs: { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: true } },
        {
          tag: 'link',
          attrs: {
            rel: 'stylesheet',
            href: 'https://fonts.googleapis.com/css2?family=Albert+Sans:wght@400..700&family=Bricolage+Grotesque:opsz,wght@12..96,400..700&display=swap',
          },
        },
        // Re-renders diagrams measured before the brand fonts loaded (see the file).
        { tag: 'script', attrs: { src: `${base}/mermaid-fonts.js`, type: 'module' } },
      ],
      social: [
        { icon: 'github', label: 'GitHub', href: 'https://github.com/Phenomenon-Studio/phenomenon-skills' },
      ],
      editLink: {
        baseUrl: 'https://github.com/Phenomenon-Studio/phenomenon-skills/edit/main/docs/',
      },
      sidebar: [
        { label: 'Guides', items: ['getting-started', 'workflow', 'authoring'] },
        { label: 'Skills', items: skillGroups },
      ],
    }),
  ],
});
