import { defineCollection, z } from 'astro:content';
import { file, glob } from 'astro/loaders';

const period = /^[A-Z][a-z]{2}-\d{4}$/;
const iconName = /^[a-z0-9-]+:[a-z0-9-]+$/;

const profile = defineCollection({
  loader: file('src/content/profile.yaml'),
  schema: z.object({
    tagline: z.string().min(1),
    greeting: z.string().min(1),
    name: z.string().min(1),
    role: z.string().min(1),
    description: z.string().min(1),
    photo: z.string().min(1),
    photoAlt: z.string().min(1),
    projectsHref: z.string().default('/projects'),
    cvHref: z.string().default('/cv'),
  }),
});

const experience = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/experience' }),
  schema: z.object({
    company: z.string().min(1),
    position: z.string().min(1),
    photo: z.string().min(1),
    photoAlt: z.string().optional(),
    start: z.string().regex(period),
    end: z.union([z.string().regex(period), z.literal('Present')]),
    order: z.number().int().positive(),
  }),
});

const skills = defineCollection({
  loader: file('src/content/skills.yaml'),
  schema: z.object({
    name: z.string().min(1),
    icon: z.string().regex(iconName).optional(),
    order: z.number().optional(),
  }),
});

export const collections = { profile, experience, skills };
