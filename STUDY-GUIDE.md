# Activity 1.1–1.5 Study Guide

This file is for you, not for submission. The folders to upload are `Activity 1.1` … `Activity 1.5`.

Run any activity:

```bash
cd "Activity 1.3"
npm install      # only the first time (node_modules is already installed here)
npm run dev      # opens the page in your browser
```

Open the browser console (F12) for the `console.log` output in 1.2 and 1.3.

---

## Activity 1.1: Basic Scene

**What the code does**
- `index.html`: the placeholder text was replaced with `<canvas class="webgl">`, where Three.js draws.
- **Scene**: the container for everything.
- **Object**: a `Mesh` combines a `BoxGeometry(1, 1, 1)` (the shape) with a `MeshBasicMaterial` (red, not affected by lights), and is added to the scene.
- **Camera**: `PerspectiveCamera(75, 800/600)` with a 75° vertical view and an aspect ratio matching the canvas. It's moved to `z = 3`, because everything starts at (0,0,0) and the camera would otherwise be inside the cube.
- **Outline** (added in every activity): `EdgesGeometry` takes the cube's geometry and keeps only its edges, and `LineSegments` with a white `LineBasicMaterial` draws them as lines. It's added with `mesh.add(outline)`, so it's a *child* of the cube and moves, scales and rotates with it automatically.
- **Renderer**: `WebGLRenderer` draws onto our canvas. `setSize(800, 600)` sets the canvas size and `render(scene, camera)` draws once.

**Likely questions**
1. *What are the 4 elements every Three.js scene needs?* A scene, at least one object, a camera and a renderer.
2. *Why is the cube not visible if you remove `camera.position.z = 3`?* The camera would be at the center of the cube, looking at its faces from inside. Faces are only drawn from the front by default.
3. *What is the second argument of PerspectiveCamera?* The aspect ratio (width / height). If it doesn't match the canvas, the image is stretched.
4. *Why is the outline added to the mesh instead of the scene?* As a child, it follows every transform of the cube. Added to the scene, it would stay in place while the cube moves. (`linewidth` is ignored by WebGL on most systems, so lines are always 1 pixel thick.)

**Try this**: change the color to `0x00ff00` and `camera.position.z` to `5`. The cube turns green and looks smaller.

---

## Activity 1.2: Local Server (Vite)

**How 1.1 and 1.2 differ**: both are Vite projects with the same scene, which is the cleanest option because `import * as THREE from 'three'` only works with a bundler. 1.1 is about the scene. 1.2 is about the tooling: it shows the Three.js version Vite loaded from `node_modules`, and displays `static/door.jpg` from `/door.jpg` to show how the static folder works.

**What the code does / the workflow**
- `npm install` reads `package.json` and downloads `three` and `vite` into `node_modules/`.
- `npm run dev` runs Vite, a local server with instant reload when you save.
- `import * as THREE from 'three'` works because Vite finds the `three` package in `node_modules`. A plain browser can't do this without a bundler.
- `vite.config.js`:
  - `root: 'src/'` means the website is the `src` folder.
  - `publicDir: '../static/'` serves files in `static/` as-is at the site root.
  - `base: './'` makes paths relative so the build works in any folder.
- `npm run build` creates `dist/`, a small optimized version (one bundled JS file plus `index.html` and the static files) that you could upload to any web host.
- `THREE.REVISION` prints `148`, which confirms the version.

**Likely questions**
1. *Why do we need Vite instead of opening index.html directly?* Browsers can't resolve bare imports like `'three'`, and ES modules don't load over `file://`. Vite serves the files and resolves `node_modules`.
2. *Where does `/door.jpg` come from?* From `static/door.jpg`, because `publicDir` serves that folder at the root. Those files are copied to `dist/` without changes.
3. *What's the difference between `npm run dev` and `npm run build`?* `dev` starts a development server with hot reload. `build` writes production files to `dist/`.

**Try this**: add any image to `static/`, then change the `<img src>` to `/yourimage.jpg`. It shows up without touching `script.js`.

---

## Activity 1.3: Transform Objects

**What the code does**
- **Position**: sets x/y/z one by one, then again with `position.set(x, y, z)` to show both ways.
  - `position.length()` is the distance from the center of the scene.
  - `position.distanceTo(camera.position)` is the distance to the camera. It's logged after the camera exists.
- **AxesHelper(2)**: red = x, green = y, blue = z.
- **Scale**: per axis, then with `scale.set`. The red mesh becomes a flat bar.
- **Rotation**: in radians, where `Math.PI` is half a turn.
  - `reorder('YXZ')` is called before setting the values.
  - Gimbal lock: rotations are applied one axis after another, so one rotation can line two axes up, and then rotating either does the same thing (you lose an axis). Doing Y first, as in a first-person camera, avoids this.
- **Normalize**: `normalize()` makes a vector's length 1 while keeping its direction. It changes the vector in place, so the code normalizes a `clone()`. Otherwise the mesh would jump to 1 unit from the center.
- **Group**: a container holding red, green and blue cubes. Moving, scaling and rotating the group moves all three together, and each cube keeps its position *relative* to the group.
- **camera.lookAt(mesh.position)**: points the camera at the red mesh.

