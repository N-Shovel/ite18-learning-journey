# Activity 3.1–3.3 Study Guide

This file is for you, not for submission. The folders to upload are `Activity 3.1 - Particles`, `Activity 3.2 - Galaxy Generator` and `Activity 3.3 - Scroll Based Animation`.

Run any activity:

```bash
cd "Activity 3.1 - Particles"
npm install      # only the first time
npm run dev      # opens the page in your browser
```

All three use the starter pack's versions (three.js r148, lil-gui 0.17, Vite 4), like Activity 2. Activity 3.3 also uses GSAP (GreenSock Animation Platform) 3.5.1, the exact version the handout asks for.

---

## Activity 3.1: Particles

#### What the code does

- A particle is a small square (two triangles) that always faces the camera. You need three things: a geometry, a <mark>PointsMaterial</mark> and a <mark>Points</mark> object (instead of a Mesh). Every vertex of the geometry becomes one particle.
- The handout steps, in order:
  - First particles: a `SphereGeometry(1, 32, 32)` with `PointsMaterial({ size: 0.02, sizeAttenuation: true })`. <mark>sizeAttenuation</mark> makes far particles smaller than close ones.
  - Custom geometry: a `BufferGeometry` with a `Float32Array(count * 3)` (x, y and z for each particle) filled with `(Math.random() - 0.5) * 10`, so every value is between -5 and 5. Then `count` goes from 500 to 5000 and `size` to 0.1.
  - Color, map and alpha map: `color = new THREE.Color('#ff88cc')`, then the texture `2.png` on the `map`. The black corners of the texture hide the particles behind them.
  - So the texture moves to the <mark>alphaMap</mark> with `transparent = true` (white = visible, black = invisible). Some edges still hide the particles behind, because WebGL (Web Graphics Library) draws them in the order they were created, not from back to front.
- Three fixes for those edges, each one replacing the previous:
  - <mark>alphaTest</mark> `0.001`: pixels with an alpha of 0 are not drawn. Better, but still a few glitches.
  - <mark>depthTest</mark> `false`: WebGL stops checking what's in front. It looks fixed, but the particles are then drawn over everything, even the white test cube.
  - <mark>depthWrite</mark> `false`: the particles are still tested, but don't write into the <mark>depth buffer</mark>, so they never hide each other. This is the one kept.
- <mark>AdditiveBlending</mark>: the color of each pixel is added to the color already there, so overlapping particles glow. The count goes up to 20000.
- Different colors: a second `Float32Array` called `colors`, filled with `Math.random()` in the same loop, set as the `'color'` attribute, plus `vertexColors = true`. The pink color is commented out, because the material color is multiplied with the vertex colors.
- Animate:
  - Rotate the whole `Points` object (`particles.rotation.y = elapsedTime * 0.2`), then comment it out.
  - The wave: in `tick()`, loop over every particle, read its x at `array[i3]` and set its y at `array[i3 + 1]` to `Math.sin(elapsedTime + x)`. Then `needsUpdate = true` tells three.js to send the new positions to the GPU (Graphics Processing Unit).
- Panel: Geometry, count, size, Color #ff88cc, Texture, Transparency fix, Test cube, Additive blending, Vertex colors and Animation. The defaults are the handout's final state.

#### Likely questions

1. *What's the difference between a Mesh and Points?* Both use a geometry and a material. A Mesh draws the triangles between the vertices, while Points draws one particle (a camera-facing square) on each vertex.
2. *Why is the array `count * 3` long?* Each particle needs 3 numbers (x, y, z) in one flat array. `new THREE.BufferAttribute(positions, 3)` tells three.js to read them 3 by 3.
3. *Why use the texture on the alphaMap and not the map?* On the map, the black part of the image is drawn as black and hides the particles behind. On the alphaMap (with `transparent`), black becomes invisible.
4. *Which of the three fixes is best here, and why?* depthWrite = false. alphaTest leaves glitches, and depthTest = false draws the particles over other objects (the test cube shows this). depthWrite = false has almost no drawback in this scene.
5. *Why does the handout say to avoid the wave technique?* Every frame, the <mark>CPU (Central Processing Unit)</mark> loops over all 20000 particles and sends the whole position array to the GPU again. That's slow for big counts. A custom shader would do it on the GPU instead (a later lesson).

#### Try this

set "Transparency fix" to depthTest and tick "Test cube": the particles are drawn on top of the cube even when they're behind it. Switch to depthWrite and the cube hides them correctly again. Then untick "Additive blending" to see how much it adds.

