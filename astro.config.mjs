// @ts-check
import {defineConfig} from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import icon from 'astro-icon';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  // TODO: replace with the real personal GitHub Pages URL before production deploy.
  site: 'https://yourdomain.com',
  base: '/',
  prefetch: {
    defaultStrategy: 'hover',
    prefetchAll: true,
  },
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
      ],
      'material-symbols': [
        'dark-mode-outline-rounded',
        'description-outline-rounded',
        'folder-outline-rounded',
        'grid-view-outline-rounded',
        'home-outline-rounded',
        'light-mode-outline-rounded',
        'check-rounded',
        'code-rounded',
        'open-in-new-rounded',
        'public',
        'person-outline-rounded',
        'print-outline-rounded',
        'send-rounded',
        'mail',
        'call'
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
        'github-icon',
        'python',
        'gopher',
        'flask',
        'gin',
        'serverless',
        'ionic-icon',
        'html-5',
        'bootstrap',
        'tailwindcss-icon',
        'microsoft-icon',
        'postgresql',
        'mongodb-icon',
        'mysql-icon',
        'hibernate',
        'teamcity',
        'jest',
        'linux-tux',
        'git-icon',
        'new-relic-icon',
        'google-analytics',
        'tealium',
      ]
    }
  }),
    sitemap()]
});
