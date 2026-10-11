# Getting Started

This guide takes you from a fresh clone to the app running on <http://localhost:3000>. It should take about 5 minutes.

There are two ways to run the app:

| | **A. Docker** | **B. Local Node.js** |
| --- | --- | --- |
| Best for | Trying the app, checking a build before you push | Day-to-day development |
| You need | Docker | Node.js 24 + npm |
| Hot reload | No (rebuild after each change) | Yes |

If you're not sure which to pick, start with **A**.

---

## 1. Prerequisites

Install **Git** and then the tools for the option you chose:

| Tool | Version | Needed for | Check with |
| --- | --- | --- | --- |
| [Git](https://git-scm.com/downloads) | any | both | `git --version` |
| [Docker Desktop](https://docs.docker.com/get-docker/) | 24+ with Compose v2 | A | `docker compose version` |
| [Node.js](https://nodejs.org/) | **24.x** | B | `node -v` |
| npm | comes with Node | B | `npm -v` |

> **Use npm, not pnpm, yarn, or bun.** The project is locked with `package-lock.json`, and other package managers will install different versions.

> **Windows:** make sure Docker Desktop is **running** (whale icon in the tray) before you run any `docker` command.

## 2. Clone the repo

```bash
git clone https://github.com/Chibao78-code/AWS-Study-Community-Hub.git
cd AWS-Study-Community-Hub
```

## 3A. Run with Docker

```bash
docker compose up --build
```

The first build downloads the Node image and dependencies, so it takes a few minutes. Later builds are faster because Docker caches the layers.

When you see `✓ Ready`, open <http://localhost:3000>.

**Useful commands**

```bash
docker compose up --build -d   # run in the background
docker compose logs -f         # follow the logs
docker compose down            # stop and remove the container
```

After you change code, run `docker compose up --build` again. The container serves a production build, so there's no hot reload.

## 3B. Run with local Node.js

```bash
npm ci        # install exactly what's in package-lock.json
npm run dev   # start the dev server with hot reload
```

Open <http://localhost:3000>. Edits to files in `app/` and `components/` show up in the browser immediately.

To test a production build locally:

```bash
npm run build
npm run start
```

## 4. Check that it works

- <http://localhost:3000> shows the **AWS Community // Event Hub** home page with the Member / Instructor / Admin role switcher.
- <http://localhost:3000/login> shows the login page.

All data is mock data for now. There's no backend, database, or `.env` file to set up.

## 5. Where to make changes

| You want to change... | Edit |
| --- | --- |
| Home page / dashboard | `app/page.tsx` |
| Login page | `app/login/page.tsx` |
| Site title, metadata, fonts | `app/layout.tsx` |
| Colors and theme | `app/globals.css` |
| Shared UI components | `components/ui/` |
| Next.js config | `next.config.mjs` (**not** `next.config.ts`, which isn't loaded) |

Ignore `src/app/`. It's a leftover starter template and isn't served.

## 6. After you pull new changes

```bash
git pull
npm ci                       # if package-lock.json changed (option B)
docker compose up --build    # option A
```

## 7. Before you push

1. If you added or upgraded a package, commit **both** `package.json` and `package-lock.json`.
2. Run `docker compose up --build` and check that the app starts. If it fails in Docker, it will fail for your teammates too.
3. Don't commit `.env*` files, `node_modules/`, or `.next/`. They're already in `.gitignore`.

---

## Troubleshooting

**`port is already allocated` / `EADDRINUSE: address already in use :::3000`**
Something else is using port 3000. Stop it, or run on another port:
- Docker: change `"3000:3000"` to `"3001:3000"` in `docker-compose.yml`, then open <http://localhost:3001>.
- Node: `npm run dev -- -p 3001`

**`Cannot connect to the Docker daemon` / `error during connect`**
Docker Desktop isn't running. Start it and wait until it says "Engine running".

**`npm ci` fails with "package.json and package-lock.json are not in sync"**
Someone changed `package.json` without updating the lockfile. Run `npm install` and commit the updated `package-lock.json`.

**`Can't resolve 'shadcn/tailwind.css'`**
1. Check that `package.json` has `"shadcn": "^4.11.0"` or newer. Version 1.x doesn't include this file. If it's wrong, fix it and run `npm ci`.
2. If the version is correct and you still get the error, your dev server is using an old cache from before the fix. Stop it (Ctrl+C), delete `.next`, and start it again:
   ```bash
   rm -rf .next                  # PowerShell: Remove-Item -Recurse -Force .next
   npm run dev
   ```
   **Restart `npm run dev` after any `npm install` or `npm ci`.**

**Strange build errors after switching branches**
Delete the build cache and reinstall:
```bash
rm -rf .next node_modules     # PowerShell: Remove-Item -Recurse -Force .next, node_modules
npm ci
```
In Docker, rebuild without the cache: `docker compose build --no-cache`.

**`node -v` shows something other than 24.x**
Install Node 24, or use a version manager such as [nvm](https://github.com/nvm-sh/nvm) or [nvm-windows](https://github.com/coreybutler/nvm-windows) (`nvm install 24 && nvm use 24`). Or use the Docker option, which doesn't depend on your local Node.

**Still stuck?**
Open an issue and include your OS, `node -v` / `docker --version`, the command you ran, and the full error output.
