# Slime Vibe

Interactive 3D slime toy built with Vite + React + Three.js (@react-three/fiber, @react-three/drei).

## Cursor Cloud specific instructions

- **Single-service frontend-only app** — no backend, database, or external services required.
- Dev server: `npm run dev` (serves on `http://localhost:5173`).
- Build: `npm run build` (output in `dist/`).
- No ESLint or test framework is configured — there are no lint or test commands.
- TypeScript is configured (`tsconfig.json`) but all source files use `.jsx` — `tsc --noEmit` will not check `.jsx` files.
- The app requires a browser with WebGL support for the Three.js 3D scene; headless curl can verify HTTP 200 but not rendering.
- Vite config sets `server.host: true` and `server.allowedHosts: true`, so the dev server is accessible from any hostname/IP.
