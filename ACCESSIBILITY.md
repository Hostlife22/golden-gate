# Accessibility

The observatory offers labelled native buttons, `aria-pressed` mode states, visible focus rings, a skip link, a textual description of the geographic scene, and an announced current view/weather/playback state. The additional dialog traps Tab focus, closes with Escape, restores focus, and scrolls independently. Touch buttons are at least 44 pixels high. The canvas can be focused for arrow-key panning.

Space toggles the common animation clock, R resets the camera, and H restores hidden controls. Hotkeys are ignored in editable fields and native controls. `prefers-reduced-motion` starts the simulation paused, suppresses UI animation, and makes camera presets immediate. Users can explicitly start movement.

If WebGL 2 is unavailable or the rendering context is lost, a text recovery view explains how to retry. App content is provided in English. All display fonts are local, with system fallbacks and `font-display: swap`.

Automated checks cover keyboard commands, reduced motion, touch-sized controls, mobile overflow, dialog closing, low-height windows, and capability fallback. The 3D scene itself is not a full nonvisual geographic explorer; exact geometry, water movement, and visual inspection cannot be conveyed by the current textual description. No formal WCAG certification or screen-reader-device audit is claimed.
