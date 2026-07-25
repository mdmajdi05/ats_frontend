# Slug Generation Rule

## Problem
Google Search Console mein `/-Product snippets-Issue-2026-07-24` jaisi malformed URLs aa rahi thi kyunki slug generation unsafe tha.

## Root Cause
Sirf `replace(/\s+/g, '-')` use karne se:
- Special chars remove nahi hote (`&`, `%`, etc.)
- Leading/trailing dashes nahi hatte → `-slug` jaisi URLs banti hain
- Consecutive dashes collapse nahi hote

## Rule
**Har jagah slug generate karte waqt ye exact pattern use karo:**

```ts
text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
```

Yeh pattern:
1. Lowercase karta hai
2. Special chars + spaces ko single `-` mein badalta hai
3. Leading/trailing `-` ko trim karta hai

## Kahan-Kahan Apply Karna Hai

| Location | Example |
|----------|---------|
| New category/product/part slugs | `c.name.toLowerCase().replace(...)` |
| Blog post slugs from title | `title.toLowerCase().replace(...)` |
| HTML `id` attributes from labels | `label?.toLowerCase().replace(...)` |
| User-provided slug from `req.body` | Store karne se pehle sanitize karo |
| Mock API handlers | `api-client.ts`, `fallback-router.ts` |
| Sitemap generation | Invalid slugs ko filter karo |

## DO NOT Use

```ts
// ❌ Ye unsafe hai — special chars aur leading/trailing dashes handle nahi karta
text.toLowerCase().replace(/\s+/g, '-')
```

## Safe Pattern (✅ Always Use)

```ts
// ✅ Full sanitization — special chars, consecutive dashes, leading/trailing dashes sab handle
text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
```

## History
- **2026-07-25**: First rule created after finding 20+ unsafe slug generation patterns across frontend and backend.
