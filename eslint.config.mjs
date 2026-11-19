// Lints skills against the review checklist in docs/contributing.md. Rules live in
// eslint-plugins/skills.mjs. Run `pnpm lint`; the editor's ESLint extension shows the
// same problems inline (see .vscode/settings.json).

import { defineConfig } from 'eslint/config';
import markdown from '@eslint/markdown';
import skills from './eslint-plugins/skills.mjs';

export default defineConfig([
  {
    files: ['skills/**/*.md'],
    plugins: { markdown, skills },
    language: 'markdown/gfm',
    languageOptions: { frontmatter: 'yaml' },
    rules: {
      'skills/no-broken-links': 'error',
      'skills/no-secrets': 'error',
    },
  },
  {
    files: ['skills/**/SKILL.md'],
    rules: {
      'skills/require-frontmatter': 'error',
      'skills/name-format': 'error',
      'skills/name-matches-folder': 'error',
      'skills/unique-name': 'error',
      'skills/description-trigger': 'error',
      'skills/description-max-length': 'error',
      'skills/user-invocable-boolean': 'error',
      'skills/max-lines': ['warn', { max: 100 }],
    },
  },
]);
