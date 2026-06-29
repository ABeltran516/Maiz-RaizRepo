# Maíz & Raíz

Ecommerce de botanas saludables (catálogo + pedido por WhatsApp), construido con
[Astro](https://astro.build).

🔗 Sitio: https://abeltran516.github.io/Maiz-RaizRepo/

## Stack

- **Astro** (modo estático) — contenido rapidísimo con cero JS por defecto.
- **Preact** — islas interactivas (el carrito).
- **nanostores** — estado del carrito compartido entre islas + `localStorage`.
- **Content Collections** — cada producto es un archivo Markdown validado con Zod.

## Comandos

| Comando             | Acción                                          |
| ------------------- | ----------------------------------------------- |
| `npm install`       | Instala dependencias                            |
| `npm run dev`       | Servidor de desarrollo en `localhost:4321`      |
| `npm run build`     | Genera el sitio estático en `dist/`             |
| `npm run preview`   | Previsualiza el build localmente                |

## Estructura

```
src/
├── components/      # Navbar, Hero, ProductCard, ProcessStep, Footer, islas del carrito
├── content/
│   └── products/    # Un .md por producto (datos del catálogo)
├── layouts/         # Layout.astro (SEO centralizado)
├── pages/
│   ├── index.astro
│   └── productos/   # Listado + página por producto (rutas dinámicas)
├── stores/          # Estado del carrito (nanostores)
└── styles/          # global.css
```

## Agregar un producto

Crea un archivo en `src/content/products/`, por ejemplo `chips-camote.md`:

```markdown
---
nombre: "Chips de Camote"
precio: 58
peso: "100g"
imagen: "/Assets/IMG/camote.jpg"
disponible: true
destacado: true
orden: 5
---

Descripción del producto.
```

## Configuración

- Número de WhatsApp del negocio: `src/config.ts` (`WHATSAPP_NUMBER`).
- URL del sitio (para SEO/sitemap): `astro.config.mjs` (`site`).
