// @ts-check
import { defineConfig } from 'astro/config';
import preact from '@astrojs/preact';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  // Sitio estático por ahora (catálogo + WhatsApp, sin backend).
  // Cambiaremos a 'server'/'hybrid' el día que necesitemos pagos reales.
  output: 'static',
  // URL final del sitio (ajústala al dominio real de Vercel/Netlify).
  // Se usa para generar el sitemap y las URLs canónicas/SEO.
  site: 'https://maiz-raiz.vercel.app',
  integrations: [preact(), sitemap()],
});
