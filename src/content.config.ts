import { defineCollection, z } from 'astro:content';
import { file } from 'astro/loaders';

const period = /^[A-Z][a-z]{2}-\d{4}$/;
const year = /^\d{4}$/;
const iconName = /^[a-z0-9-]+:[a-z0-9-]+$/;
const pageFlag = z.enum(['home', 'about', 'cv']);
const contactChannel = z.enum(['email', 'linkedin', 'github']);

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
    contacts: z.array(z.object({
      channel: contactChannel,
      label: z.string().min(1),
      href: z.string().min(1),
      icon: z.string().regex(iconName),
    })).min(1),
    highlights: z.array(z.string().min(1)).min(1),
  }),
});

const experience = defineCollection({
  loader: file('src/content/experience.yaml'),
  schema: z.object({
    id: z.string().min(1),
    company: z.string().min(1),
    position: z.string().min(1),
    photo: z.string().min(1),
    photoAlt: z.string().optional(),
    start: z.string().regex(period),
    end: z.union([z.string().regex(period), z.literal('Present')]),
    summary: z.string().min(1),
  }),
});

const skills = defineCollection({
  loader: file('src/content/skills.yaml'),
  schema: z.object({
    id: z.string().min(1),
    name: z.string().min(1),
    pages: z.array(pageFlag).min(1),
    skills: z.array(z.object({
      name: z.string().min(1),
      icon: z.string().regex(iconName).optional(),
    })).min(1),
  }),
});

const education = defineCollection({
  loader: file('src/content/education.yaml'),
  schema: z.object({
    id: z.string().min(1),
    photo: z.string().min(1),
    photoAlt: z.string().optional(),
    school: z.string().min(1),
    course: z.string().min(1),
    start: z.string().regex(year),
    end: z.union([z.string().regex(year), z.literal('Present')]),
  }),
});

const achievements = defineCollection({
  loader: file('src/content/achievements.yaml'),
  schema: z.object({
    id: z.string().min(1),
    title: z.string().min(1),
    issuer: z.string().optional(),
    date: z.string().optional(),
    link: z.string().url().optional(),
  }),
});

export const collections = { profile, experience, skills, education, achievements };
