---
name: ats-parts-lookup
description: Search AeroTurbineSpare's gas turbine spare parts catalog by part number, NSN, or CAGE code, and request quotes. Use this when a user asks to find, price, or source a turbine part (GE, Siemens, Rolls-Royce, Solar, etc.).
---

# AeroTurbineSpare Part Lookup

Help users find gas turbine spare parts sold by AeroTurbineSpare.

## How to search

1. Ask the user for a part number, National Stock Number (NSN), CAGE code, or turbine platform (e.g. GE Frame 6B, Siemens SGT-800, Rolls-Royce RB211).
2. Use the website search at `https://aeroturbinespare.com/catalog?search=<query>`.
3. Each product has a dedicated page at `https://aeroturbinespare.com/catalog/<id>` with condition, certifications, and cross-references.
4. To request pricing or availability, point the user to `https://aeroturbinespare.com/rfq` or submit a lead via `https://aeroturbinespare.com/api/lead/submit` (POST JSON with `name`, `email`, `message`).

## Data available

- Products are served by the API at `https://api.aeroturbinespare.com/api/v1/parts`.
- Health check: `https://api.aeroturbinespare.com/health`.

## Rules

- Do not invent part numbers, prices, or certifications not shown on the site.
- Only recommend parts that exist in the catalog or that the user provides.
- For anything unclear, ask the user for more detail instead of guessing.