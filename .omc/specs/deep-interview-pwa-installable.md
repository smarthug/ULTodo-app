---
name: pwa-installable
description: Make ULTodo an installable PWA with web manifest, Workbox service worker (precache + runtime), SVG/PNG icons, iOS support, and auto-update behavior
type: brownfield
status: PASSED
ambiguity: 0.20
threshold: 0.20
generated: 2026-04-29
rounds: 1
---

# Spec: Installable PWA

## Goal
Convert the Vite SPA into a standard installable PWA. After implementation, users on Chrome/Edge/Safari can install ULTodo to their device, launch it as a standalone app, and continue using it offline (data already lives in IndexedDB; new requirement is to cache the static asset bundle so cold-start succeeds without network).

## Constraints

- **Plugin**: use `vite-plugin-pwa` (Workbox-based, de facto standard)
- **Update strategy**: `registerType: 'autoUpdate'` — service worker auto-applies new versions on next visit, no in-app prompt UI for v1
- **Install UI**: rely on browser-native install affordance (Chrome address bar, iOS "Add to Home Screen"). No custom in-app install banner for v1
- **Icons**: derive from existing `public/favicon.svg`. The manifest must include at minimum: 192×192 PNG, 512×512 PNG (one as `purpose: "any"`, one as `purpose: "maskable"` if generation supports it), and the SVG itself for vector-capable browsers. iOS requires a 180×180 `apple-touch-icon.png`
- **Theme color**: `#E8E4DC` (paper background, matches the existing app shell — verified in `src/styles/tokens.css` and `index.html` CSS body background)
- **Background color**: `#E8E4DC` (same paper tone; eliminates flash on launch)
- **start_url**: `/today` (matches the app's default landing route per `src/app/router.tsx`)
- **scope**: `/`
- **display**: `standalone`
- **lang**: `en` (default UI language; the app has runtime i18n toggle but the manifest reflects initial bundle)
- **No new runtime dependencies** other than `vite-plugin-pwa` (devDep) and its peer `workbox-window` (already pulled in transitively)
- **No code-splitting changes**; existing single-bundle build stays
- **No push notifications, no Background Sync, no Web Share Target**

## Non-Goals

- Custom in-app install banner (deferred — `Phase 2 Polish`)
- Custom update prompt with skip-waiting behavior
- Push notifications
- Web Share Target (receiving shares from other apps)
- Periodic Background Sync
- Native packaging (Tauri, Capacitor) — separate path
- App Store / Play Store distribution
- Offline-first runtime cache for *external resources* — fonts come from Google Fonts; we will runtime-cache them but not require them as a hard offline requirement
- Workbox routing for API calls (no API exists — IndexedDB is the only data layer)

## Acceptance Criteria

### Setup & build
- [ ] `vite-plugin-pwa` added to `package.json` devDependencies
- [ ] `vite.config.ts` registers the plugin with `registerType: 'autoUpdate'`, manifest config, and Workbox config
- [ ] `npm run build` produces `dist/manifest.webmanifest`, `dist/sw.js`, `dist/workbox-*.js`, and the configured icon files
- [ ] `npm run lint` passes
- [ ] Bundle size grows by ≤ 30 KB gzipped (Workbox runtime adds ~15 KB, plugin overhead is ~5 KB)

### Manifest
- [ ] `manifest.webmanifest` contains: `name: "ULTodo"`, `short_name: "ULTodo"`, `description`, `theme_color: "#E8E4DC"`, `background_color: "#E8E4DC"`, `display: "standalone"`, `scope: "/"`, `start_url: "/today"`, `lang: "en"`, `icons` array with at least 192px and 512px entries
- [ ] `index.html` contains `<link rel="manifest">`, `<link rel="apple-touch-icon">`, `<meta name="theme-color">`, `<meta name="apple-mobile-web-app-capable">`, `<meta name="apple-mobile-web-app-status-bar-style">`

### Icons
- [ ] `public/pwa-192x192.png` exists (rasterized from `favicon.svg`)
- [ ] `public/pwa-512x512.png` exists (rasterized from `favicon.svg`)
- [ ] `public/apple-touch-icon.png` exists (180×180 rasterized from `favicon.svg`)
- [ ] If automatic SVG-to-PNG generation tool is unavailable in the environment, the implementation provides a clear note in the docs section about how to generate them (e.g., `magick favicon.svg -resize 192x192 pwa-192x192.png`)

### Runtime behavior
- [ ] Service worker registered automatically via vite-plugin-pwa's auto-import (`virtual:pwa-register`) — no manual `navigator.serviceWorker.register` call required
- [ ] On first load: SW installs and precaches the static bundle (HTML, JS, CSS, icons)
- [ ] On second load (offline): app opens and shows the existing IndexedDB data — no white screen, no "no internet" page
- [ ] On update deploy: next visit auto-fetches new SW, applies on next reload (or background activate, depending on default Workbox behavior)
- [ ] Workbox runtime caching for Google Fonts (CSS + woff2) with `CacheFirst` strategy — 1-year max age, 30-entry cap

### Browser install verification
- [ ] Chrome / Edge desktop: address bar shows install icon; clicking installs the app to its own window
- [ ] Chrome Android: "Install app" or "Add to Home Screen" prompt appears
- [ ] Safari iOS: "Add to Home Screen" via share sheet works; the resulting icon launches in standalone mode with no Safari chrome
- [ ] Standalone window respects the existing AppShell layout (mobile phone-frame on small viewports, desktop split on large viewports)

## Files Affected

| File | Change |
|---|---|
| `package.json` | Add `vite-plugin-pwa` devDep |
| `vite.config.ts` | Import and configure VitePWA plugin |
| `index.html` | Add manifest link, apple-touch-icon link, theme-color meta, apple-mobile-web-app-* meta tags |
| `src/main.tsx` | Optionally import `virtual:pwa-register` (or rely on plugin auto-injection) |
| `public/pwa-192x192.png` | NEW — 192×192 rasterized icon |
| `public/pwa-512x512.png` | NEW — 512×512 rasterized icon |
| `public/apple-touch-icon.png` | NEW — 180×180 rasterized icon |
| `vite-env.d.ts` or new `src/vite-env-pwa.d.ts` | Reference `vite-plugin-pwa/client` types |

## Technical Notes

- **SVG-to-PNG generation**: macOS has `sips` and `qlmanage`; Linux has `rsvg-convert` / `inkscape` / `magick`. The implementation will try `magick`/`rsvg-convert`/`sips` in that order. If none are available, it will fall back to writing a small Node script using `sharp` (added as devDep) or document manual generation.
- **Workbox config**: precache via `globPatterns: ['**/*.{js,css,html,svg,png,ico,webmanifest}']`, navigation fallback to `/index.html` so deep routes (e.g., `/today` after install) resolve correctly offline.
- **iOS quirks**:
  - iOS does not support `manifest.scope` for install scope; the apple-touch-icon meta must be in `index.html`
  - `apple-mobile-web-app-status-bar-style: black-translucent` to blend with the paper theme
  - Splash screens on iOS would require generating multiple sizes; deferred for v1
- **Update flow**: `registerType: 'autoUpdate'` means the new SW activates immediately on next page load (skipWaiting behavior). No user prompt. This is acceptable because there is no in-flight session state at the SW boundary — IndexedDB is unaffected by SW updates.

## Ontology

| Entity | Type | Notes |
|--------|------|-------|
| ServiceWorker | runtime | New — registered by vite-plugin-pwa |
| WebManifest | config | New — generated from plugin config |
| PWA Icons | static asset | New 3 files (192/512/apple-touch) + existing favicon.svg |
| Workbox Precache | cache | Generated at build, stores all static assets |
| Workbox Runtime Cache | cache | Google Fonts CacheFirst |
| Update strategy | policy | autoUpdate (silent skipWaiting) |
| Install UX | policy | Browser native — no custom UI for v1 |
