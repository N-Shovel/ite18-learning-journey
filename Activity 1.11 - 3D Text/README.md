# Activity 1.11 - 3D Text

**Student:** Nimrod P. Pala, ITE 18-FNHX1
**Course:** ITE-18 Applications Development and Emerging Technologies, Caraga State University
**Instructor:** James Earl D. Cubillas
**Reference:** Bruno Simon, *Three.js Journey*, "Introduction to Three.js" handouts (Part 11)

![Screenshot](screenshot.png)

## What was done

- `FontLoader` loads `helvetiker_regular.typeface.json` from `static/fonts/`.
- `TextGeometry` with the text **'Nimrod P. Pala'**, bevel enabled, centered with `textGeometry.center()` (the manual bounding-box centering is kept as commented code).
- `MeshMatcapMaterial`. A lil-gui dropdown switches between the 8 matcaps.
- **100 donuts** with random position, rotation and scale. Optimized: one `TorusGeometry` and one material shared by the text and every donut.

## How to run

```bash
npm install
npm run dev
```

Then open the URL Vite prints (usually <http://localhost:5173>).
`npm run build` creates a production build in `dist/`.

## Deviations from the handout (current three.js r186)

- Addons (OrbitControls, etc.) are imported from `three/addons/...` instead of `three/examples/jsm/...`.
- `TextGeometry` uses `depth` instead of `height` (renamed in r163).
- Matcap textures are set to `SRGBColorSpace`.

Each deviation is also commented in `src/script.js`.

## Assets

- **Downloaded:** `fonts/helvetiker_regular.typeface.json` + `LICENSE` from the three.js repository `examples/fonts/` (the npm package no longer includes this folder).
- **Downloaded:** `textures/matcaps/1-8.png` from [nidorx/matcaps](https://github.com/nidorx/matcaps) (see `SOURCES.txt`).

## Files

```
src/index.html   canvas.webgl + loads style.css and script.js
src/style.css
src/script.js    the Three.js code
static/          textures / fonts (served from /)
vite.config.js   root: src, publicDir: ../static, outDir: ../dist
```
