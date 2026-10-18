---
title: "TypeScript Patterns Every Solo Dev Should Know"
description: "Practical TypeScript techniques — from discriminated unions to branded types — that catch real bugs before they reach production."
pubDate: 2026-10-10
image: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800&auto=format&fit=crop&q=80"
tags: ["typescript", "patterns", "engineering"]
---

TypeScript isn't just about adding types to JavaScript. Used well, it reshapes how you *think* about your code. Here are the patterns I reach for most on solo projects.

## 1. Discriminated Unions for State Machines

Instead of a pile of booleans, model your UI state as a union:

```typescript
type FetchState<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; message: string };
```

TypeScript now narrows correctly inside every `if` branch — no more `data?.foo` defensive chains.

## 2. Branded Types to Prevent Mix-Ups

```typescript
type UserId = string & { readonly __brand: 'UserId' };
type PostId = string & { readonly __brand: 'PostId' };

function getUser(id: UserId): User { /* ... */ }

const postId = 'abc123' as PostId;
getUser(postId); // ✅ Type error — caught at compile time!
```

This costs zero bytes at runtime and prevents entire classes of bugs.

## 3. `satisfies` for Safer Inference

New in TypeScript 4.9:

```typescript
const palette = {
  red: [255, 0, 0],
  green: '#00ff00',
} satisfies Record<string, string | number[]>;

// palette.red is inferred as number[] — not string | number[]!
palette.red.map(channel => channel * 0.5);
```

Use `satisfies` when you want constraint checking *without* widening inference.

## 4. Template Literal Types

```typescript
type EventName = `on${Capitalize<string>}`;
type Route = `/${string}`;
type APIEndpoint = `/api/v${number}/${string}`;
```

Perfect for validating string shapes at the type level — no runtime overhead.

## 5. `infer` in Conditional Types

```typescript
type Awaited<T> = T extends Promise<infer U> ? U : T;
type ElementOf<T> = T extends Array<infer E> ? E : never;

type PostData = Awaited<ReturnType<typeof fetchPost>>;
```

These patterns make utility types that adapt automatically to any shape you throw at them.

## Closing Thought

The goal isn't TypeScript purity — it's writing code you can confidently refactor six months from now when you've forgotten why you made every decision. Types are documentation that the compiler enforces for free.
