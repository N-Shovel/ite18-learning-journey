# Three.js Activities: ITE-18

**Student:** Nimrod P. Pala
**Section:** ITE 18-FNHX1
**Course:** ITE-18 Applications Development and Emerging Technologies, Caraga State University
**Instructor:** James Earl D. Cubillas
**Reference:** Bruno Simon, *Three.js Journey*, "Introduction to Three.js" Parts 5-12

Eight separate, self-contained Vite + Three.js projects, one per activity. Each one builds on the previous one, following the handouts.

## Activities

| # | Activity | Topic |
| --- | --- | --- |
| 1.5 | [Cameras](Activity%201.5%20-%20Cameras/) | PerspectiveCamera, OrbitControls with damping, 800x600 canvas |
| 1.6 | [Fullscreen and Resizing](Activity%201.6%20-%20Fullscreen%20and%20Resizing/) | Full-window canvas, resize handling, pixel ratio, double-click fullscreen |
| 1.7 | [Geometries](Activity%201.7%20-%20Geometries/) | BoxGeometry subdivisions, custom BufferGeometry with 50 random triangles |
| 1.8 | [Debug UI](Activity%201.8%20-%20Debug%20UI/) | lil-gui tweaks (elevation, visible, wireframe, color) + gsap spin button |
| 1.9 | [Textures](Activity%201.9%20-%20Textures/) | TextureLoader, LoadingManager, UV transforms, filtering, mipmaps |
| 1.10 | [Materials](Activity%201.10%20-%20Materials/) | All mesh materials (live dropdown), MeshStandardMaterial with door maps, envMap |
| 1.11 | [3D Text](Activity%201.11%20-%203D%20Text/) | FontLoader, TextGeometry, MeshMatcapMaterial, 100 optimized donuts |
| 1.12 | [Go Live](Activity%201.12%20-%20Go%20Live/) | Finished 3D Text project prepared for Vercel deployment (see DEPLOYMENT.md) |

Each folder has its own `README.md` with what was done, a screenshot, and the deviations from the handout.

## How to run an activity

Requires [Node.js](https://nodejs.org) (LTS).

```bash
cd "Activity 1.5 - Cameras"
npm install
npm run dev
```

Open the URL Vite prints (usually <http://localhost:5173>). `npm run build` writes a production build to `dist/`.

## Project layout (same for every activity)

```
Activity X - Name/
├── package.json
├── vite.config.js     root: 'src', publicDir: '../static', build.outDir: '../dist', emptyOutDir: true
├── .gitignore         node_modules, dist, .vercel
├── README.md
├── screenshot.png
├── src/
│   ├── index.html     <canvas class="webgl"></canvas>, loads ./style.css and ./script.js
│   ├── style.css
│   └── script.js
└── static/            textures / fonts (only for activities that need them)
```

## Versions

three **0.186**, vite **8**, lil-gui **0.21**, gsap **3.15**, vercel **62**.

The handouts target an older three.js. Each place where the code deviates (for example `three/addons/...` imports,
`depth` instead of `height` in TextGeometry, no `uv2` for aoMap, physical light intensities, sRGB color textures,
`THREE.Timer` instead of the deprecated `THREE.Clock`) has a short comment in the code.

## Assets

| Asset | Source |
| --- | --- |
| Door textures (`textures/door/*.jpg`) | **Generated** with a Node script (pngjs + jpeg-js), same filenames as the course |
| `checkerboard-1024x1024.png`, `checkerboard-8x8.png`, `minecraft.png` | **Generated** |
| Toon gradients `textures/gradients/3.jpg`, `5.jpg` | **Generated** |
| Matcaps `textures/matcaps/1-8.png` | **Downloaded** from [nidorx/matcaps](https://github.com/nidorx/matcaps) (256px) |
| Environment map `textures/environmentMaps/0/*.jpg` | **Downloaded**: "Park2" by Emil Persson (Humus), from the three.js repo `examples/textures/cube/` |
| Font `fonts/helvetiker_regular.typeface.json` + `LICENSE` | **Downloaded** from the three.js repo `examples/fonts/` |

Screenshots were captured automatically from each running dev server in headless Chrome.

## Making a clean zip for submission

```powershell
powershell -ExecutionPolicy Bypass -File .\make-clean-zip.ps1
```

This creates `Pala_Nimrod_ITE18-FNHX1_ThreeJS_Activities.zip` on the Desktop without the `node_modules`, `dist` and `.vercel` folders.
