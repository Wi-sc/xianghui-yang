# Xianghui (Sean) Yang — Personal Homepage

A fast, single-page personal homepage for a computer-vision researcher, built as a
terminal / geek-themed SPA. Designed to be information-dense, minimal, and a little
playful — with a few easter eggs for fellow hackers.

> Senior Research Scientist @ Tencent · First author of **Hunyuan3D** · 3D Generation · Foundation Models · Computer Vision

## Tech Stack

- **React 18** + **TypeScript**
- **Vite 5** (build / dev server)
- **Tailwind CSS 3**
- Zero runtime dependencies beyond React — no UI kit, no tracker, no cookies.

## Sections

`about` · `research interests` · `publications` (22 papers, filterable) · `education` · `experience` · `tech stack` · `contact`

## The terminal

Press `` ` `` or `⌘K` / `Ctrl+K`. It is a real (if small) POSIX-flavoured shell
backed by a virtual filesystem in [`src/shell.ts`](src/shell.ts), generated from
`data.ts` — so the shell can never disagree with the page.

```bash
ls                    # about.md  publications/  research/  projects/  cv.pdf …
cd research && ls     # paths, .. and ~ all resolve
cat about.md          # any file
cat papers.bib        # all 22 entries as BibTeX
tree                  # the whole filesystem
open cv.pdf           # symlinks open in a new tab
grep hunyuan          # search titles, authors and venues
find mesh             # locate files by name
echo $MOTTO           # env vars: USER, EMAIL, ROLE, ORG, MOTTO …
ls -l                 # flags are parsed
```

`Tab` completes commands **and** paths (longest common prefix, listing
ambiguous matches). `↑`/`↓` walks history, `^L` clears, `^C` cancels.
Bare nouns such as `papers` are deliberately *not* commands — they answer with
`command not found` plus the correct form, e.g. `Did you mean: cat papers.bib`.

## Window controls

The red/amber/green dots are functional, not decorative:

| | Title bar | Terminal |
| --- | --- | --- |
| ● red | hide the bar (a "reopen" pill appears) | close |
| ● amber | collapse to a slim bar | collapse to the title bar |
| ● green | native fullscreen | enlarge / restore |

Double-clicking the terminal's title bar also zooms it.

## Easter Eggs

| Trigger | Effect |
| --- | --- |
| `m` | Toggle Matrix rain |
| `↑ ↑ ↓ ↓ ← → ← → b a` | Konami code — the sequence is printed in the footer status bar and lights up once entered |
| `sudo`, `42` | try them |

## Local Development

```bash
npm install
npm run dev      # http://localhost:5173/xianghui-yang/
```

## Build

```bash
npm run build    # outputs to ./dist
npm run preview  # preview the production build
```

## Deployment

Hosted on **GitHub Pages** as a project site at **https://wi-sc.github.io/xianghui-yang/**
(repository: `xianghui-yang`). Every push to the default branch triggers the
[`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) workflow, which builds the
site with Vite and publishes `./dist`.

Because a project site is served from `/<repo-name>/`, the Vite `base` is set to
`/xianghui-yang/` in `vite.config.ts`. If you rename the repo, update `base` to match.

> One-time setup: in the repository **Settings → Pages**, set **Source** to **GitHub Actions**.

## Editing Content

All content lives in [`src/data.ts`](src/data.ts) — profile, links, research interests,
education, experience, publications, news, and the tech stack. No need to touch the
layout to update your CV.

- Replace `public/matri_profile.png` with your photo, then run `node scripts/ascii.mjs` to
  regenerate the ASCII portrait.
- Replace `public/CV.pdf` with your CV.
