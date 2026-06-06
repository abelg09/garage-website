# GARAGE Website

Single-page production website for GARAGE, built with Next.js App Router, Sanity, Motion for React, and PPT-seeded fallback content.

## Run

```bash
pnpm install
pnpm dev
```

Open `http://localhost:3000`.

## GitHub Pages Preview

This repo includes a GitHub Actions workflow that publishes the public website to GitHub Pages on every push to `main`.

Expected preview URL after pushing to a repo named `garage-website` under `abelg09`:

```text
https://abelg09.github.io/garage-website/
```

For a different repository name, use:

```text
https://abelg09.github.io/<repo-name>/
```

The workflow builds with `GITHUB_PAGES=1`, exports the public site to `out/`, and uploads that artifact to Pages. Local development and the embedded Sanity Studio still use the normal Next.js dev server.

## Sanity

Create `.env.local` when a real Sanity project is ready:

```bash
NEXT_PUBLIC_SANITY_PROJECT_ID=yourProjectId
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=yourWriteToken
```

Seed the CMS with the PPT assets:

```bash
pnpm seed:sanity
```

Without these env vars, the site uses the local PPT fallback dataset in `public/assets/ppt`.
