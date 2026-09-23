# ITE-18 Activity 1.1–1.5: Three.js

Applications Development and Emerging Technologies. Five Three.js exercises built with **Three.js r148** and **Vite 4**.

**Live demo: https://n-shovel.github.io/activity1-1.7/**

| Activity | Topic | Live | Code |
|---|---|---|---|
| 1.1 | Basic Scene | [Open](https://n-shovel.github.io/activity1-1.7/activity-1-1/) | [script.js](Activity%201.1/src/script.js) |
| 1.2 | Local Server (Vite) | [Open](https://n-shovel.github.io/activity1-1.7/activity-1-2/) | [script.js](Activity%201.2/src/script.js) |
| 1.3 | Transform Objects | [Open](https://n-shovel.github.io/activity1-1.7/activity-1-3/) | [script.js](Activity%201.3/src/script.js) |
| 1.4 | Animations | [Open](https://n-shovel.github.io/activity1-1.7/activity-1-4/) | [script.js](Activity%201.4/src/script.js) |
| 1.5 | Cameras | [Open](https://n-shovel.github.io/activity1-1.7/activity-1-5/) | [script.js](Activity%201.5/src/script.js) |

## What each activity covers

- **1.1 Basic Scene**: the four parts every Three.js scene needs: a scene, an object (red cube mesh), a perspective camera and a WebGL renderer.
- **1.2 Local Server**: the same scene run through Vite. It shows the Three.js version imported from `node_modules` and serves `static/door.jpg` from the site root.
- **1.3 Transform Objects**: position (`set`, `length`, `distanceTo`, `normalize`), `AxesHelper`, scale, rotation with `reorder('YXZ')`, `lookAt`, and a `Group` of three cubes transformed together.
- **1.4 Animations**: a `requestAnimationFrame` loop that doesn't depend on frame rate (`Date.now()` delta time, then `THREE.Clock`), circular motion with `Math.sin`/`Math.cos`, and a GSAP tween.
- **1.5 Cameras**: `PerspectiveCamera` parameters, an `OrthographicCamera` corrected for aspect ratio, custom cursor controls, and `OrbitControls` with damping.

## Run locally

Requires [Node.js](https://nodejs.org/).

```bash
cd "Activity 1.1"
npm install      # first time only
npm run dev      # starts the local server and opens the page
npm run build    # production build in dist/
```

## Repository layout

```
Activity 1.1 … Activity 1.5/   one Vite project per activity (src/ = page + code, static/ = assets)
Activity 1 Starter Pack/       the original starter files from the course
index.html                     landing page for the live site
.github/workflows/deploy.yml   builds all five activities and publishes them to GitHub Pages
STUDY-GUIDE.md                 explanations and review questions for each activity
```

## Deployment

Every push to `main` runs [deploy.yml](.github/workflows/deploy.yml). It builds each activity with Vite, puts each build in its own folder (`/activity-1-1/` … `/activity-1-5/`) next to the landing page, and deploys the result to GitHub Pages.

---

Nimrod P. · Caraga State University
