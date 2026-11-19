// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import mermaid from 'astro-mermaid';
import { unified } from '@astrojs/markdown-remark';
import { remarkDocsLinks } from './src/remarkDocsLinks.mjs';

const base = '/phenomenon-skills';

export default defineConfig({
  site: 'https://phenomenon-studio.github.io',
  base,
  markdown: {
    processor: unified({ remarkPlugins: [[remarkDocsLinks, { base }]] }),
  },
  integrations: [
    // must come before starlight so ```mermaid fences aren't treated as code
    mermaid({ theme: 'default', autoTheme: true }),
    starlight({
      title: 'Phenomenon skills',
      social: [
        { icon: 'github', label: 'GitHub', href: 'https://github.com/Phenomenon-Studio/phenomenon-skills' },
      ],
      editLink: {
        baseUrl: 'https://github.com/Phenomenon-Studio/phenomenon-skills/edit/main/docs/',
      },
      sidebar: [
        { label: 'Guides', items: ['getting-started', 'workflow', 'authoring'] },
        { label: 'Skills', items: [{ autogenerate: { directory: 'skills' } }] },
      ],
    }),
  ],
});
