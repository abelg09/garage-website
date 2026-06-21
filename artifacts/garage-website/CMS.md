# GARAGE CMS Setup

The site uses Sanity as a hosted CMS backend and builds Sanity Studio into `/studio` during the GitHub Pages deploy.

## GitHub Pages Variables

Add these repository variables in GitHub:

- `SANITY_PROJECT_ID`: your Sanity project id
- `SANITY_DATASET`: `production`

The workflow maps them to both the website runtime variables and the Studio build variables.

## Sanity CORS

In Sanity project settings, add these CORS origins:

- `https://abelg09.github.io`
- `http://localhost:3333`
- `http://localhost:5173`
- any alternate local Vite port you use

Allow credentials for Studio/local editing origins when Sanity asks.

## Local Studio

```bash
SANITY_STUDIO_PROJECT_ID=your_project_id \
SANITY_STUDIO_DATASET=production \
SANITY_STUDIO_BASEPATH=/studio \
pnpm --filter @workspace/garage-website run studio:dev
```

Studio runs at `http://localhost:3333/studio`.

## Seed Current Content

Create a Sanity API token with write access, then run:

```bash
SANITY_PROJECT_ID=your_project_id \
SANITY_DATASET=production \
SANITY_AUTH_TOKEN=your_write_token \
pnpm --filter @workspace/garage-website run seed:sanity
```

The seed script uploads the current public images and creates or replaces the current site settings, home/about content, work projects, clients, crew, crew mosaic, and services documents.

## Live Editing

Editors publish changes in Sanity Studio. The GitHub Pages site fetches published CMS content at runtime. If the Sanity config is missing or the fetch fails, the site uses the local fallback content in `src/lib/fallback-data.ts`.
