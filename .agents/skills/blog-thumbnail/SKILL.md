---
name: blog-thumbnail
description: Generate an elegant SVG cover/thumbnail for a Windmill blog post or launch-week entry, then rasterize it to cover.webp. Use when asked to "create a blog thumbnail", "make a cover image", "generate a launch week cover", or "make an OG card".
---

# Blog thumbnail generator

Creates an on-brand `1200x630` (Open Graph ratio) cover image for blog posts, the same style used for launch-week covers and `blog/*/thumbnail.svg`.

## When to use

Triggered by: "create a blog thumbnail", "make a cover image", "launch week cover", "OG card", "thumbnail for this post".

## Workflow

1. Copy `template.svg` into the target blog post directory (e.g. `blog/2026-06-18-my-post/cover.svg`).
2. Replace `{{TITLE}}` and `{{SUBTITLE}}`:
   - Title: short, sentence case (e.g. "Sandboxed AI bots"). 1–4 words ideal, max ~22 chars/line so it stays on one line at 62px.
   - Subtitle: one short value-prop line, sentence case (e.g. "Give capabilities, not credentials").
   - No em-dash (`—`) anywhere. Use a comma or rephrase.
3. Design the right-side illustration for THIS topic. This is required, not optional — do not ship the default concentric rings unless the topic is genuinely generic. Replace the marked `ILLUSTRATION SLOT` block in the SVG (see "Illustration" below).
4. Rasterize:
   ```bash
   bash .agents/skills/blog-thumbnail/generate.sh blog/<post>/cover.svg
   ```
   This writes `cover.webp` next to the SVG.
5. Reference `cover.webp` (not the SVG) in the post frontmatter `image:` field, matching sibling posts.

## Brand tokens (locked)

Do not invent new colors. Palette:

| Token            | Value      | Use                                   |
| ---------------- | ---------- | ------------------------------------- |
| Primary blue     | `#1E3A8A`  | main accent, glow, rings, core        |
| Bright blue      | `#3B82F6`  | logo fill, highlights                 |
| Light blue       | `#60a5fa`  | accent rule, orbiting nodes           |
| Pale blue        | `#BCD4FC` / `#93c5fd` | logo highlights, small nodes |
| BG dark          | `#0b1220` → `#0f1c33` | gradient base             |
| Title text       | `#ffffff`  | title + wordmark                      |
| Muted text       | `#94a3b8`  | subtitle                              |

Typography: `Inter` (fallback `-apple-system, BlinkMacSystemFont, sans-serif`).
Title 62px / weight 700 / letter-spacing -0.03em. Subtitle 24px / weight 400.

## Layout

- Windmill logo + wordmark: top-left (`translate(80,120)`).
- Thin accent rule, then title, then subtitle: stacked left, vertically centered.
- Illustration: right side, centered on `cx=905 cy=315`.
- Keep generous left padding (`x=80`) and breathing room — elegance comes from whitespace, thin strokes, and low-opacity layering, not density.

## Illustration (right side) — design per topic

The right half is where the image earns its keep. Build a small, abstract vector graphic that visually echoes the topic, instead of reusing the rings every time. Think one clear metaphor, drawn with thin strokes and low opacity.

Constraints (keep it elegant and on-brand):
- Stay in the right region: keep all illustration geometry at `x >= 580` so it never collides with the title/subtitle on the left.
- Center the composition roughly on `cx=905 cy=315`; let the bottom-left glow bleed under it.
- Colors only from the brand palette. Strokes use `url(#ring)` or `#60a5fa`; fills use `#1E3A8A`/`#3B82F6` at low opacity. Nodes/dots in `#60a5fa`/`#93c5fd`.
- Thin strokes (`stroke-width` 1.5–2), opacities ~0.15–0.6. Layer for depth; never solid blocks.
- Abstract over literal: suggest the concept with nodes, lines, grids, and simple shapes — avoid detailed icons or text.

Topic → metaphor starting points (combine/adapt freely):
- AI / agents / tools: a central node with smaller tool-nodes wired to it (a hub-and-spoke / agent-calling-tools graph). Add a second satellite node for multi-agent.
- Flows / orchestration: a directed graph — rounded rectangles connected by elbow/arrow paths, branching.
- Data / tables / DuckLake: a grid of cells or stacked table rows, a few highlighted.
- Apps / UI: abstract window frames / cards with header bars and placeholder rows.
- Git sync / deploy: two columns of nodes linked by merge/branch lines, or up-arrow deploy paths.
- Workers / scaling: repeated worker boxes, some dimmed, suggesting a fleet.
- Triggers / schedules: a clock/cron motif or incoming arrows hitting a node.
- Security / permissions: concentric shield arcs or a lock-grid.

Recipe — agent-and-tools hub (good default for AI topics):
```svg
<!-- central agent -->
<circle cx="905" cy="315" r="46" fill="#1E3A8A" opacity="0.35" stroke="#60a5fa" stroke-width="2"/>
<circle cx="905" cy="315" r="8" fill="#60a5fa"/>
<!-- tool nodes + connectors -->
<g stroke="url(#ring)" stroke-width="1.5" stroke-opacity="0.45" fill="none">
  <line x1="905" y1="315" x2="1075" y2="195"/>
  <line x1="905" y1="315" x2="1095" y2="360"/>
  <line x1="905" y1="315" x2="745"  y2="190"/>
  <line x1="905" y1="315" x2="730"  y2="420"/>
  <line x1="905" y1="315" x2="985"  y2="470"/>
</g>
<g fill="#1E3A8A" fill-opacity="0.3" stroke="#60a5fa" stroke-width="1.5">
  <rect x="1045" y="170" width="60" height="48" rx="8"/>
  <rect x="1065" y="336" width="60" height="48" rx="8"/>
  <rect x="715"  y="166" width="60" height="48" rx="8"/>
  <rect x="700"  y="396" width="60" height="48" rx="8"/>
  <rect x="955"  y="446" width="60" height="48" rx="8"/>
</g>
```

After swapping the block, re-render and eyeball it: balanced, not crowded, nothing crossing into the text column.

## Notes

- The logo polygon block is fixed geometry — copy it verbatim, only `scale()`/`translate()` it.
- Renderer: `rsvg-convert` + `cwebp` (present locally); `generate.sh` falls back to `sharp`.
- Inter is not embedded; rsvg uses the system font stack. If Inter isn't installed the fallback sans renders fine.
