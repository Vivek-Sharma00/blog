---
title: "Stop Installing Electron: How I Turned Brave into a Clean App Launcher"
description: "Why I stopped installing desktop apps for YouTube, WhatsApp, and Spotify, and started running them as ad-blocked Brave web apps instead."
pubDate: 2026-11-12
image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80"
tags: ["browsers", "productivity", "pwa", "minimalism"]
---

At some point last month, I looked at my task manager and realized I was dedicating almost 3 GB of RAM just to keep Spotify, WhatsApp, and Slack open in the background. None of these are native apps. They are all just individual copies of Google Chrome bundled inside an Electron shell, running duplicate background processes on my machine for zero good reason.

Worse, the official desktop clients stripped out the one thing the web version had: content blocking. I was getting banner ads in Spotify and promotional popups I couldn't touch.

So I deleted them and moved the entire setup into Brave as standalone web apps.

## The Trick: Turning Web Pages into Borderless Apps

You don't need a wrapper app to get a dedicated icon on your dock or taskbar. Chromium has supported standalone web app shortcuts for years, but running them through Brave gives you aggressive tracker and ad blocking out of the box.

Here is the exact setup:

1. Open Brave and go to the site (e.g. `web.whatsapp.com` or `youtube.com`).
2. Hit the three-dot menu in the top right → **Save and share** → **Install page as app...** (or click the small screen/install icon on the far right of the URL bar).
3. Check **Open as window** and click install.

That’s it. It peels away the URL bar, bookmarks, and tabs. The site pops open in its own clean window, gets its own dock/taskbar icon, alt-tabs like a regular application, and survives window reboots.

## Why This Beats the "Official" Desktop Downloads

### 1. Unified Memory Footprint
Instead of launching three separate versions of Chromium (which is what running multiple Electron apps actually does), all these windows share Brave’s existing browser runtime. My idle background memory dropped noticeably, and my laptop runs cooler.

### 2. Built-in Shields
Because it's running inside Brave, the browser's native Shields engine applies to the app window:
- **YouTube:** No pre-roll video ads, no mid-roll interruptions, no sidebar banners.
- **Spotify Web:** No audio ads playing between tracks.
- **WhatsApp Web:** Zero third-party telemetry scripts dialing out in the background.

### 3. Nuke Anything Ugly with Cosmetic Filters
If a website has a sidebar or banner you hate, you don’t have to tolerate it just because it’s an "app". Right-click the offending section → **Brave** → **Block element**. You can permanently strip out recommendation sidebars, shorts, or banner widgets with one click.

## Dealing with YouTube's Adblock Tantrums

Google pushes script updates almost weekly to break ad blockers. If your YouTube PWA suddenly throws a black playback screen or an anti-adblock popup, you don't need to reinstall anything. 

Open a regular Brave tab and head to:

```text
brave://components