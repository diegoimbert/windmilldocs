---
name: promo-video
description: Create an on-brand, technical explainer / promo video (Remotion) for a Windmill blog post or feature, rendered to a square mp4. Use when asked to "make a promo video", "create an explainer video", "animate the blog post", "video for LinkedIn / social", or "turn this post into a short video".
---

# Windmill promo / explainer video

Builds a short (~15–20s) on-brand video with [Remotion](https://www.remotion.dev), styled to stay consistent across Windmill promos. Default output is a `1080x1080` mp4 suited to social feeds; other ratios on request.

**Read the `remotion-best-practices` skill first** for Remotion mechanics (animate with `useCurrentFrame`/`interpolate`/`spring`, sequence with `<Sequence>`, render with the CLI). This skill layers Windmill's visual style, structure, and tone on top — it does not repeat the mechanics.

## Tone — technical, not salesy (default)

The goal is to explain how something works, not to sell it. Unless the user explicitly asks for a promotional / marketing cut:

- Lead with what it is and how it works. The **architecture / dataflow act is the centerpiece**, not a value-prop.
- No marketing one-liners ("no server, no Vercel function", "10x faster", "effortless", "intelligent"). State mechanics instead: triggers, scripts, state, tables, data flow.
- **Drop the "read more / visit our blog" CTA act.** End on the demo or a quiet title card. Add a CTA only when asked.
- Prefer concrete nouns from the system (real trigger names, script names, table names) over adjectives.

If the user asks for a "promo for LinkedIn / marketing", you may add a hook line and a closing CTA card — but keep the architecture act.

## Structure — default 3 acts

1. **Title** — what it is. Logos of the systems involved + one neutral, mechanical subline (e.g. "Two scripts, two triggers, one shared state").
2. **Architecture / dataflow** — the heart. A node per system with **Windmill in the middle**; arrows labeled with the *actual* triggers / mechanisms; animated flow dots showing direction. Inbound-to-Windmill arrows in brand blue (`theme.windmill`), outbound in muted. Give this act **≥ 6s** so it can be read.
3. **Demo** — an embedded screen recording of the real thing inside a `BrowserFrame`.

Scale to the topic: a single-script feature might be Title → Demo; a multi-system integration wants the full dataflow act.

## Workflow

1. **Scaffold outside the docs repo** (keep `node_modules` out of `windmilldocs`). Sibling dir named `<topic>-promo`:
   ```bash
   cd /Users/alex/windmill
   npx create-video@latest --yes --blank --no-tailwind <topic>-promo
   cd <topic>-promo && npm i
   ```
   (`--no-tailwind` still installs the tailwind dep — ignore it, use inline styles only.)
2. **Add the media + font packages at the *matching* Remotion version** (mismatched versions break the render):
   ```bash
   VER=$(node -p "require('./node_modules/remotion/package.json').version")
   npm i @remotion/media@$VER @remotion/google-fonts@$VER
   ```
3. **Copy the template files** into `src/`, and the **real logos + demo clip** into `public/` (see Assets):
   ```bash
   SKILL=<windmilldocs>/.agents/skills/promo-video/template
   cp "$SKILL/theme.ts" "$SKILL/components.tsx" src/
   cp "$SKILL/Root.tsx" src/Root.tsx
   cp "$SKILL/Pitch.example.tsx" src/Pitch.tsx   # then edit for your topic
   ```
4. **Write your scenes** in `src/Pitch.tsx` from the components; set the duration via `SCENES` in `src/Root.tsx`.
5. **Sanity-check stills before the full render** — one frame per act:
   ```bash
   npx remotion still Pitch /tmp/act2.png --frame=220 --scale=0.6
   ```
   Read each PNG, fix layout, then render:
   ```bash
   npx remotion render Pitch out/<topic>-pitch.mp4
   ```

## Brand tokens (locked)

In `template/theme.ts`. Do not invent colors.

| Token             | Value     | Use                                            |
| ----------------- | --------- | ---------------------------------------------- |
| Windmill blue     | `#3b82f6` | primary accent, inbound-to-Windmill arrows     |
| Windmill light    | `#bcd4fc` | kicker / small highlights                      |
| Teams             | `#6264a7` | Microsoft Teams node accent                    |
| Discord           | `#5865f2` | Discord node accent                            |
| BG gradient       | `#080b1f` → `#111a3a` | dark base behind everything        |
| White / Muted     | `#ffffff` / `#94a3b8` | titles / secondary text, outbound arrows |

Font: **Inter** via `@remotion/google-fonts/Inter` (`fontFamily` from `theme.ts`). Backgrounds stay dark; layer blurred brand-color blobs (the `Background` component), never flat fills.

## Assets — use real logos, never fake them

Copy the genuine SVGs from the docs repo into `public/` — do **not** approximate a logo with colored text or a letter badge on the hero frame:

| Asset    | Source in `windmilldocs`                  | → public/      |
| -------- | ----------------------------------------- | -------------- |
| Windmill | `static/img/windmill.svg`                 | `windmill.svg` |
| Teams    | `static/third_party_logos/teams.svg`      | `teams.svg`    |
| Discord  | `static/third_party_logos/discord.svg`    | `discord.svg`  |
| others   | `static/third_party_logos/<name>.svg` or `static/integrations/` | `<name>.svg` |

Note: the Windmill logo is white+blue — it reads on dark surfaces but disappears on white tiles. Keep it on the dark background or a colored/`theme.card` tile, never on white.

## Demo clips

To embed a screen recording (the demo act):

1. macOS screen-recording filenames contain a narrow no-break space (U+202F) before "AM/PM" — a typed path won't match. **Glob it**: `F=$(ls -t ~/screenshots/*.mov | head -1)`.
2. **Convert to an optimized mp4** before embedding (raw recordings are 120fps / retina-huge):
   ```bash
   ffmpeg -y -i "$F" -vf "scale=1462:-2,fps=30" -c:v libx264 -pix_fmt yuv420p \
     -crf 24 -preset slow -an -movflags +faststart public/dashboard.mp4
   ```
   This is also the format to colocate in the blog post itself (`<video>` with an imported `.mp4`).
3. Embed with `<BrowserFrame src="dashboard.mp4" />` (uses `@remotion/media`'s `<Video>` + `staticFile`).

## Components (`template/components.tsx`)

Build every scene from these so promos look related:

- `Background` — the constant animated gradient; render once behind all `<Sequence>`s.
- `useSceneOpacity(dur)` — per-act fade in/out (pass the Sequence duration).
- `Rise` — spring fade+slide-up entrance; stagger siblings via `delay`.
- `Center` — centered, padded, Inter-typeset scene wrapper.
- `NodeCard` / `Pill` — a dataflow node (positioned by center x and shared `cy`) and a monospace chip for script/table names.
- `FlowDots` — dots traveling along an arrow (inside an `<svg>`) to show direction.
- `BrowserFrame` — mac-style window around an embedded clip.
- `Logo` — an SVG logo from `public/` sized by height.

`Pitch.example.tsx` is a complete 3-act reference (the Teams⇄Discord bridge). Copy it to `src/Pitch.tsx` and adapt nodes/labels/text.

## Gotchas (learned the hard way)

- **No CSS transitions / animations and no Tailwind animation classes** — they don't render in Remotion. All motion goes through `interpolate`/`spring`.
- Match `@remotion/*` versions to `remotion` exactly.
- `still`-render one frame per act and actually look at it before the full render — cheap insurance against clipped text / overlap.
- Give dense slides reading time (architecture ≥ 6s); don't let a diagram flash by.
- Keep the file small: scale down, `-crf` ~24, `+faststart`. A 16s 1080² explainer should land ~3 MB.
- Output lives in the scaffolded project's `out/`. The Remotion project is a build artifact — keep it out of `windmilldocs` (sibling dir), and reference only the rendered `.mp4` from the post.

## Other ratios

Default `1080x1080`. On request: `1080x1350` (4:5, more feed height), `1080x1920` (9:16 stories/reels), `1920x1080` (16:9 docs/embeds). Set in `Root.tsx`; re-flow layouts per ratio (the dataflow act is built for a square — a 9:16 cut usually stacks the nodes vertically).
