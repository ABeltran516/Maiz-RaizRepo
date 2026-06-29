import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Colección de productos: cada archivo .md en src/content/products es un producto.
// El schema (Zod) valida en build-time que cada producto esté bien formado:
// si falta el precio o el tipo no coincide, el build falla y te avisa.
const products = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/products' }),
  schema: z.object({
    nombre: z.string(),
    precio: z.number().positive(),
    peso: z.string(),
    imagen: z.string(),
    alt: z.string().optional(),
    disponible: z.boolean().default(true),
    destacado: z.boolean().default(false),
    orden: z.number().default(0),
  }),
});

export const collections = { products };
