# Architecture

The static Vite application separates commands in React from mutable rendering and simulation. TypeScript is strict throughout; there is no backend or asset-fetch dependency at runtime. A lazy-loaded scene chunk follows the lightweight app/UI shell. Assets and font fallbacks load from the deployed Vite base.

## Shared state

`app/state.tsx` provides declarative settings and a single runtime object. `SimulationClock` owns elapsed visual time and the speed-scaled traffic/vessel time. The frame loop clamps stalls to 50 ms, pauses on explicit pause or hidden tabs, and updates transforms outside React state. This prevents large resume jumps; during severe sustained low frame rates movement slows rather than skipping across the scene. Camera movement and weather commands remain available while animation is paused.

Frame priorities establish the order: clock → weather → camera flight/collision guard → distance detail visibility → reflection pass → main render. Colors, fog, exposure, and light positions exponentially approach the chosen weather target from their current state, so rapid re-selection cannot jump back to a stale preset. The current timer also drives wave displacement, surface normals, wakes, weak vessel roll, clouds, and spatial fog density variation.

## Coordinates and bridge

`data/bridge.ts` stores common span, width, height, deck, and cable parameters; `data/geography.ts` defines origin, projection, and landmark locations. Bridge-space +Z points south along the rotated bridge axis. `bridgeToWorld` / `worldToBridge` are exact inverse planar rotations. All geographic context uses uniform world scale.

The bridge has segmented/fluted tower legs, horizontal portals, caps and connection plates, main/side cable curves, paired instanced hangers, stiffening side trusses and cross beams, thin asphalt, sidewalks, railings, lane marks, lamps, approach piers, and open-road anchorages. `cableHeight` and `deckHeight` define attachments centrally. Catmull–Rom tubes sample the analytical cable profile. Geometry tests verify endpoints and hanger attachment heights. Fine tower plate details and paired hangers disappear beyond their distance thresholds; the tower silhouette, deck, and main cables remain.

`Instances` writes a shared geometry's instance matrices and optional colors once in a layout effect. Cars use two dynamic instanced meshes, reuse transform scratch objects, and sample a deterministic route. There are no thousands of individual React building, tree, or fastener components.

## Terrain and city

Clipped Natural Earth polygons supply the land mask. A nonuniform indexed grid gives the near bridge zone roughly 45 m spacing and distant terrain roughly 240 m spacing. Underwater vertices stay below an opaque water surface. Shore distance shapes the coastal slope and rock-to-grass color gradient. Land height uses deterministic hill kernels and ridges rather than imported DEM data; it must not be treated as elevation evidence.

Buildings follow aligned neighborhood grids, downtown height falloff, and the land mask. Distant merged blocks continue the southern peninsula at lower detail. Only two named tower silhouettes are positioned explicitly. City roofs are limited to nearer blocks. Vegetation and small shoreline rocks are instanced and seeded. The small Alcatraz perimeter is illustrative because the source's global-scale data omits it.

## Water and reflection

A custom opaque ShaderMaterial combines low-amplitude geometric swell, three smaller analytical normal-wave scales, angle-dependent Fresnel reflection, roughened sky response, fine ambient highlights, procedural color patches, shoreline proximity color, foundation foam, and a restrained bridge shadow proxy. A cached 256² byte field of distance to the actual land mask softens coastal color and foam; it is not bathymetry. It uses depth testing and no deep-water alpha blending, avoiding transparent sea-floor artifacts.

The planar reflection uses a dedicated scene containing simplified towers, main cables, concrete piers, and roadway. A mirrored perspective camera and oblique near clip plane render to a half-float target: **384² Balanced / 768² High**. The shader uses the matching projection matrix and wave-normal distortion, then filters and blends the result at restrained Fresnel strength. This is one small proxy pass per frame, not a complete second city render. It excludes vehicles, ships, shoreline, foliage, detailed trusses, and local fog; this limits fidelity, especially at grazing angles. Render targets, custom materials, textures, and geometries have explicit cleanup on quality changes and unmount.

Wakes are narrow procedural ribbon pairs sampled backward along each ship's route, widened and faded by age, with a subtle animated foam mask. They are not fluid dynamics or an accumulated wake simulation. Changing speed to zero hides the wake. Their shader time and route sampling both freeze on pause.

## Atmosphere and cameras

Distance fog is complemented by 31 soft world-space fog patches with an explicit low-altitude density falloff, local edges, gentle drift, and camera-facing orientation. Tower tops remain above the low bank. This economical layered method is spatial but does not solve volumetric multiple scattering. The sky shader interpolates zenith/horizon color and slow cloud variation; weather sunsets are illustrative.

The camera rig interpolates position, target, and FOV, with an aerial clearance arc, per-frame terrain/water height checks, and bridge collision guards. Native OrbitControls input immediately cancels a flight and switches to Free Orbit. Presets change composition for portrait Hero. Reduced-motion camera moves finish immediately. Free-camera panning and zoom remain bounded; near-camera collisions use approximate solids rather than a full navigation mesh.

## UI, errors, and validation

Global style tokens define fonts, colors, spacing, radii, safe dimensions, and stacking levels. Shared controls provide focus, labels, touch targets, and mode state. The dialog traps focus and scrolls independently from the canvas. The UI can be restored with H or a persistent button. Editable elements ignore global hotkeys.

WebGL 2 is checked before mounting; render errors and context loss lead to a recovery view. Local resources avoid external asset failure paths, and a loading status remains visible until the lazy scene has mounted. Browser validation records missing-resource and console errors from the production build.

Opt-in diagnostics expose a read-only snapshot with simulation time, camera position, current weather, and rolling frame-interval samples. `scripts/capture.mjs` stores actual renderer identity and measured intervals alongside screenshots and video. These are observed RAF frame intervals, not GPU timer-query timings or a cross-device performance guarantee. Unit and browser validation are documented separately in [VALIDATION.md](VALIDATION.md).
