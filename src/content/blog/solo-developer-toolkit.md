---
title: "The Solo Developer's Toolkit: 10 Tools I Use Every Day"
description: "My curated list of command-line utilities, editor extensions, and cloud services that keep a one-person engineering shop running smoothly."
pubDate: 2026-10-18
image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&auto=format&fit=crop&q=80"
tags: ["productivity", "tools", "devops"]
---

Running a product solo means wearing every hat: frontend, backend, DevOps, customer support, and marketing. The right toolset is the difference between shipping and drowning. Here's mine.

## The Editor: VS Code

No surprises here. What *does* matter is the extension list:

| Extension | Purpose |
|---|---|
| **Astro** | Syntax highlighting + IntelliSense for `.astro` files |
| **Tailwind CSS IntelliSense** | Autocomplete for utility classes |
| **Error Lens** | Inline error display — no more hunting the Problems panel |
| **GitLens** | Supercharged git blame and history |
| **Prettier** | Consistent formatting on save |

## The Terminal: a Lean Stack

```bash
# Install modern CLI replacements
npm install -g degit   # project scaffolding without git history
brew install ripgrep   # blazing-fast grep (rg)
brew install fd        # faster find replacement
brew install bat       # cat with syntax highlighting
```

### My `.zshrc` Aliases

```bash
alias dev="npm run dev"
alias build="npm run build && echo '✅ Build complete'"
alias gs="git status"
alias gc="git commit -m"
alias gp="git push"
alias ll="ls -lAh --color=auto"
```

## Deployment: Netlify for Everything Static

For a blog like this one, Netlify is unbeatable:

1. Connect your GitHub repo
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Push — done. Automatic deploys on every commit.

The free tier covers everything a solo dev needs: 100 GB bandwidth/month, custom domains, automatic HTTPS, and branch previews.

## Monitoring on a Shoestring

You don't need Datadog when you're solo. Here's my lightweight stack:

- **UptimeRobot** (free tier) — 5-minute uptime checks with SMS alerts
- **Plausible** or **Umami** — privacy-friendly analytics, self-hostable
- **Sentry** (free tier) — exception tracking with source maps

## Images: Optimize Before You Ship

Never commit unoptimized images. My pre-commit workflow:

```bash
# Install squoosh CLI
npm install -g @squoosh/cli

# Optimize a JPEG to WebP
squoosh-cli --webp '{"quality":80}' ./public/images/hero.jpg
```

## Version Control Hygiene

### Commit Message Format

```
feat: add dark mode toggle
fix: resolve hydration mismatch on nav
docs: update README with build instructions
chore: upgrade astro to 4.16
```

Use [Conventional Commits](https://www.conventionalcommits.org/). It makes changelog generation and debugging dramatically easier.

### Branch Strategy for Solo Devs

```
main          ← production, always deployable
  └── dev     ← integration branch
       └── feature/dark-mode
       └── fix/mobile-nav
```

## The Non-Negotiables

Three things that consistently save me hours:

1. **`git stash`** — save half-done work, context-switch, come back
2. **`npx serve dist`** — preview the production build locally before pushing
3. **`.env.example`** — always commit this; never commit `.env`

---

What's in your toolkit? Reach out — I'm always looking for tools I haven't discovered yet.
