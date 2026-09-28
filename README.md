# Kita Malaysia

An interactive Malaysian cultural explorer built with **Next.js 16, React 19, TypeScript, and Three.js**.

## Run locally

Requires Node.js 22 or newer.

```sh
npm ci
npm run dev
```

Open the address printed in the terminal (normally http://127.0.0.1:3000).

```sh
npm run typecheck
npm run build
```

The production build exports the website to `out/`. Upload that folder to a static host to publish it. No database, account system, API keys, or backend service is required.

## Included

- Original Three.js miniature landscape with orbit, pinch/scroll zoom, reset, animated clouds and a kite, selectable landmarks, and labels.
- Six hardcoded cultural stories: Kuala Lumpur, George Town, Melaka, Kelantan, Sabah, and Sarawak.
- Five-question quiz with feedback, scoring, retry, and best-score persistence.
- Six collectible passport stamps saved to this browser's local storage, with a confirmed reset flow.
- Mobile layouts, native accessible dialogs, keyboard controls, reduced-motion support, and a readable fallback when WebGL is unavailable.
- Licensed, locally served images; source and attribution links in the website.
- Optional browser WebMCP actions for opening a story and reading current progress.

## Edit content

- `lib/destinations.ts`: stories, facts, links, and questions.
- `lib/credits.ts`: photo credits and licenses.
- `components/Explorer.tsx`: explorer interface, quiz, story reader, and passport.
- `components/MalaysiaScene.tsx`: original Three.js geometry and interactions.
- `app/globals.css`: appearance and responsive styles.

The landscape is illustrative, not geographically accurate. The KL photo is a historical 2007 skyline. Fonts are loaded from Google Fonts with local system-font fallbacks. All story images are bundled locally.

## Competition use

This implementation was substantially generated with AI assistance. It must not be described as complying with a 50% AI cap without the organisers' assessment. Confirm how they measure AI contribution before entering. Keep a truthful development log and record any subsequent human contributions.

No registration, payment, or competition submission has been made.
