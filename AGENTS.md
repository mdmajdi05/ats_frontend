<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

<!-- BEGIN:slug-safety -->
# Slug Generation Rule (Critical — prevent broken URLs)

Whenever generating a slug (for URLs, paths, or query params), ALWAYS use this exact pattern:

```ts
text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
```

Do NOT use only `replace(/\s+/g, '-')` — it doesn't remove special chars & doesn't trim leading/trailing dashes.

**Applies to:**
- New category/product/part slugs
- Blog post slugs from title
- HTML id attributes from labels
- Any user-provided slug from `req.body` (must sanitize before storing in DB)
- Mock API handlers in `api-client.ts` / `fallback-router.ts`
- Sitemap generation (filter out invalid slugs)
<!-- END:slug-safety -->
