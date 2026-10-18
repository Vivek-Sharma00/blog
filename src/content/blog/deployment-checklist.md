---
title: "Shipping Fast: My Zero-Drama Deployment Checklist"
description: "The exact pre-deploy checklist I run before every production push — covering builds, environment variables, rollback plans, and smoke tests."
pubDate: 2026-10-05
image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&auto=format&fit=crop&q=80"
tags: ["deployment", "devops", "checklist"]
---

Every deployment is a chance to break something in front of users. After enough incidents, I built a checklist that keeps releases boring — and boring is good.

## The Mindset: Boring Deployments

A dramatic deployment means something went wrong. The goal is to make production pushes feel like merging a pull request: routine, reversible, and fast.

## Pre-Deploy: The 5-Minute Gate

Before you push anything to production, run through this gate:

### ✅ 1. Build Passes Locally

```bash
npm run build
echo "Exit code: $?"
```

If it's not `0`, don't ship. Full stop.

### ✅ 2. Environment Variables Are Synced

```bash
# Compare your .env.example against your actual deployment env
diff <(cat .env.example | sort) <(env | grep -E "^(VITE_|PUBLIC_|DB_)" | sort)
```

Missing env vars are the #1 cause of silent production failures.

### ✅ 3. Run a Lighthouse Audit

```bash
npx lighthouse https://staging.yourapp.com --output=json --quiet \
  | jq '{performance: .categories.performance.score, a11y: .categories.accessibility.score}'
```

Gate on performance score > 0.85. Accessibility score > 0.90.

### ✅ 4. Preview the Dist Folder Locally

```bash
npx serve dist -p 5000
```

Click through the three most-used flows. Take 90 seconds. It's worth it.

## Deploy: Prefer Atomic Over Incremental

Netlify and Vercel both do atomic deploys — the entire `dist/` folder is swapped in a single transaction. No partial states, no stale asset/HTML mismatches.

For anything self-hosted, script your deploy as:

```bash
rsync -avz --delete dist/ user@server:/var/www/html/
```

`--delete` ensures stale files don't linger.

## Post-Deploy: The 3-Check Pass

```
1. Hard-refresh the homepage in an incognito tab
2. Open DevTools → Network → check for 404s on JS/CSS/fonts
3. Run your most critical user journey end-to-end
```

If all three pass, you're done. If any fail, you have a rollback plan ready (see below).

## Rollback: One Command Away

On Netlify: previous deploys are preserved — one click to roll back via the UI or:

```bash
netlify deploy --prod --dir=dist  # Re-deploy the last known-good dist/
```

Keep at least one "last good" build artifact around. `git stash` isn't enough.

---

Shipping confidently isn't about being fearless — it's about having the right safety nets so you *can* move fast.
