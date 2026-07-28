// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

import icon from 'astro-icon';

import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  // TODO: replace with the real personal GitHub Pages URL before production deploy.
  site: 'https://yourdomain.com',
  base: '/',

  devToolbar: {
    enabled: false,
  },

  vite: {
    plugins: [tailwindcss()]
  },

  integrations: [icon({
    include: {
      'simple-icons': [
        'linkedin',
        'github',
        'gmail'
      ],
      'material-symbols': [
        'account-tree-outline-rounded',
        'crisis-alert-rounded',
        'dark-mode-outline-rounded',
        'description-outline-rounded',
        'fact-check-outline-rounded',
        'folder-outline-rounded',
        'grid-view-outline-rounded',
        'home-outline-rounded',
        'light-mode-outline-rounded',
        'monitoring-rounded',
        'check-rounded',
        'code-rounded',
        'open-in-new-rounded',
        'public',
        'person-outline-rounded',
        'security-rounded',
        'sync-alt-rounded',
        'print-outline-rounded',
        'send-rounded'
      ],
      'logos': [
        'angular-icon',
        'aws',
        'docker-icon',
        'github-actions',
        'java',
        'javascript',
        'microsoft-azure',
        'nodejs-icon',
        'react',
        'spring-icon',
        'typescript-icon',
        'vue',
        'google-gmail',
        'linkedin-icon',
        'github-icon'
      ]
    }
  }),
  sitemap()]
});
