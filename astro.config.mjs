// @ts-check
import { defineConfig } from 'astro/config';
import preact from '@astrojs/preact';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  // Sitio estático por ahora (catálogo + WhatsApp, sin backend).
  // Cambiaremos a 'server'/'hybrid' el día que necesitemos pagos reales.
  output: 'static',
  // URL de producción en Vercel. Se usa para el sitemap y las URLs
  // canónicas/SEO. Si algún día conectas un dominio propio, cámbiala aquí.
  site: 'https://maiz-raiz-repo.vercel.app',
  integrations: [preact(), sitemap()],
});
