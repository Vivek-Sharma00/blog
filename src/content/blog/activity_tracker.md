---
title: "Stop Leaking Your Screen Time: Why I Switched to ActivityWatch"
description: "Why proprietary time trackers fail power users, and how to set up ActivityWatch for private, local-first app and browser tracking."
pubDate: 2026-11-11
image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80"
tags: ["tools", "productivity", "open-source", "privacy"]
---

Most commercial screen-time trackers give you a bad deal: pay a monthly subscription to let a third-party server log every URL, window title, and active application on your workstation. The free alternatives are usually worse — bloated UIs, aggressive upsells, and coarse metrics that can't differentiate between watching a tutorial on Chrome and scrolling social feeds.

When I wanted an honest breakdown of where my hours were disappearing, I turned to [ActivityWatch](https://activitywatch.net) — a completely free, open-source, local-first tracker that actually respects system resources and user privacy.

## The Problem with Cloud Trackers

Most commercial solutions (RescueTime, Toggl, Clockify) operate on a SaaS model:

- ❌ **Data Exposure:** Your window titles and browsing history sit unencrypted on someone else's database.
- ❌ **Coarse Metrics:** Most desktop agents only log the foreground process name (e.g., `chrome.exe`), missing tab-level or file-level granularity.
- ❌ **Feature Walls:** Historical data, exports, and query filters are routinely locked behind $10+/month tiers.

ActivityWatch flips this model. It stores everything locally on your disk, requires zero account creation, and exposes your raw event data through an open architecture.

## How ActivityWatch Works

ActivityWatch is split into modular background services called **watchers** that feed events into a local core server (`aw-server`):

- **`aw-watcher-afk`**: Monitors mouse and keyboard state to detect active vs. idle time.
- **`aw-watcher-window`**: Logs active desktop applications and window titles across Windows, macOS, and Linux.
- **Browser Extensions**: Integrates with Chrome, Brave, and Firefox to track active URLs and domain-level screen time.
- **Editor Watchers**: Community plugins for VS Code and Neovim that log active files and project workspaces.

Because the data never leaves `localhost:5600`, you can inspect your complete digital footprint without transmitting browser cookies or confidential file names over the wire.

## Getting Started

### 1. Installation

On Linux or macOS, grab the binary or package via your package manager:

```bash
# Arch Linux
sudo pacman -S activitywatch

# macOS via Homebrew
brew install --cask activitywatch