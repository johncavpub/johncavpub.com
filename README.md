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
│   ├── content/             # YAML files (site.yml, events.yml, testimonials.yml) + books/ folder
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

| Collection | Type | Source | Key fields |
|---|---|---|---|
| `site` | file singleton | `src/content/site.yml` | author_name, site_tagline, author_headshot_image, author_bio, social_links, redbubble_url, newsletter_url, contact_email, contact_page_intro, contact_page_body, contact_response_time |
| `books` | folder (Markdown) | `src/content/books/` | title, description, cover_image, publish_date, highlight, draft, amazon_url, barnes_noble_url |
| `events` | file (YAML array) | `src/content/events.yml` | title, date, location, address, time, url, description |
| `testimonials` | file (YAML array) | `src/content/testimonials.yml` | quote, author, role, source |

- `books.highlight: true` controls homepage display; `books.draft: true` hides from all pages; sorted by `publish_date` (newest first)
- The "Books" nav link is only shown when there are 3 or more non-draft books
- `site` is the single source of truth for all global author/site metadata and contact info — fetched by `Layout.astro` and individual pages

## Decap CMS & Media

CMS is at `/admin` (GitHub-backed). Images are stored via **Cloudinary** — the CMS saves only the filename; `imgUrl()` and `imgSrcset()` in `src/lib/cloudinary.ts` construct full Cloudinary URLs at build time.

## Testimonials Carousel

`TestimonialsCarousel.vue` is a Vue 3 component (using Swiper) wrapped by `TestimonialsCarousel.astro`. It's the only interactive component in the project — everything else is plain Astro.