---

## Activity 3.2: Galaxy Generator

#### What the code does

- Everything is built inside one function, <mark>generateGalaxy</mark>, which reads a `parameters` object. Each GUI (Graphical User Interface) tweak calls it again with <mark>onFinishChange</mark>, so a new galaxy is only made when you release the slider, not on every pixel of the drag.
- Order matters:
  - `let geometry = null`, `let material = null`, `let points = null` are declared before the function, so it can reach the old galaxy.
  - At the start of the function: if `points !== null`, then `geometry.dispose()`, `material.dispose()` and `scene.remove(points)`. Without this, every change stacks a new galaxy on the old one and the computer heats up.
  - The `gui.add(...)` lines come after the function. Before it, they throw "Cannot access 'generateGalaxy' before initialization".
- The material: `PointsMaterial` with `size`, `sizeAttenuation: true`, `depthWrite: false`, `AdditiveBlending` and `vertexColors: true`. No texture: the particles are tiny squares, and with 100000 of them nobody notices.
- The positioning formula grows step by step (the "Handout step" menu picks one):
  1. Base particles: a random cube, `(Math.random() - 0.5) * 3`.
  2. Radius: `radius = Math.random() * parameters.radius`, every particle on the x axis (a line).
  3. Branches: `branchAngle = (i % branches) / branches * Math.PI * 2`. The <mark>modulo</mark> (`%`) sends particle 0 to branch 0, particle 1 to branch 1, and so on. `cos` gives x and `sin` gives z.
  4. Spin: `spinAngle = radius * spin` is added to the angle, so the further a particle is from the center, the more it turns. That makes the spiral.
  5. Randomness: a random offset on x, y and z, times the radius, so the outside is more spread out.
  6. Randomness power: `Math.pow(Math.random(), randomnessPower)` pushes most values close to 0, then `* (Math.random() < 0.5 ? 1 : -1)` makes half of them negative. Most stars stay near the branch, with a few far away.
  7. Colors: all red first, then `colorInside.clone().lerp(colorOutside, radius / parameters.radius)`. <mark>lerp (linear interpolation)</mark> mixes the two colors: 0 = inside color, 1 = outside color.
