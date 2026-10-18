---
title: "Building a Static Blog with Astro and Tailwind CSS"
description: "A practical walkthrough of setting up a fast, minimalist blog using Astro's static output mode and Tailwind CSS for styling."
pubDate: 2026-10-15
image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80"
tags: ["astro", "tailwind", "jamstack"]
---

Welcome to my blog! This first post walks through the key ideas behind building a **zero-server static blog** using [Astro](https://astro.build) and Tailwind CSS. No database, no backend — just pure static HTML served directly from a CDN.

## Why Astro?

Astro ships **zero JavaScript by default**. Every page is pre-rendered at build time into a plain `.html` file that can live anywhere — Netlify, Vercel, GitHub Pages, or a simple S3 bucket.

Key advantages at a glance:

- **Island Architecture** — interactive components only hydrate when needed
- **Content Collections** — type-safe frontmatter with Zod schema validation
- **Built-in Markdown** — Shiki syntax highlighting out of the box
- **Zero-config SSG** — just set `output: 'static'` and you're done

## Project Structure

A typical Astro blog looks like this:

```
src/
├── components/      # Reusable .astro components
├── content/
│   └── blog/        # Your .md / .mdx posts live here
├── layouts/         # Page shell templates
├── pages/
│   ├── index.astro  # Homepage — lists all posts
│   └── posts/
│       └── [slug].astro  # Dynamic route per post
└── styles/
    └── global.css
```

## Setting Up Tailwind Typography

Install the official plugin:

```bash
npm install @tailwindcss/typography
```

Then wire it up in `tailwind.config.mjs`:

```js
export default {
  content: ['./src/**/*.{astro,html,js,ts,md}'],
  darkMode: 'class',
  plugins: [require('@tailwindcss/typography')],
};
```

Apply the `prose` class to your article wrapper:

```astro
<article class="prose prose-neutral dark:prose-invert max-w-none">
  <Content />
</article>
```

## Dark Mode Without Flash

The trick to a flicker-free dark mode toggle is a tiny inline script in `<head>` that runs *before* the browser paints:

```html
<script is:inline>
  const stored = localStorage.getItem('theme');
  if (stored === 'dark') {
    document.documentElement.classList.add('dark');
  }
</script>
```

Because it's inline and synchronous, the correct class is applied before any CSS renders. Simple, effective, and dependency-free.

## What's Next?

In upcoming posts, I'll cover:

1. **RSS feed generation** with `@astrojs/rss`
2. **Open Graph images** using Satori
3. **Reading time estimation** with a tiny utility function

Stay tuned — and happy coding! 🚀
