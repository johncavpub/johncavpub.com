# Copilot Instructions

## Commands

```sh
npm run dev       # local dev server
npm run build     # production build
npm run preview   # preview production build locally
```

There are no lint, test, or type-check scripts. Run `astro check` manually if type errors need investigation.

## Architecture

This is an **Astro 5** static site for author John Cavanagh. All page content is stored as Markdown in `src/content/` and edited via **Decap CMS** at `/admin` (GitHub-backed). The CMS schema is defined in `public/admin/config.yml` and must stay in sync with the Zod schemas in `src/content.config.ts`.

**Content collections** (`src/content.config.ts`):
- `pages` — file-based singletons (`home.md`, `about.md`); home has intro/redbubble_url/newsletter_url; about has headshot_image/socials
- `books` — one file per book; `highlight: true` controls homepage display; sorted by `publish_date` (newest first)
- `events`, `testimonials` — folder-based collections
- `contact` — file-based singleton (`contact/contact.md`); has email, intro, response_time

**Page layout flow:**
- `Layout.astro` is the single shared shell. It fetches `pages/home` (redbubble_url for nav), `pages/about` (socials for footer), and `contact/contact` (email for footer). It also fetches all books to conditionally show the "Books" nav link (only shown when `books.length >= 3`).
- Each page (`src/pages/*.astro`) fetches its own content via `getEntry` / `getCollection`, then passes data down to section components.
- Section components live in `src/components/sections/` and receive data as props — they do not fetch content themselves.
- Pages: `index.astro`, `about.astro`, `events.astro`, `contact.astro`, `thanks.astro`, `books/index.astro`, `books/[slug].astro`.

**Component split:**
- `.astro` components for layout and static sections
- `TestimonialsCarousel.vue` (Vue 3) for the interactive carousel, wrapped by `TestimonialsCarousel.astro`
- Alpine.js is loaded via a CDN `<script>` tag in `Layout.astro` (not only through the Astro integration)

## Key Conventions

**Tailwind v4** — no `tailwind.config.js`. Tailwind is imported with `@import "tailwindcss"` in `src/styles/global.css` and applied via the `@tailwindcss/vite` plugin. Custom utilities are added with `@layer utilities` in that file.

**Uploaded media** is stored via **Cloudinary**. The CMS saves only the filename (e.g. `my-photo.jpg`); use `imgUrl(src, opts)` and `imgSrcset(src, widths, opts)` from `src/lib/cloudinary.ts` to build full Cloudinary URLs with transforms. The fallback `media_folder` in config.yml is `public/uploads` but Cloudinary is the active media library.

**Book slugs** drive the URL structure: a book at `src/content/books/my-book.md` is served at `/books/my-book`.

**Adding a new collection** requires three coordinated changes:
1. Add a Zod schema + export in `src/content.config.ts`
2. Add a new folder under `src/content/<collection>/`
3. Add a matching entry in `public/admin/config.yml`

**Icon sets** available: `mdi` and `cib` (via `@iconify-json/*` devDependencies). Use through the `astro-icon` integration with `<Icon name="mdi:..." />`.