- Final values: count 100000, size 0.01, radius 5, branches 3, spin 1, randomness 0.2, randomnessPower 3, `#ff6030` inside and `#1b3984` outside.
- "Rotate galaxy" (from the instructor's video, off by default) turns the whole galaxy with `points.rotation.y = elapsedTime * 0.1`.

#### Likely questions

1. *Why do we call `dispose()` before making a new galaxy?* Removing the points from the scene isn't enough. The geometry and the material still take memory on the GPU (Graphics Processing Unit) until they're disposed.
2. *Why `onFinishChange` and not `onChange`?* onChange fires on every movement of the slider, and with 100000 particles that would build hundreds of galaxies per drag. onFinishChange fires once, when you let go.
3. *What does `i % parameters.branches` do?* It gives the remainder of the division, so it cycles 0, 1, 2, 0, 1, 2... Each particle goes to the next branch in turn, and the branches get the same number of particles.
4. *Why use `Math.pow` on the randomness?* A random number between 0 and 1 raised to the power 3 is usually much smaller (0.5³ = 0.125). Most stars end up close to the branch and only a few far away, which looks more like a real galaxy.
5. *Why are `colorInside` and `colorOutside` created inside the function?* So that they're made again from the current `insideColor` and `outsideColor` each time the galaxy is generated. If they were made once outside, changing the color in the panel would do nothing. And `clone()` is needed because `lerp` changes the color it's called on.

#### Try this

set "Handout step" to 3 - Branches, then move through 4, 5 and 6 to watch the spiral form. Back on 7 - Colors (final), set branches to 6 and spin to -2.

---

## Activity 3.3: Scroll Based Animation

#### What the code does

- The page is normal HTML (three sections, each 100vh tall), and the WebGL (Web Graphics Library) canvas is fixed behind it.
  - Removing `overflow: hidden` from `style.css` lets the page scroll.
  - `alpha: true` on the renderer and `renderer.setClearAlpha(0)` make the canvas transparent.
  - `html { background: #1e1a20; }` paints the page, so the <mark>elastic scroll</mark> (when you scroll past the end) shows the same color instead of white.
- Objects: a torus, a cone and a torus knot share one material. A red `MeshBasicMaterial` first, then a <mark>MeshToonMaterial</mark>, which is black until a `DirectionalLight('#ffffff', 1)` is added.
- <mark>Gradient map</mark>: `textures/gradients/3.jpg` is only 3 pixels wide (dark, middle, bright). By default WebGL blends the pixels (LinearFilter), which gives a smooth gradient. `magFilter = THREE.NearestFilter` takes the closest pixel instead, which gives the 3 flat toon bands.
- Positions:
  - The field of view is vertical, so objects at a given y stay in place when the window is resized.
  - `objectsDistance = 4`: each mesh is at `y = -objectsDistance * i`, and at x = 2, -2, 2 to sit opposite its title.
- Scroll: `camera.position.y = -scrollY / sizes.height * objectsDistance`. Scrolling one screen height moves the camera down to the next object. It's negative because scrolling down makes `scrollY` bigger, but the camera has to go down.
- Parallax:
  - The `cursor` is normalized to -0.5…0.5 (`clientX / sizes.width - 0.5`), and y is inverted so the camera follows the mouse.
  - The camera is put in a `cameraGroup`. The scroll moves the camera and the parallax moves the group, so the two don't overwrite each other.
- <mark>Easing</mark>: `cameraGroup.position.x += (parallaxX - cameraGroup.position.x) * 5 * deltaTime`. Each frame covers part of the remaining distance, so the movement slows down near the target. `deltaTime` (the time since the last frame, from `previousTime`) makes it the same speed at 60 or 144 FPS (Frames Per Second). The amplitude is then lowered with `* 0.5`.
- Particles: 200 points in `PointsMaterial({ color: parameters.materialColor, sizeAttenuation: true, size: 0.03 })`. Their y is `objectsDistance * 0.5 - Math.random() * objectsDistance * sectionMeshes.length` (from the video: the handout forgot this line), so they start half a section above the first object and fill all three sections.
- Triggered rotations:
  - In the `'scroll'` listener, `newSection = Math.round(scrollY / sizes.height)`. When it differs from `currentSection`, GSAP (GreenSock Animation Platform) spins that mesh: `gsap.to(mesh.rotation, { duration: 1.5, ease: 'power2.inOut', x: '+=6', y: '+=3', z: '+=1.5' })`.
  - The permanent rotation has to change from `= elapsedTime * 0.1` to `+= deltaTime * 0.1`. Otherwise the tick function overwrites GSAP's rotation every frame and the spin never shows.
- Panel: materialColor, Material, Nearest filter, Parallax, Easing, Particles and Spin on section.

#### Likely questions

1. *Why make the renderer transparent instead of setting a clear color?* With a clear color, the elastic scroll still shows the white page behind the canvas. With a transparent canvas and the color on `html`, everything is the same color.
2. *Why put the camera in a Group?* The scroll sets `camera.position.y` and the parallax also needs to move y. If both set the camera, the second one replaces the first. With the group, the parallax moves the group and the scroll moves the camera inside it, so the two add up.
3. *Why multiply the easing by `deltaTime`?* `tick` runs more often on a 144 Hz screen than on a 60 Hz one. Without deltaTime, the camera would ease faster on the faster screen. With it, the speed depends on time, not on the number of frames.
4. *How does the code know which section you're in?* Each section is one screen tall, so `scrollY / sizes.height` is the section number. `Math.round` turns it into 0, 1 or 2, and the spin only starts when that number changes.
5. *Why didn't the GSAP spin work at first?* The tick function set `rotation.x = elapsedTime * 0.1` on every frame, which erased GSAP's change straight away. Adding `deltaTime` to the current rotation keeps GSAP's spin.

#### Try this

untick "Spin on section" and scroll: nothing spins, because the rotation goes back to the elapsedTime version. Tick it again. Then untick "Nearest filter" to see the smooth gradient the handout warns about, and switch "Material" to Basic (red) for the very first step.

---

## Submission checklist
- Folder names are `Activity 3.1 - Particles`, `Activity 3.2 - Galaxy Generator`, `Activity 3.3 - Scroll Based Animation`. They're also copied to `Pala_Nimrod_ITE18-FNHX1_ThreeJS_Activities` next to the 2.x folders. Don't upload `Activity 3 Starter Pack`, `handout`, `transcripts`, `PROMPT.md` or this file.
- Don't upload `node_modules/` or `dist/`. `npm install` and `npm run build` recreate them.
- Each folder has a `screenshot.png` of the default view, a `screenshots/` folder with one picture per handout step, and a `recording.mp4`.