**Likely questions**
1. *Why does `rotation.y = Math.PI` turn the cube half a turn and not 3.14 degrees?* Three.js uses radians. π rad = 180°.
2. *What happens if you call `reorder` after setting the rotation?* The order changes, so the same x/y values give a different orientation. That's why it's called first.
3. *Why use a Group?* To transform several objects as one unit, for example moving a whole house instead of each wall.

**Try this**: change `group.rotation.y = 0.2` to `Math.PI * 0.25`, or set `group.position.x = -1`. All three cubes move together.

---

## Activity 1.4: Animations

**What the code does**
- `tick()` is called on every screen refresh with `window.requestAnimationFrame(tick)`. Each call updates values, then renders.
- **Why frame rate matters**: `rotation.y += 0.01` per frame spins 2.4× faster on a 144 Hz screen than on a 60 Hz one. Animations have to depend on *time*, not on frames.
- **Version 1 (commented out)**: `Date.now()` delta time. The code measures milliseconds since the last frame and multiplies the speed by it.
- **Version 2 (used)**: `THREE.Clock`. `getElapsedTime()` gives the seconds since start, so `rotation.y = elapsedTime * Math.PI * 2` means exactly one turn per second on any screen.
- **Circular motion**: `x = cos(t)` and `y = sin(t)` trace a circle of radius 1. A commented alternative circles the camera around the cube instead.
- **GSAP**: installed with `npm install gsap` (now in `package.json`). `gsap.to(mesh.scale, {...})` makes the cube grow and shrink forever (`yoyo`, `repeat: -1`). GSAP only changes the numbers, so `renderer.render` in `tick()` is still what shows them.
- **getDelta() pitfall**: `getDelta()` returns the time since it was last called and resets an internal timer. Calling it alongside `getElapsedTime()` on the same clock gives wrong values.

**Likely questions**
1. *Why not use `setInterval` instead of `requestAnimationFrame`?* rAF syncs with the screen refresh and pauses in hidden tabs. setInterval does neither.
2. *If GSAP animates the cube, why keep `renderer.render` in tick()?* GSAP updates the values, but nothing redraws the canvas unless we render every frame.
3. *Why use `=` with elapsedTime instead of `+=`?* elapsedTime already grows over time, so assigning it directly is frame-rate independent.

**Try this**: change `Math.cos(elapsedTime)` to `Math.cos(elapsedTime) * 2` to make the circle twice as wide. Or comment out the mesh position lines and uncomment the camera lines.

---

## Activity 1.5: Cameras

**What the code does**
- **PerspectiveCamera(75, aspect, 0.1, 100)**:
  - `fov` is the vertical angle.
  - `aspect` is width/height.
  - `near`/`far` set the drawing range.
  - Extreme values like `0.0001` or `999999` spread depth precision too thin, so close faces flicker ("z-fighting").
- **OrthographicCamera (commented out)**: no perspective, so objects keep the same size at any distance. `left`/`right` are multiplied by `aspectRatio` so the cube isn't stretched on an 800×600 canvas.
- **Cursor**:
  - `mousemove` turns the mouse position into -0.5 … 0.5 on each axis.
  - `y` is flipped because the screen's y goes down while 3D y goes up.
  - The canvas is at the top-left corner so `clientX`/`clientY` line up with it.
- **Custom controls (commented out)**:
  - `sin`/`cos` of `cursor.x * Math.PI * 2` put the camera on a circle of radius 3, one full turn across the canvas.
  - `cursor.y` moves it up or down.
  - `lookAt` keeps it aimed at the cube.
- **OrbitControls (used)**:
  - Imported from `three/examples/jsm/controls/OrbitControls.js`, which is the r148 path.
  - Drag rotates, scroll zooms and right-drag pans.
  - `enableDamping` adds smooth easing, but it only works because `controls.update()` runs every frame.

**To show each camera approach**
- **Orthographic**: comment out the `PerspectiveCamera` line and uncomment the two orthographic lines.
- **Custom controls**: comment out the 2 OrbitControls lines and `controls.update()`, then uncomment the 4 custom-control lines in `tick()`.

**Likely questions**
1. *Why multiply the orthographic left/right by the aspect ratio?* Without it the camera sees a square area that gets stretched onto a rectangular canvas.
2. *What happens if you remove `controls.update()` with damping on?* The camera stops moving smoothly and doesn't respond properly, because damping is calculated in `update()`.
3. *Why `- (clientY / height - 0.5)`?* To get -0.5 … 0.5 with up being positive, matching the 3D y axis.

**Try this**: set `controls.autoRotate = true` under `enableDamping`. The camera then orbits by itself.

---

## Submission checklist
- Folder names are `Activity 1.1` … `Activity 1.5`, inside one main Google Drive folder. Don't upload `Activity 1 Starter Pack` or this file.
- **Delete `node_modules/` in every folder before uploading.** `npm install` recreates it. There's no `dist/` right now, so if you run `npm run build`, delete that too unless it's required.
- Share the main folder as **Anyone with the link: Viewer**.
- Take a screenshot or short screen recording of each activity running in the browser.
