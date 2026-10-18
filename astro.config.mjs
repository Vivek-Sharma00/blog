import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

// https://astro.build/config
export default defineConfig({
  site: 'https://blog.solodev.co.in',
  output: 'static',
  devToolbar: { enabled: false },
  integrations: [
    tailwind({
      applyBaseStyles: false,
    }),
  ],
});
