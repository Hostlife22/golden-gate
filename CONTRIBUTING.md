# Contributing

Use Node 22 and install with `npm ci`. Keep changes focused and run `npm run check` before opening a pull request. Run `npm run test:e2e` when changing camera input, scene controls, fallbacks, or responsive layout; browser checks are manual in GitHub Actions.

Geometry uses `src/data/bridge.ts` and `src/data/geography.ts`: one uniform ten-metre unit, +X east, +Y up, and −Z north. Record a source and licence in `docs/REFERENCE_STUDY.md` before adding surveyed dimensions or geographic data. Keep illustrative measurements clearly labelled. Preserve deterministic seeds, bounded rendering costs, resource cleanup, reduced-motion behavior, and one simulation clock.

Use shared CSS tokens and `IconButton` for controls. Do not put frame-by-frame transforms in React state. Put new pure geometry or route calculations in testable modules, and verify visible changes in desktop, portrait mobile, and short landscape windows. Include the affected screenshots and state which simplifications remain.

The capture script writes screenshot/video evidence to `docs/artifacts`. Avoid committing intermediate captures or duplicate browser video files. MIT covers this project's code; external data and fonts retain their original licences. Never put tokens or credentials in the client or committed test artifacts.
