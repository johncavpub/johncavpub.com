# John Cavanagh

[![Netlify Status](https://api.netlify.com/api/v1/badges/597a8227-e68a-4f58-b7b0-373013954586/deploy-status)](https://app.netlify.com/projects/silver-yeot-02170d/deploys)

Astro 5 static site for author John Cavanagh — content-driven with Decap CMS, Tailwind v4, and Alpine.js. Deployed on Netlify.

## Commands

```sh
npm run dev       # local dev server
npm run build     # production build
npm run preview   # preview production build locally
```

## Project Structure

```text
/
├── public/
│   └── admin/               # Decap CMS (config.yml + index.html)
├── src/
│   ├── components/
│   │   ├── sections/        # page-section components (receive data as props)
│   │   ├── Nav.astro
│   │   ├── SubscribeForm.astro
│   │   ├── FooterMeta.astro
│   │   └── TestimonialsCarousel.vue
│   ├── content/             # Markdown content (books, events, pages, testimonials, contact)
│   ├── layouts/
│   │   └── Layout.astro
│   ├── lib/
│   │   └── cloudinary.ts
│   ├── pages/               # index, about, events, contact, thanks, books/[slug]
│   ├── styles/
│   │   └── global.css
│   └── content.config.ts
├── astro.config.mjs
└── netlify.toml
```

## Content Collections

Schemas live in `src/content.config.ts` and must stay in sync with `public/admin/config.yml`.

| Collection | Type | Key fields |
|---|---|---|
| `pages` | file (home.md, about.md) | title, intro, redbubble_url, newsletter_url, headshot_image, socials |
| `books` | folder | title, cover_image, publish_date, highlight, amazon_url, barnes_noble_url |
| `events` | folder | title, date, location, address, time, url |
| `testimonials` | folder | quote, author, role, source |
| `contact` | file (contact.md) | title, intro, email, response_time |

- `books.highlight: true` controls homepage display; sorted by `publish_date` (newest first)
- The "Books" nav link is only shown when there are 3 or more books

## Decap CMS & Media

CMS is at `/admin` (GitHub-backed). Images are stored via **Cloudinary** — the CMS saves only the filename; `imgUrl()` and `imgSrcset()` in `src/lib/cloudinary.ts` construct full Cloudinary URLs at build time.

## Testimonials Carousel

`TestimonialsCarousel.vue` is a Vue 3 component (using Swiper) wrapped by `TestimonialsCarousel.astro`. It's the only interactive component in the project — everything else is plain Astro.
