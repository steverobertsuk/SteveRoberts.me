# SteveRoberts.me

Personal site for Steve Roberts — Senior Software Engineer, Suffolk, England.

Built with [Astro](https://astro.build/). Dark theme, mobile-first, no JS framework — fully static output deployed to Cloudflare Pages. Uses the same configuration, build pipeline, and tooling as the MidNiteShadowOnline site.

## Stack

- **SSG:** Astro (static output) with the `@astrojs/cloudflare` adapter
- **Styling:** plain CSS (custom properties, no Tailwind, no PostCSS) in `src/styles/global.css`
- **Hosting target:** Cloudflare Pages (build output `dist/client`)
- **Node:** 24.x (see `.node-version`)

## Local development

```bash
npm install
npm run dev         # http://localhost:8082 with live reload
npm run watch       # dev server via scripts/watch.mjs (optional background build)
npm run build       # astro check + build + OG images into dist/client/
npm run build:local # build + accessible-name audit
npm run preview     # preview the production build on :8082
```

## OG images

`npm run build` generates a 1200×630 Open Graph image per page (satori +
resvg) into `public/assets/og/` (cached) and `dist/client/assets/og/`.
`BaseLayout.astro` points `og:image` at `/assets/og/<slug>.png` using the same
slug derivation as the generator. Use `npm run og:generate` to force-regenerate
all images.

## Accessibility check

`npm run build:local` includes an automated audit for heading and anchor accessible names in generated HTML (`dist`).

The audit fails the build if any `<h1>`-`<h6>` or `<a>` element has no accessible name.

Accepted name sources:

- inner text
- `aria-label`
- `aria-labelledby`
- an `img` with non-empty `alt`
- an `svg` with a non-empty `<title>`

To run only the audit after a build:

```bash
node ./scripts/check-accessible-names.mjs dist
```

## Project structure

```
.
├── astro.config.mjs        # Astro config (static output, Cloudflare adapter)
├── wrangler.toml           # Cloudflare Pages config (dist/client output)
├── wrangler.dev.toml       # Local adapter config (no pages_build_output_dir)
├── package.json
├── functions/
│   └── api/contact.ts      # Cloudflare Pages Function — contact form (Turnstile + SES)
├── public/
│   ├── _headers            # Security headers
│   ├── favicon.svg
│   ├── robots.txt
│   └── assets/
│       ├── img/            # SR monogram, profile image
│       └── og/             # Generated OG images (build cache)
├── scripts/
│   ├── generate-og-images.mjs
│   ├── check-accessible-names.mjs
│   └── watch.mjs
└── src/
    ├── config.ts           # Build-time constants (GA Measurement ID)
    ├── styles/global.css   # All site styles
    ├── components/
    │   └── CookieBanner.astro
    ├── layouts/
    │   ├── BaseLayout.astro     # HTML shell, meta tags, nav, footer, scripts
    │   └── PageLayout.astro     # Standard page wrapper with header + prose
    └── pages/              # One .astro file per route
        ├── index.astro
        ├── contact.astro
        ├── experience.astro
        ├── now.astro
        ├── timeline.astro
        ├── tools.astro
        ├── running.astro
        ├── privacy.astro
        ├── projects/…
        ├── media/…
        └── themes/…
```

## Adding a new page

Create `src/pages/<slug>.astro` (or any nested folder):

```astro
---
import PageLayout from '../layouts/PageLayout.astro';
---

<PageLayout
  title={"My new page"}
  eyebrow={"Section"}
  lede={"One sentence summary that appears under the title."}
>
  <h2>Body content</h2>
  <p>…</p>
</PageLayout>
```

Then add it to `navItems` in `src/layouts/BaseLayout.astro` if it should appear in the global nav.

## Branding

Palette and monogram come from the SR Monogram Proposal supplied with the planning pack:

| Token        | Hex       | Used for                                |
| ------------ | --------- | --------------------------------------- |
| Primary Blue | `#2563EB` | Buttons, gradient base, primary accents |
| Accent Blue  | `#60A5FA` | Links, hover, highlights, eyebrow text  |
| Background   | `#0B1220` | Page background                         |
| Surface      | `#111827` | Cards, panels, inline code              |
| Text / Light | `#E5E7EB` | Body text                               |

These are defined as CSS custom properties at the top of `src/styles/global.css` — change them there and the whole site re-themes.

## Deploying to Cloudflare Pages

1. Push this repo to GitHub.
2. In the Cloudflare dashboard → **Pages** → **Create a project** → **Connect to Git**.
3. Pick the repo, then use these build settings:

   | Setting                | Value                       |
   | ---------------------- | --------------------------- |
   | Framework preset       | Astro                       |
   | Build command          | `npm run build`             |
   | Build output directory | `dist/client`               |
   | Root directory         | `/`                         |
   | Node version           | `24` (from `.node-version`) |

4. Add a custom domain (`steveroberts.me`) under Pages → Custom domains.
5. Cloudflare Pages will rebuild on every push to `main`.

The contact form Pages Function (`functions/api/contact.ts`) needs these secrets set on the Pages project: `TURNSTILE_SECRET_KEY`, `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_REGION`, `SES_FROM_EMAIL`, `SES_TO_EMAIL`.

For preview deploys, any non-`main` branch will get its own URL automatically.

## Things planned but not yet built

These came up in the planning pack and can be added incrementally:

- contact form using Cloudflare Turnstile + serverless form handling
- STO Info technical architecture deep-dive
- Roll20 mod documentation pages
- media production workflow case studies
- running race archive
- reading and fandom influences
- hardware and software setup
- visual content swaps: profile photo / hero image, project screenshots, Inkarnate maps, race medals, Loch Ness Marathon photos, parkrun photos
