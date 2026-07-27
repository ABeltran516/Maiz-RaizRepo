import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Colección de productos: cada archivo .md en src/content/products es un producto.
// El schema (Zod) valida en build-time que cada producto esté bien formado:
// si falta el precio o el tipo no coincide, el build falla y te avisa.
const products = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/products' }),
  // El helper image() valida la imagen y habilita la optimización de
  // astro:assets (WebP/AVIF, srcset responsivo). La ruta en el frontmatter
  // se resuelve relativa al archivo .md.
  schema: ({ image }) =>
    z.object({
      nombre: z.string(),
      precio: z.number().positive(),
      peso: z.string(),
      imagen: image(),
      alt: z.string().optional(),
      disponible: z.boolean().default(true),
      destacado: z.boolean().default(false),
      orden: z.number().default(0),
    }),
});

export const collections = { products };
