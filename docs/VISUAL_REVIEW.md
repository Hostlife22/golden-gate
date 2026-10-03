# Visual review

Date: 2026-10-03. Screenshots were captured from the production build, opened, and inspected; camera-flight completion was awaited before final portrait/short-window captures. [Reference study](REFERENCE_STUDY.md) separates source dimensions from drawing approximations.

## Reviewed evidence

| Capture                                         | Observations                                                                                                                                                   |
| ----------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Hero / Golden Hour](artifacts/hero-golden.png) | Both towers, sagging main and side cables, water, uneven northern shoreline, and southern approach read together; warm bridge against cooler water             |
| [Hero / Clear Day](artifacts/hero-clear.png)    | Cooler and brighter light; stable local assets; main structural silhouette remains clear                                                                       |
| [Hero / Coastal Fog](artifacts/hero-fog.png)    | Distant terrain recedes; soft low banks have world positions and heights; tower crowns remain readable above the layers                                        |
| [Bay Panorama](artifacts/panorama.png)          | San Francisco lies southeast on the southern peninsula; the bay widens east; Alcatraz is small and correctly distant; northern headlands occupy the foreground |
| [Waterline](artifacts/waterline.png)            | Low eye height demonstrates clearance, both towers, and reflected structure; camera is outside the vessel corridor                                             |
| [Tower Detail](artifacts/tower-detail.png)      | Stepped/fluted shafts, portal openings, connection plates, paired hangers, actual-scale vehicles, walkway and truss details                                    |
| [North Overlook](artifacts/north-overlook.png)  | Elevated Marin viewpoint looks south to the bridge and geographically placed city                                                                              |
| [South Shore](artifacts/south-shore.png)        | South-side view emphasizes tower height and north-shore terrain                                                                                                |
| [Phone](artifacts/mobile.png)                   | Portrait Hero includes both towers; weather, perspective, playback, and compass remain reachable                                                               |
| [Phone settings](artifacts/mobile-settings.png) | Separate modal scroll area; native sliders/select; accessible close target                                                                                     |
| [Short desktop](artifacts/short-window.png)     | 1280×500 keeps controls inside the viewport and reduces header/copy height                                                                                     |

[Motion recording](artifacts/observatory-motion.webm) shows the shared live scene, Hero → Waterline → Tower Detail flights, a weather transition, pause/resume, passing traffic/vessels, and evolving water/wakes. The recording was inspected using [sampled video frames](artifacts/motion-review.jpg); no prerecorded imagery is substituted for the application scene.

The [deployed Hero capture](artifacts/deployed-hero.png) was also opened and inspected after the graphics refinement, subsequent decomposition and successful publication at `/golden-gate/`; it confirms the same scene and controls load from the real public URL. [Deployment evidence](artifacts/deployment.json) records the checked revision and resource results.

## Corrections made during review

- Corrected the bridge bearing from a preliminary approximation using the actual OSM roadway footprint.
- Reduced the overly high Hero view and created a dedicated portrait composition that retains both towers.
- Fixed render-target uniform cloning and supplied the matching reflection projection matrix.
- Reduced and filtered reflection strength; changed the opaque orange reflection deck into a thin roadway and separate girders.
- Added land-mask-derived coastal water color/foam and restrained procedural highlights.
- Moved Waterline outside the vessel lanes after an early capture put the eye beside a cargo deck.
- Replaced solid road-blocking anchorages with side pylons and grounded foundations, leaving the roadway open.
- Corrected the lower hanger ends to meet the upper stiffening girder and used 3 m sidewalk widths.
- Added tower fluting and connection plates; retained the actual span/height scale and small traffic dimensions.
- Increased the spatial fog bank height/density while keeping the tower crowns above it.
- Added lower-detail distant city blocks beyond the initial near-neighborhood rectangle.
- Awaited flights after resize so mobile and short-window evidence depicts completed presets.

## Graphics refinement

The initial plain-material scene is preserved in [before Hero](artifacts/before-hero-golden.png), [before Tower Detail](artifacts/before-tower-detail.png) and [before performance](artifacts/before-performance.json). The current captures above show the graphics refinement requested after the first deployment.

- Added local CC0 photographic albedo, normal and roughness maps for soil/grass, cliffs/boulders, asphalt and concrete, with linear data maps and bounded anisotropy.
- Replaced a coarse terrain mesh with 26 m / 17 m near spacing and continuous multi-scale terrain noise; steeper coastal profiles expose textured rock.
- Replaced cone trees and box rocks with trunks, asymmetric merged crowns, scrub clusters and irregular boulders.
- Added rounded tower plate/foundation edges, near-view rivets, more legible paint highlights and textured road surfaces.
- Replaced large residential slabs with terraced footprints, courtyard space, window patterns, roofs and rooftop equipment; refined the Salesforce crown.
- Added rounded car bodies, glass canopies and wheels; curved extruded ship hulls, container edges, cabin glazing and a bowed cloth sail.
- Replaced the flat sky gradient with analytical daylight/cloud scattering, generated environment lighting and matching sky reflection on water.
- Fixed visible texture repetition, an overexposed first sky pass, distant ripple aliasing and overly white tiled distant city blocks found in intermediate captures. Reduced distant normal detail and used a cheaper dominant projection in Balanced after an intermediate frame-time regression.

## Decomposition review

Nine frozen reduced-motion frames compare the original graphics revision with the decomposed implementation: all three weather presets, Panorama, Waterline, Tower Detail, High quality, portrait Hero and portrait settings. The largest RGB channel difference is 2/255; no pixel exceeds the 10/255 comparison threshold. Neither capture run reported browser errors. The geometry, materials and layout remain visually equivalent; small settling-time differences in environment lighting account for the residual color differences. The reference PNGs were inspected locally and the numerical evidence is saved in [refactor-visual-comparison.json](artifacts/refactor-visual-comparison.json). The live deployment was checked separately after publication.

## Remaining visual approximations

The overall map relationships and verified bridge ratios are consistent, but this is an architectural interpretation. Natural Earth generalization produces simplified coves and some tens-to-hundreds-of-metres shoreline offsets near the bridge. Terrain is a seeded height field, not scanned or surveyed ground. Terrain color/material maps are generic CC0 scans rather than scans of these shores. Trees, scrub and boulders remain economical procedural instances. The city is visibly schematic, with regular near blocks and merged distant massing; only two named downtown silhouettes have explicit locations. The Alcatraz perimeter/cellhouse and Fort Point massing are simplified.

Main cable sag, portal band locations, leg plate profiles, anchorages, approach curvature, railings, lamps, and foundation footprints are illustrative. Paired suspenders are slightly enlarged for readability. The northern foundation intersects generalized land rather than a precisely modeled shoreline.

Planar reflection only renders the bridge proxy, combined with the generated sky environment. It remains approximate and can soften into visible low-resolution shapes at grazing angles, especially Balanced; land, city, moving traffic/ships, and local fog are absent from the mirror pass. Water uses low swell and analytical normals with stylized coastal shading, not measured tides/currents. Fog consists of economical soft spatial layers, so oblique views can reveal a bank-like layered appearance rather than natural volumetric scattering. There is no live weather, AIS, real-time road management, cinematic tour, or Blue Hour preset.
