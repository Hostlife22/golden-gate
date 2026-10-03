# Validation

Date: 2026-10-03. Checks run against the static production build at `/js/`, not just Vite development. Detailed visual observations are in [VISUAL_REVIEW.md](VISUAL_REVIEW.md).

## Local checks

| Check                           | Result / evidence                                                                                        |
| ------------------------------- | -------------------------------------------------------------------------------------------------------- |
| Strict TypeScript               | `npm run typecheck`; no `any` or suppressed type errors in project sources                               |
| ESLint                          | `npm run lint`                                                                                           |
| Prettier                        | `npm run format:check`                                                                                   |
| Geometry and simulation         | 7 Vitest tests pass                                                                                      |
| Production browser behavior     | 6 Playwright scenarios pass; Chromium with ANGLE Metal on macOS                                          |
| Static production bundle        | `npm run build`; relative asset loading respects `/js/`                                                  |
| Combined fast check             | `npm run check`: format → lint → types → unit tests → production build; excludes E2E                     |
| Browser errors / missing assets | Screenshot capture records `errors: []`, `missing: []` in [performance.json](artifacts/performance.json) |

The Vitest suite validates the published metric dimensions, finite transforms, inverse coordinate rotation, continuity and endpoints of cable profiles, hangers touching the corresponding deck/cable heights, deterministic seeds, lane spacing across wraps, full hull footprints remaining in water, tower clearance, vessel separation, and common clock behavior under pause/visibility/stalls.

Playwright covers all preset flights, positive camera height, pause and resume, free orbit on pause, manual flight interruption, rapid weather changes, keyboard-edited sliders, hotkeys, hide/restore, dialog closing, portrait overflow, ≥44 px control heights, a short desktop viewport, reduced-motion startup, WebGL capability fallback, and recovery after actual `WEBGL_lose_context`. Hidden-tab behavior is exercised by the visibility event with a controlled `document.hidden` value; the clock unit test also checks a large resumed delta.

Desktop viewport for functional tests: 1000×720. Portrait: 390×844. Short desktop: 1280×500. Captures additionally use 1440×1000 and contain Hero under all three weather modes, Panorama, Waterline, Tower Detail, both shore views, mobile controls, mobile settings, and the short window.

## Performance method

Machine: MacBook Pro, Intel Core i7-9750H @ 2.60 GHz, macOS/Darwin 25.6.0, AMD Radeon Pro 5300M as reported by `WEBGL_debug_renderer_info`. Browser: Playwright Chromium, headless, `--use-angle=metal --enable-gpu`. The high-performance context selects the Radeon GPU; a separate capability probe also found Intel UHD Graphics 630 available.

Measured at 1440×1000, device scale/DPR 1. Balanced has a 384² reflection target and 1024² shadow map; High has 768² and 2048². The app caps actual device DPR at 1.25 Balanced / 1.75 High. Measurements below use 90 warmed-up RAF intervals per mode, without video recording. These are frame intervals, not isolated CPU/GPU render time.

| View and preset          | Quality  | Median interval | p95 interval |
| ------------------------ | -------- | --------------: | -----------: |
| Hero / Golden Hour       | Balanced |         16.6 ms |      17.6 ms |
| Hero / Coastal Fog       | Balanced |         16.7 ms |      17.6 ms |
| Panorama / Clear Day     | Balanced |         16.7 ms |      17.4 ms |
| Waterline / Clear Day    | Balanced |         16.7 ms |      17.3 ms |
| Tower Detail / Clear Day | Balanced |         16.7 ms |      17.4 ms |
| Waterline / Clear Day    | High     |         16.7 ms |      17.7 ms |

Raw measurements, renderer identity, and capture timestamp are saved in [performance.json](artifacts/performance.json); if captures are regenerated, that file is authoritative. Renderer counts include roughly 345–357k main-pass triangles and 77–90 main-pass draw calls in this capture. The proxy reflection has an additional bounded small pass. No stable 60 FPS claim is made across devices or higher DPR.

An initial Chromium launch fell back to software Vulkan SwiftShader and produced slow frame intervals, including >1 s startup frames and a browser-suite timeout. Those runs are not presented as hardware measurements. Enabling the available Metal renderer resolved that test-environment bottleneck. Low-power phones, software rendering, thermally throttled systems, browsers other than Chromium, and high-DPR monitors have not been physically profiled. Mobile checks use browser emulation rather than a real phone.

## CI and deployment

The actual repository is [Hostlife22/js](https://github.com/Hostlife22/js), default branch `main`, with existing workflow-based GitHub Pages enabled. `base: '/js/'` is applied to production only. Fast CI runs on push/PR. E2E has a separate workflow triggered only by `workflow_dispatch`. The Pages workflow listens for successful CI on a push to `main`, checks out `workflow_run.head_sha`, builds that exact revision, and deploys the static artifact.

Production deployment verification is recorded below after publication. No backend, API key, externally fetched runtime map, or CDN font is needed.

## Practical limitations

Natural Earth is a global-scale coastline source, not a local shoreline survey; no DEM or bathymetry is used. Fine engineering plates and cable sag are approximated. Reflections exclude distant land/city and moving objects. Fog uses depth-tested world-space layers instead of a full volumetric solver. Vessel wakes are analytic ribbons rather than hydrodynamics. Camera collision guards use simple solids and a sampled terrain-height function. Formal accessibility certification, real-phone tests, and a multi-browser/GPU matrix were not performed.
