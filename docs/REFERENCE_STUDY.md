# Reference study

Researched on 2026-10-03 before and during modeling. This is a procedural architectural interpretation with verified headline proportions, not a surveyed engineering reconstruction.

## Sources and parameters

The [Golden Gate Bridge District construction statistics](https://www.goldengate.org/bridge/history-research/statistics-data/design-construction-stats/) provide the following inputs. These are metric figures as published by the District, except the suspender spacing converted from feet.

| Parameter                         |  Real dimension | Scene dimension |
| --------------------------------- | --------------: | --------------: |
| Main span between towers          |         1,280 m |             128 |
| Each suspended side span          |           343 m |            34.3 |
| Length including approaches       |         2,737 m |           273.7 |
| Tower above water                 |           227 m |            22.7 |
| Tower above roadway               |           152 m |            15.2 |
| Total bridge width                |            27 m |             2.7 |
| Roadway between curbs             |            19 m |             1.9 |
| Published sidewalk width          |             3 m |     approx. 0.3 |
| Midspan clearance over high water |            67 m |             6.7 |
| Main cable diameter               |          0.92 m |           0.092 |
| Nominal band / suspender spacing  | 50 ft = 15.24 m |           1.524 |
| Each leg at tower base            |       10 × 16 m |         1 × 1.6 |

Road elevation is modeled at 75 m, derived from the two published tower heights. Side trusses occupy the space down toward the 67 m clearance. Local deck camber, tower portal bands, fluting, concrete foundations, anchorages, approach curvature, and lamp spacing are drawing approximations. The main cable midpoint is modeled at 95 m and saddle at 223.5 m; these are illustrative shape parameters rather than certified sag measurements. The cable is a sampled parabolic curve in the main span and a smooth sagging continuation in each side span. Paired hangers use an 18 cm visual diameter (about 2.6× the published 6.8 cm rope diameter) for distant visibility; their lower ends attach inside the upper stiffening-girder band.

[District facts and figures](https://www.goldengate.org/exhibits/facts-and-figures-about-the-bridge/) and [NPS's bridge color discussion](https://www.nps.gov/places/000/why-is-the-golden-gate-bridge-orange.htm) informed the suspension silhouette and subdued International Orange appearance. No photographs, logos, or page text are redistributed.

## Geography and coordinate convention

- Reference origin: latitude **37.8199**, longitude **−122.4785**, chosen near the middle of the bridge.
- One scene unit = **10 m**, everywhere, without distance compression.
- +X east; +Y up; −Z true north. Geographic projection uses 111,320 m per degree latitude and the origin latitude's cosine for longitude, adequate for this local illustrative extent. This is an equirectangular approximation, not a geodetic survey projection.
- Bridge axis: approximately **5.4° west of north**, derived from the straight roadway edges in [OpenStreetMap's bridge footprint](https://www.openstreetmap.org/search?query=Golden%20Gate%20Bridge). The downloaded Nominatim result is preserved in [data/bridge-location.json](data/bridge-location.json), including OSM object identity and licence. A single rotation applies to bridge geometry and its vehicles; vessels, lights, and cameras use world coordinates.
- Main towers are ±640 m from the scene origin along that axis; anchors are ±983 m. The rendered approach road follows slight deterministic curves beyond the suspended structure.

The [Natural Earth 1:10m land polygons](https://github.com/nvkelso/natural-earth-vector/blob/master/geojson/ne_10m_land.geojson) were clipped to longitude −122.62…−122.30 and latitude 37.70…37.97 with `scripts/prepare-coastline.py`. [Terms of use](https://www.naturalearthdata.com/about/terms-of-use/): public domain. The retained 137 vertices establish the peninsula, Marin, bay opening, Angel Island, and Treasure/Yerba Buena area. This data's cartographic scale is **1:10 million**, not a 10-metre coastal survey. Small coves and bridge-adjacent shorelines may differ by hundreds of metres.

[NPS regional maps](https://www.nps.gov/goga/planyourvisit/maps.htm), the [Marin Headlands map, January 2025 edition](https://www.nps.gov/goga/planyourvisit/upload/map-mahe-20250108_508.pdf), and the [Presidio map](https://www.nps.gov/goga/planyourvisit/upload/Pad-Map-9-15_color_print1.pdf) were used to cross-check the north/south shores, headland massing, Presidio location, and Fort Point relation to the southern approach. Map artwork is not embedded in the application.

| Landmark             | Approximate input position (latitude, longitude) | Representation                                                                                                                                   |
| -------------------- | ------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| Fort Point           | 37.8106, −122.4770                               | Small coastal masonry block below southern approach                                                                                              |
| Alcatraz             | 37.8267, −122.4230                               | Schematically traced small island and cellhouse, roughly 4.9 km east of the bridge                                                               |
| Angel Island         | 37.8615, −122.4326                               | Natural Earth perimeter; illustrative elevated landform                                                                                          |
| Salesforce Tower     | 37.7898, −122.3965                               | Rounded/tapered distant tower; 326 m, converted from the [building's official 1,070 ft figure](https://salesforcetower.com/about/)               |
| Transamerica Pyramid | 37.7952, −122.4030                               | Simplified distant pyramid; 260 m from the 853 ft figure in [SF Planning materials](https://commissions.sfplanning.org/cpcpackets/2011.0409.pdf) |

Landmark positions are schematic map readings with local rounding; they are not cadastral footprints. The regular surrounding city blocks do not recreate individual buildings. Alcatraz is absent from the Natural Earth land data and is added at its actual eastward location rather than moved into the foreground. Marin occupies the northern and western channel shore; San Francisco occupies the southern peninsula. Open Pacific water lies to the west, while the bay widens eastward. The scene does not enclose the strait in a rectangular lake.

## Cameras, movement, and light

Hero is southwest of the bridge looking northeast; its portrait composition is adjusted to fit the narrow viewport. Bay Panorama is above the northwest shore looking southeast toward the peninsula and downtown. North Overlook looks southward from elevated Marin terrain. South Shore looks northward from near Fort Point/Presidio. Waterline is west of the central channel, deliberately offset from shipping lanes. Tower Detail examines the southern tower; the remote northern tower remains visible. These are application view names rather than surveyed official overlooks.

The vessel corridor runs roughly west–east, bending gently southward toward the Pacific side. Routes are deliberately parallel and separated. Unit tests sample each complete hull footprint over a full loop against the same land polygons used to build terrain and check distances to both foundations and other vessels. They are visual demonstration routes, not navigation instructions or AIS data. Cargo, ferry, and sailboat are approximately 108 m, 35 m, and 14.5 m long.

Traffic uses fixed three-lane flow per direction, 15 cars per lane, common speed approximately 56 km/h, and deterministic colors/types. This is explicitly separate from any current movable-barrier configuration. Solar presets use a western warm light or a higher daytime light in the same coordinate system; they do not calculate ephemerides for a real date or present live weather.

## Licence boundaries

Original implementation, procedural geometry, and generated captures: MIT © hostlife22. Natural Earth: public domain. OSM footprint/derived bridge alignment: © OpenStreetMap contributors, [ODbL 1.0](https://www.openstreetmap.org/copyright); the saved source remains separately attributed. Government map references are linked rather than reproduced. Font licences are included locally. See [THIRD_PARTY_LICENSES.md](THIRD_PARTY_LICENSES.md).
