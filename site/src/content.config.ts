import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { docsSchema } from '@astrojs/starlight/schema';

// Pages live in the repo-level docs/ folder so they also read well on GitHub.
export const collections = {
  docs: defineCollection({
    loader: glob({ pattern: '**/*.md', base: '../docs' }),
    schema: docsSchema(),
  }),
};
