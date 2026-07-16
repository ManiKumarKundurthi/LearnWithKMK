# LearnWithKMK

Articles on machine learning, coding, and mathematics. Built with [Eleventy](https://www.11ty.dev/), Markdown, and KaTeX. Dark theme, subtle by design.

Live at: `https://blog.manikumar.space`

Hosted on **Cloudflare Pages**, connected directly to this GitHub repo. Every push to `main` triggers an automatic build and deploy.

## Writing a new article

1. Create a new Markdown file in `src/articles/`, e.g. `src/articles/my-new-topic.md`
2. Add frontmatter at the top:

   ```yaml
   ---
   title: "Your Article Title"
   date: 2026-07-16
   tags: [ml]        # one of: ml, coding, math (or add your own)
   summary: "One-sentence summary shown in the article list."
   ---
   ```

3. Write the body in Markdown below the frontmatter. The layout, permalink (`/articles/my-new-topic/`), and tagging are all handled automatically via `src/articles/articles.json` — you don't need to repeat them per file.

### Math

Inline math: `$x^2 + y^2 = z^2$` → $x^2 + y^2 = z^2$

Block math:

```
$$
\int_0^\infty e^{-x^2}\, dx = \frac{\sqrt{\pi}}{2}
$$
```

Rendered server-side at build time via KaTeX — no client-side flash of unrendered math, and no external CDN calls (fonts and CSS are self-hosted in `src/assets/css/`).

### Code

Standard fenced code blocks with a language tag get syntax highlighting automatically:

````
```python
def hello():
    print("hi")
```
````

## Local development

```bash
npm install
npm run serve     # local dev server with live reload, http://localhost:8080
npm run build      # production build to _site/
```

## Deployment

Hosted on **Cloudflare Pages**. Setup (one-time, in the Cloudflare dashboard):

1. **Workers & Pages → Create → Pages → Connect to Git**, select this repo
2. Build settings:
   - Framework preset: **Eleventy** (or None — either works with these settings)
   - Build command: `npm run build`
   - Build output directory: `_site`
3. Cloudflare deploys automatically on every push to `main`, and creates preview deployments for other branches/PRs

### Custom domain

1. In the Pages project → **Custom domains** → add `blog.manikumar.space`
2. If your domain's DNS is already in the same Cloudflare account, this is close to one-click — Cloudflare adds the CNAME record for you automatically
3. HTTPS is provisioned automatically

### Notes

- `pathPrefix` in `.eleventy.js` is set to `/` since Cloudflare Pages serves from the domain root (no subpath, unlike GitHub Pages project sites)
- The old `.github/workflows/deploy.yml` (GitHub Actions → GitHub Pages) is no longer used now that Cloudflare Pages handles builds — safe to delete, or keep disabled for reference

## Structure

```
src/
├── _data/site.json          # site title, nav, social links
├── _includes/                # layouts and partials
├── assets/css/                # theme CSS, self-hosted KaTeX CSS + fonts
├── articles/                  # all articles, flat, one .md file each
├── about.njk
└── index.njk                  # homepage: about blurb + article list
```
