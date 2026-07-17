// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

import icon from 'astro-icon';

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [tailwindcss()]
  },

  integrations: [
    icon({
      include: {
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
          'mail-outline-rounded',
          'monitoring-rounded',
          'check-rounded',
          'open-in-new-rounded',
          'person-outline-rounded',
          'security-rounded',
          'sync-alt-rounded'
        ],
        'simple-icons': [
          'github',
          'linkedin'
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
          'vue'
        ]
      }
    })
  ]
});