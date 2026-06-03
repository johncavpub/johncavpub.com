# John Cavanagh

[![Netlify Status](https://api.netlify.com/api/v1/badges/597a8227-e68a-4f58-b7b0-373013954586/deploy-status)](https://app.netlify.com/projects/silver-yeot-02170d/deploys)

Minimal, content-driven Astro site with a Home page, About page, and Decap CMS editing.

## Project Structure

```text
/
├── public/
│   ├── admin/
│   │   ├── config.yml
│   │   └── index.html
│   └── images/
│       └── featured-book.svg
├── src/
│   ├── content/
│   │   ├── books/
│   │   │   └── featured-book.md
│   │   └── pages/
│   │       ├── about.md
│   │       └── home.md
│   ├── layouts/
│   │   └── Layout.astro
│   ├── pages/
│   │   ├── about.astro
│   │   └── index.astro
│   └── content.config.ts
└── package.json
```

## Content Collections

- `src/content/pages/home.md`: Home configuration (title, intro, Redbubble URL, optional next event fields).
- `src/content/pages/about.md`: About page content in Markdown.
- `src/content/books/*.md`: Book entries with cover image, description, and buy links.

## Decap CMS

Decap CMS is available at `/admin` and is configured to edit the Home, About, and Books collections.

## Commands

```sh
npm install
npm run dev
npm run build
```
