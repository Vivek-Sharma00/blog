---
title: "Designing APIs You Won't Hate in Six Months"
description: "Practical API design principles for solo developers — versioning, error shapes, pagination, and the single rule that prevents most breaking changes."
pubDate: 2026-09-28
image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop&q=80"
tags: ["api", "design", "backend"]
---

The APIs you design today are the contracts you'll be maintaining indefinitely. Here's how to write them so future-you doesn't send hate mail to past-you.

## The Golden Rule: Never Remove, Only Add

Breaking changes break clients. The safest API evolution strategy is **additive only**:

- ✅ Add new fields to responses
- ✅ Add new optional request parameters  
- ❌ Remove or rename existing fields
- ❌ Change field types
- ❌ Change error codes for existing flows

If you must break something, version.

## Versioning: URI or Header?

URI versioning (`/api/v1/posts`) is boring and it works. Header versioning (`Accept: application/vnd.myapp.v2+json`) is elegant and it's annoying to test in a browser. For solo projects, URI wins.

```typescript
// Explicit version in route
app.get('/api/v1/posts', getPosts);
app.get('/api/v2/posts', getPostsV2); // New shape, old one still works
```

## Consistent Error Shape

Every error, everywhere, should look identical:

```json
{
  "error": {
    "code": "POST_NOT_FOUND",
    "message": "No post with ID abc123 exists.",
    "statusCode": 404,
    "requestId": "req_8f3kd92"
  }
}
```

`code` is machine-readable. `message` is human-readable. `requestId` is your debugging lifeline.

## Pagination: Cursor > Offset

Offset pagination (`?page=3&limit=20`) breaks when items are inserted mid-query. Cursor pagination doesn't:

```json
{
  "data": [...],
  "nextCursor": "eyJpZCI6ImFiYzEyMyJ9",
  "hasMore": true
}
```

```typescript
// Usage
GET /api/v1/posts?cursor=eyJpZCI6ImFiYzEyMyJ9&limit=20
```

The cursor is just a base64-encoded bookmark — opaque to the client, meaningful to the server.

## Input Validation at the Boundary

Validate everything at the API layer, before it touches your business logic. Zod is perfect here:

```typescript
import { z } from 'zod';

const CreatePostSchema = z.object({
  title: z.string().min(1).max(200),
  content: z.string().min(10),
  tags: z.array(z.string()).max(5).optional(),
});

app.post('/api/v1/posts', async (req, res) => {
  const result = CreatePostSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ error: result.error.flatten() });
  }
  // Safe to use result.data from here
});
```

## Document Everything, Automate Where Possible

Use [Zod-to-OpenAPI](https://github.com/asteasolutions/zod-to-openapi) or similar to generate your API docs from the same schema you use for validation. One source of truth, always in sync.

---

Good APIs aren't magic. They're just the result of deciding upfront what your contract is — and then holding the line.
