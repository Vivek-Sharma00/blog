# SoloDev Blog

> **blog.solodev.co.in** — A production-ready, full-stack blog built with Astro (SSR), Tailwind CSS v3, TypeScript, and Supabase.

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Astro 5](https://astro.build) (SSR mode, `@astrojs/node`) |
| Styling | [Tailwind CSS v3](https://tailwindcss.com) + `@tailwindcss/typography` |
| Database | [Supabase](https://supabase.com) (PostgreSQL + RLS) |
| Auth | Supabase Auth (Magic Link + Google OAuth) |
| Session | `@supabase/ssr` cookie-based sessions |
| Language | TypeScript |

## Project Structure

```
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   └── Navbar.astro          # Sticky nav with dark mode & auth state
│   ├── layouts/
│   │   └── Layout.astro          # Base HTML layout with SEO meta
│   ├── lib/
│   │   ├── supabase.ts           # Supabase client helpers (browser + SSR)
│   │   └── utils.ts              # Shared utilities (readingTime, formatDate, slugify)
│   ├── pages/
│   │   ├── index.astro           # Public post feed
│   │   ├── login.astro           # Auth page (magic link + Google)
│   │   ├── posts/[slug].astro    # Full post with comments & likes
│   │   ├── admin/new.astro       # Admin-only post creator
│   │   └── api/
│   │       ├── posts.ts          # GET /api/posts, POST /api/posts
│   │       ├── comments.ts       # GET/POST /api/comments
│   │       ├── likes.ts          # POST/DELETE /api/likes
│   │       └── auth/
│   │           ├── callback.ts   # OAuth code exchange
│   │           ├── signout.ts    # Session clear
│   │           ├── magic-link.ts # Send magic link email
│   │           └── google.ts     # Google OAuth initiation
│   └── styles/
│       └── global.css            # Tailwind + design tokens + component classes
└── supabase/
    └── migrations/
        └── 001_initial.sql       # Full schema + RLS + trigger + indexes
```

## Setup

### 1. Clone and install

```bash
git clone <your-repo>
cd blog
npm install
```

### 2. Configure Supabase

1. Create a project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and run the migration:
   ```
   supabase/migrations/001_initial.sql
   ```
3. Enable **Email (Magic Link)** under Authentication > Providers
4. (Optional) Enable **Google** OAuth under Authentication > Providers
5. Add your site URL and redirect URLs in Authentication > URL Configuration:
   - Site URL: `https://blog.solodev.co.in`
   - Redirect URL: `https://blog.solodev.co.in/api/auth/callback`

### 3. Environment variables

```bash
cp .env.example .env
```

Fill in your values:

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 4. Promote yourself to admin

After signing in, run this in the Supabase SQL Editor:

```sql
UPDATE public.profiles 
SET role = 'admin' 
WHERE email = 'your@email.com';
```

### 5. Run dev server

```bash
npm run dev
```

Visit `http://localhost:4321`

## Deployment

For production, build and serve:

```bash
npm run build
node dist/server/entry.mjs
```

Or deploy to any Node.js-compatible platform (Railway, Render, Fly.io, VPS).

## Features

- ✅ Public feed with post cards (title, summary, date, reading time)
- ✅ Full post page with Markdown rendering (GFM)
- ✅ Like toggle (authenticated users) with optimistic UI
- ✅ Comments section with live append (authenticated)
- ✅ Magic link + Google OAuth sign-in
- ✅ Server-side cookie sessions (`@supabase/ssr`)
- ✅ Conditional navbar (guest / user / admin)
- ✅ Admin post creator with Edit / Preview / Split tabs
- ✅ Auto-slug generation from title
- ✅ Dark mode (system preference + manual toggle)
- ✅ Full RLS policies on all tables
- ✅ SEO meta tags + OG tags on all pages
- ✅ Responsive design (mobile-first)
