# Copilot Instructions

## Commands

```sh
npm run dev       # local dev server
npm run build     # production build
npm run preview   # preview production build locally
```

There are no lint, test, or type-check scripts. Run `astro check` manually if type errors need investigation.

## Taking screenshots

To visually verify a change, run the dev server in the background and screenshot a page with headless Chrome (no extra dependencies — uses the installed Google Chrome app):

```sh
npm run dev > /tmp/astro-dev.log 2>&1 &   # start dev server; note the port it prints
# Astro uses 4321 by default, but falls back to 4322+ if that port is taken — check the log.

"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  --headless --disable-gpu --no-sandbox --hide-scrollbars \
  --window-size=1200,1400 \
  --screenshot=/tmp/events.png \
  "http://localhost:4321/events"
```

Then open the PNG (e.g. `/tmp/events.png`) to inspect the result. Use a narrower `--window-size` (e.g. `--window-size=600,900`) to check the mobile layout.

Notes:
- Confirm the port from the dev-server log before screenshotting — it shifts to 4322+ when 4321 is in use.
- `/books` redirects to `/` when there are fewer than 3 non-draft books, so a screenshot of `/books` may show the home page.
- Right after editing a content file (`src/content/*.yml`), Astro re-syncs and a screenshot can briefly hit a transient `UnknownFilesystemError`/`writeToDisk` error page — just re-run the screenshot once the sync settles.

## Architecture

This is an **Astro 5** static site for author John Cavanagh. Content is stored in `src/content/` (YAML files and Markdown) and edited via **Decap CMS** at `/admin` (GitHub-backed). The CMS schema is defined in `public/admin/config.yml` and must stay in sync with the Zod schemas in `src/content.config.ts`.

**Content collections** (`src/content.config.ts`):
- `site` — file-based singleton (`src/content/site.yml`); single source of truth for author name, tagline, headshot, bio, social links, shop/newsletter URLs, and contact fields
- `books` — folder-based (`src/content/books/`), one Markdown file per book; `highlight: true` controls homepage display; `draft: true` hides from all pages; sorted by `publish_date` (newest first)
- `events` — file-based (`src/content/events.yml`), YAML array; fields: title, date, location, address, time, url, description
- `testimonials` — file-based (`src/content/testimonials.yml`), YAML array; fields: quote, author, role, source

**Page layout flow:**
- `Layout.astro` is the single shared shell. It fetches `getEntry("site", "site")` for the shop URL (redbubble_url), social links, and contact email, and fetches all non-draft books to conditionally show the "Books" nav link (only shown when `books.length >= 3`).
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

**Adding a new collection** requires coordinated changes depending on type:
- **YAML array** (like events/testimonials): add a `file()` loader + Zod array schema in `src/content.config.ts`, create `src/content/<name>.yml`, and add a matching entry in `public/admin/config.yml`
- **Folder of Markdown files** (like books): add a `type: 'content'` collection + Zod schema in `src/content.config.ts`, create `src/content/<name>/`, and add a matching entry in `public/admin/config.yml`

**Icon sets** available: `mdi` and `cib` (via `@iconify-json/*` devDependencies). Use through the `astro-icon` integration with `<Icon name="mdi:..." />`.
