# Super Ages — Frontend Demo

A frontend-only demo of the Super Ages corporate website, private investor portal and administrator dashboard. All data is fictional and every interaction is simulated in the browser (state is kept in `localStorage`).

## Run it

```bash
npm install
npm run dev            # local development at http://localhost:5173
npm run build          # static site in dist/ (deploy to any static host or VPS)
npm run build:single   # one self-contained HTML file in dist-single/
```

The app uses hash routing (`/#/portal/dashboard`), so it works from any static host without server rewrites.

## Stack

Vite, React 18, TypeScript, Tailwind CSS, React Router, Recharts, Lucide icons.

## Where things live

| Path | What it holds |
|---|---|
| `tailwind.config.js`, `src/styles/index.css` | Brand palette (exact hex values), typography and design tokens |
| `src/assets/logo.png` | Official logo, cropped from the supplied file with colours unchanged |
| `src/data/mock.ts` | All demo records: investors, projects, milestones, updates, decisions, messages, documents |
| `src/data/types.ts` | Data shapes a future API should return |
| `src/data/images.ts` | Every photograph, referenced by key |
| `src/store/DemoStore.tsx` | Simulated backend: actions, persistence, toasts |
| `src/components/ui/*` | Buttons, badges, fields, modals, toasts, lightbox, timeline, chart, update cards |
| `src/pages/site/*` | Public website |
| `src/pages/investor/*` | Investor portal |
| `src/pages/admin/*` | Administrator dashboard |

## Replacing photography

Edit `src/data/images.ts`. Point each key at a real Super Ages photograph (put files in `public/photos/` and use `./photos/name.jpg`). If an image cannot load, a branded placeholder with the intended subject is shown instead.

## Demo controls

- `/#/portal` is the demo entry screen (investor or administrator).
- The sidebar has **Switch view**, **Reset demo data** and a link back to the public site.

## Connecting a backend later

Replace the functions in `DemoStore.tsx` with API calls that return the shapes in `types.ts`. UI components read only from the store.
