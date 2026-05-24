# SteveRoberts.me

Personal site for Steve Roberts — Senior Software Engineer, Suffolk, England.

Built with [Eleventy](https://www.11ty.dev/) (11ty). Dark theme, mobile-first, no JS framework, no build step beyond the static site generator.

## Stack

- **SSG:** Eleventy 3.x (Nunjucks templates)
- **Styling:** plain CSS (custom properties, no Tailwind, no PostCSS)
- **Hosting target:** Cloudflare Pages
- **Node:** 20.x or 22.x

## Local development

```bash
npm install
npm run serve       # http://localhost:8082 with live reload
npm run build       # one-off build into _site/
npm run clean       # remove _site/
```

## Project structure

```
.
├── .eleventy.js            # Eleventy configuration
├── package.json
├── src/
│   ├── _data/site.js       # Global site data: title, tagline, nav, social
│   ├── _includes/
│   │   ├── layouts/
│   │   │   ├── base.11ty.njk    # HTML shell, meta tags, scripts
│   │   │   └── page.11ty.njk    # Standard page wrapper with header + prose
│   │   └── partials/
│   │       ├── nav.11ty.njk     # Site header + responsive nav
│   │       └── footer.11ty.njk
│   ├── assets/
│   │   ├── css/style.css   # All site styles
│   │   └── img/            # SR monogram, proposal sheet
│   ├── favicon.svg
│   ├── robots.txt
│   ├── index.11ty.njk           # Home
│   ├── experience.11ty.njk
│   ├── now.11ty.njk
│   ├── timeline.11ty.njk
│   ├── tools.11ty.njk
│   ├── contact.11ty.njk
│   ├── running.11ty.njk
│   ├── projects/
│   │   ├── index.11ty.njk
│   │   ├── sto-info.11ty.njk
│   │   ├── roll20.11ty.njk
│   │   └── shadow-computers.11ty.njk
│   ├── media/
│   │   ├── index.11ty.njk       # Gaming, media & creative
│   │   └── holosuite.11ty.njk
│   └── themes/
│       ├── community.11ty.njk
│       ├── long-term-projects.11ty.njk
│       ├── storytelling.11ty.njk
│       └── sustainability.11ty.njk
└── _site/                  # Build output (gitignored)
```

## Adding a new page

Create `src/<slug>.11ty.njk` (or any nested folder) with this front matter:

```njk
---
layout: layouts/page.11ty.njk
title: My new page
eyebrow: Section
lede: One sentence summary that appears under the title.
permalink: /my-new-page/
---

<h2>Body content</h2>
<p>…</p>
```

Then add it to the global nav by editing `src/_data/site.js` if it should appear there.

## Branding

Palette and monogram come from the SR Monogram Proposal supplied with the planning pack:

| Token            | Hex       | Used for                                  |
| ---------------- | --------- | ----------------------------------------- |
| Primary Blue     | `#2563EB` | Buttons, gradient base, primary accents   |
| Accent Blue      | `#60A5FA` | Links, hover, highlights, eyebrow text    |
| Background       | `#0B1220` | Page background                           |
| Surface          | `#111827` | Cards, panels, inline code                |
| Text / Light     | `#E5E7EB` | Body text                                 |

These are defined as CSS custom properties at the top of `src/assets/css/style.css` — change them there and the whole site re-themes.

## Deploying to Cloudflare Pages

1. Push this repo to GitHub.
2. In the Cloudflare dashboard → **Pages** → **Create a project** → **Connect to Git**.
3. Pick the repo, then use these build settings:

   | Setting                | Value                  |
   | ---------------------- | ---------------------- |
   | Framework preset       | None (or Eleventy)     |
   | Build command          | `npm run build`        |
   | Build output directory | `_site`                |
   | Root directory         | `/`                    |
   | Node version           | `20` (env var `NODE_VERSION=20`) |

4. Add a custom domain (`steveroberts.me`) under Pages → Custom domains.
5. Cloudflare Pages will rebuild on every push to `main`.

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
