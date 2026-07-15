# LearnWithKMK

Articles on machine learning, coding, and mathematics. Built with [Eleventy](https://www.11ty.dev/), Markdown, and KaTeX. Dark theme, subtle by design.

Live at: `https://ManiKumarKundurthi.github.io/LearnWithKMK/`

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

Pushing to `main` triggers `.github/workflows/deploy.yml`, which builds the site and deploys it to GitHub Pages automatically. In the repo settings, under **Pages**, set the source to **GitHub Actions** (not "Deploy from branch").

### Moving to a custom domain later

1. Add a `CNAME` file to `src/` (11ty will copy it to the build output) containing your domain, e.g. `articles.manikumar.space`
2. Update the DNS records for that subdomain to point to GitHub Pages
3. In `.eleventy.js`, change `pathPrefix` from `/LearnWithKMK/` to `/`
4. Update `site.url` in `src/_data/site.json`

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
