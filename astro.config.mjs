// @ts-check
import { defineConfig } from 'astro/config';
import preact from '@astrojs/preact';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  // Sitio estático por ahora (catálogo + WhatsApp, sin backend).
  // Cambiaremos a 'server'/'hybrid' el día que necesitemos pagos reales.
  output: 'static',
  // Dominio propio de producción. Se usa para el sitemap y las URLs
  // canónicas/SEO/Open Graph/JSON-LD.
  site: 'https://www.maizyraiz.com',
  integrations: [preact(), sitemap()],
});
