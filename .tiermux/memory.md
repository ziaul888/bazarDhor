# TierMux memory — your style, tone & standing instructions

The agent reads this file every turn and follows it exactly. Edit freely — what you write
here always takes priority over its defaults. Keep it short: it's injected into every request.

## Learned from corrections (agent-maintained)
- The existing approach calls `useRandomProducts({ sort_by: feedFilter })` → `GET /products?sort=trending`, then `applyFeedFilter(..., 'trending', ...)` keeps only discounted items. Do not use this discount-only behavior for the Trending tab.
- Do not use `GET /products?sort=trending` as the Trending API; the user requested the dedicated trending API.
