# AWS Community Event Hub

A web platform for the AWS community to discover, host, and manage events: from creating and approving an event to registration, check-in, and post-event feedback.

The platform is meant to be the single source of truth for AWS community events and to gradually replace external tools such as Luma, Meetup, and Eventbrite. The full requirements (in Vietnamese) are in [`PROJECT_REQUIREMENTS.md`](./PROJECT_REQUIREMENTS.md).

> **Status:** early stage. The UI is a front-end prototype with mock data. There is no backend, database, or authentication yet.

## Roles

| Role | What they can do |
| --- | --- |
| **AWS Admin** | Approve or reject events, moderate content, manage users, roles, and categories, view platform analytics and the audit trail |
| **Instructor** | Create draft events, submit them for review, manage registrations, run check-in, message attendees |
| **AWS Member / Intern** | Browse, search, and filter events, register or cancel, save events, check in, leave feedback |
| **External audience** | Join only events that allow external participation |

## Tech stack

- [Next.js 16](https://nextjs.org) (App Router, Turbopack) and React 19
- TypeScript
- Tailwind CSS v4, [shadcn/ui](https://ui.shadcn.com) (Base UI), and `lucide-react` icons
- Docker for reproducible builds and deployment

## Project structure

```
app/                  # App Router: the routes that are actually served
  layout.tsx          # Root layout and metadata
  page.tsx            # Home: event discovery and dashboard (role switcher: Member / Instructor / Admin)
  login/page.tsx      # Login page
  globals.css         # Tailwind and theme tokens
components/ui/        # shadcn/ui components
lib/utils.ts          # cn() helper
public/               # Static assets (icons, placeholders)
next.config.mjs       # Next.js config (this is the file Next.js loads)
Dockerfile            # Multi-stage production image
docker-compose.yml    # One-command local run
```

## Getting started

New to the repo? Follow **[GETTING_STARTED.md](./GETTING_STARTED.md)**. It covers prerequisites, setup steps, and fixes for common errors.

### Option 1: Docker (recommended)

You only need [Docker](https://docs.docker.com/get-docker/). Node.js doesn't have to be installed, and everyone gets the same Node version and dependencies.

```bash
docker compose up --build
```

Then open <http://localhost:3000>.

If you'd rather not use Compose:

```bash
docker build -t aws-community-hub .
docker run --rm -p 3000:3000 aws-community-hub
```

The image is built in three stages:

1. **deps**: `npm ci` installs the exact versions from `package-lock.json`.
2. **builder**: `npm run build` produces a [standalone](https://nextjs.org/docs/app/api-reference/config/next-config-js/output) server.
3. **runner**: a small `node:24-alpine` image that runs `node server.js` as a non-root user.

### Option 2: Local Node.js (for development)

Requirements: **Node.js 24** and **npm**.

```bash
npm ci        # install from the lockfile; don't use `npm install` unless you're changing dependencies
npm run dev   # http://localhost:3000, with hot reload
```

On Mac and Windows, hot reload is much faster outside Docker, so use this option for day-to-day UI work. Before you push, run `docker compose up --build` to check that the app also builds in a clean environment.

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the dev server with hot reload |
| `npm run build` | Create a production build (`.next/standalone`) |
| `npm run start` | Serve the production build |

## Avoiding "it works on my machine"

- **Use npm.** `package-lock.json` is the lockfile Docker builds from. If you add or upgrade a package, commit `package.json` and `package-lock.json` together.
- **Install with `npm ci`, not `npm install`.** `npm ci` gives you exactly what's in the lockfile.
- **Check in Docker before pushing.** If `docker compose up --build` fails, the build is broken for everyone, even if it works on your machine.
- **Don't commit `.env*` files.** They're git-ignored. Pass runtime configuration to the container with `docker run -e KEY=value` or with `environment:` in `docker-compose.yml`.

## Known cleanup items

- `next.config.ts` is **not loaded**. Next.js picks `next.config.mjs` first, so put config changes in the `.mjs` file. You can delete the `.ts` file.
- `src/app/` is the leftover `create-next-app` starter. The root `app/` directory takes priority, so `src/app/` is never served.
- `pnpm-lock.yaml`, `pnpm-workspace.yaml`, and the `packageManager: pnpm` field in `package.json` are out of date. The pnpm lockfile still pins Next 16.3.3.
- `typescript.ignoreBuildErrors` is `true` in `next.config.mjs`, so type errors don't fail the build.

## Deployment

The Docker image runs anywhere containers run, including AWS App Runner, ECS/Fargate, and EC2. It listens on port `3000`. You can change this with the `PORT` environment variable.
