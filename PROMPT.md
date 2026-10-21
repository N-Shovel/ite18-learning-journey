# Claude Code prompt: ITE-18 Activity 3 (Particles, Galaxy Generator, Scroll-Based Animation)

> **How to start:** open a terminal in this folder (`C:\Users\Nemo\Desktop\Dev-Workspace\ite18-activity-3`), run `claude`, and type:
> **Read PROMPT.md and do everything in it.**

> **Deadline:** the Classroom post "Submission for Three.JS Activity 3.1-3.3" (100 points) is **due today, Wed Oct 21 2026**. Work in order 3.1, then 3.2, then 3.3, and finish each one fully before starting the next. No extras beyond what's listed here.

---

## Context

I'm **Nimrod P. Pala**, section **ITE 18-FNHX1**, Caraga State University.
Course: **ITE-18 Applications Development and Emerging Technologies**. Instructor: **James Earl D. Cubillas**.

Build Activity 3 of the course's "Introduction to Three.js" handouts as **three separate Vite projects** inside this folder:

| Folder to create | Handout | Pages | Final screenshot | Copy from starter |
| --- | --- | --- | --- | --- |
| `Activity 3.1 - Particles` | `handout/Activity_3.1.pdf` (Part 1) | 17 | p.17 (top) | `Activity 3 Starter Pack/Activity 3.1 Particles` |
| `Activity 3.2 - Galaxy Generator` | `handout/Activity_3.2.pdf` (Part 2) | 14 | p.14 | `Activity 3 Starter Pack/Activity 3.2 Galaxy Generator` |
| `Activity 3.3 - Scroll Based Animation` | `handout/Activity_3.3.pdf` (Part 3) | 29 | p.28 (bottom) | `Activity 3 Starter Pack/Activity 3.3 Scroll Based Animation` |

## What's in this folder

- `handout/` has the three PDF handouts. They are the **source of truth**: every code snippet is in them, with a screenshot of the expected result after each step. Read them in page ranges (max 20 pages per read).
- `Activity 3 Starter Pack/` has the instructor's three starter projects (three `^0.148.0`, lil-gui `^0.17.0`, vite `^4.0.4`). **Don't edit them.** Copy them.
  - 3.1 has 13 particle textures in `static/textures/particles/` (the handout uses `2.png`).
  - 3.3 has `static/textures/gradients/3.jpg` and `5.jpg` (the handout uses `3.jpg`).
- `transcripts/` has the auto-generated captions of the instructor's three recorded videos. They're a messy Bisaya/English mix, so **don't** build from them. Everything useful in them is already summarized under "Gaps in the handouts" below.
- `PROMPT.md` is this file.

My earlier work, for conventions. **Read these, don't modify them:**

- `C:\Users\Nemo\Desktop\Pala_Nimrod_ITE18-FNHX1_ThreeJS_Activities\` is my submission repo (Activities 1.5–2.3). Look at the root `README.md` and at `Activity 2.3 - Haunted House\` (`README.md`, `package.json`, `.gitignore`, `src\index.html`, `src\script.js`, `screenshots\`), and copy their style. Activity 2 is the closest match because it's also on the starter's r148.
- `C:\Users\Nemo\Desktop\Dev-Workspace\ite18-activity-2\STUDY-GUIDE.md` shows the format for the study guide.

## Rules

1. **Keep the starter's pinned versions** (`three ^0.148.0`, `lil-gui ^0.17.0`, `vite ^4.0.4`). Don't upgrade.
   - The only new dependency is **GSAP 3.5.1** in 3.3: `npm install gsap@3.5.1`. The handout pins this version so the syntax matches. Ignore any vulnerability warnings, as the handout says.
2. **Follow the handout exactly**: same values, same order. When a later step replaces an earlier one (the map changed to an alphaMap, alphaTest replaced by depthTest and then depthWrite, rotation replaced by the wave, the galaxy's positioning formula growing step by step), **don't delete the earlier code**.
   - Keep each technique in its own block with a comment header naming the handout section.
   - Make the blocks switchable from the lil-gui panel, the way Activity 2 did.
   - **The default state on page load = the handout's final state** (its final screenshot).
3. If something in the handout doesn't work as written, make the smallest fix and add a one-line `// Deviation from handout: ...` comment explaining why.
   - Where the code comes from the video because the handout left it out (see "Gaps in the handouts"), use `// From the instructor's video (missing from the handout): ...` instead.
4. **Personalize like Activity 2.3:**
   - A header comment in `script.js` with the activity name, my name, section and course.
   - `<title>Activity 3.1 - Particles | Nimrod P. Pala</title>` (etc.) and `<link rel="icon" href="data:,">`.
   - `package.json`: kebab-case name (`activity-3-1-particles`, `activity-3-2-galaxy-generator`, `activity-3-3-scroll-based-animation`), plus `description`, `author` and a `"preview": "vite preview"` script, like 2.3.
   - A `.gitignore` with `node_modules` and `dist`.
5. Keep the starter's `vite.config.js` (`root: 'src/'`, `publicDir: '../static/'`). Textures load the way the handout writes them (`'/textures/particles/2.png'` in 3.1, `'textures/gradients/3.jpg'` in 3.3).
6. This is Windows (PowerShell), and the folder names have spaces, so quote every path.
7. Only work inside this folder, apart from the copy step at the end. Don't add extras beyond the handout and the video notes below.
8. Use the **caveman**, **ponytail** and **superpowers** plugins if they're installed.

## Gaps in the handouts (from the instructor's videos)

These are places where the handout is missing code or the video shows something worth keeping. Everything else: follow the handout.

1. **3.3 particles' y position (p.24).** The handout says to use `objectsDistance` × the number of objects (`sectionMeshes.length`) but the code block is missing. The instructor said on video that he forgot to put it in the handout. Use:
   ```js
   positions[i * 3 + 1] = objectsDistance * 0.5 - Math.random() * objectsDistance * sectionMeshes.length
   ```
   This means the particles code has to come **after** `sectionMeshes` is declared.
2. **3.3 triggered rotations (p.28).** The handout says to switch the permanent rotation from `elapsedTime` to `deltaTime` so GSAP's spin isn't overwritten every frame, but it only shows a screenshot. Use:
   ```js
   for(const mesh of sectionMeshes)
   {
       mesh.rotation.x += deltaTime * 0.1
       mesh.rotation.y += deltaTime * 0.12
   }
   ```
3. **3.3 particle size.** The video sounds like "0.3", but the handout says `size: 0.03`. Use **0.03**.
4. **3.2 tweak order (p.4).** The `gui.add(...).onFinishChange(generateGalaxy)` lines must come **after** `generateGalaxy` is defined, and `geometry`, `material` and `points` must be `let ... = null` declared **before** it. The instructor got "Cannot access 'X' before initialization" errors live from getting this order wrong.
5. **3.2 rotation (video only).** At the end of the video the instructor rotates the whole galaxy in `tick`. Add it as a GUI toggle **"Rotate galaxy"**, **off by default** so the default view still matches p.14. Use `points.rotation.y = elapsedTime * 0.1` and guard against `points` being null.

## Per-activity notes

### 3.1 Particles (17 pages)

- **Steps, in handout order:**
  1. Remove the cube. Use `SphereGeometry(1, 32, 32)` + `PointsMaterial({ size: 0.02, sizeAttenuation: true })` + `Points` (p.2–3).
  2. Custom `BufferGeometry`: `count = 500`, `Float32Array(count * 3)`, `(Math.random() - 0.5) * 10` (p.3–4). Then `count = 5000` and `size = 0.1` (p.4).
  3. `color = new THREE.Color('#ff88cc')`, then `map = particleTexture` from `'/textures/particles/2.png'` (p.5).
  4. `transparent = true` + `alphaMap` instead of `map` (p.6).
  5. The three fixes, each commenting out the previous one:
     - `alphaTest = 0.001` (p.7)
     - `depthTest = false` (p.8)
     - add the white test cube to show depthTest's bug (p.9)
     - `depthWrite = false` (p.9–10)
  6. `blending = THREE.AdditiveBlending`, keeping `depthWrite` (p.10). `count = 20000` (p.11). Remove the cube.
  7. Different colors: a `colors` `Float32Array` filled with `Math.random()` in the same loop, `setAttribute('color', ...)`, `vertexColors = true`, and the `#ff88cc` color commented out (p.12–13).
  8. Animate:
     - `particles.rotation.y = elapsedTime * 0.2` (p.13–14), then commented out.
     - The per-vertex wave: loop `i < count`, `i3 = i * 3`, `array[i3 + 1] = Math.sin(elapsedTime + x)` with `x = array[i3]`, then `position.needsUpdate = true` (p.14–16).
- **Final state (p.17):**
  - 20000 multi-colored circle particles in a wave, using alphaMap `2.png`, transparent, `depthWrite` false and additive blending
  - no cube, no material color
- GUI:
  - a **"Transparency fix"** dropdown: alphaTest / depthTest / depthWrite, default **depthWrite**
  - a **"Test cube"** toggle (off)
  - **"Additive blending"** (on)
  - **"Vertex colors"** (on)
  - an **"Animation"** dropdown: None / Rotate / Wave, default **Wave**
  - **count** and **size** sliders
  - `material.needsUpdate = true` after toggling blending, depthTest or vertexColors

### 3.2 Galaxy Generator (14 pages)

- Final parameters:
  - `count 100000`, `size 0.01`, `radius 5`, `branches 3`, `spin 1`
  - `randomness 0.2`, `randomnessPower 3`
  - `insideColor '#ff6030'`, `outsideColor '#1b3984'`
- GUI ranges, exactly as in the handout, all with `.onFinishChange(generateGalaxy)`:

  | Parameter | Min | Max | Step |
  | --- | --- | --- | --- |
  | count | 100 | 1000000 | 100 |
  | size | 0.001 | 0.1 | 0.001 |
  | radius | 0.01 | 20 | 0.01 |
  | branches | 2 | 20 | 1 |
  | spin | -5 | 5 | 0.001 |
  | randomness | 0 | 2 | 0.001 |
  | randomnessPower | 1 | 10 | 0.001 |

  Plus `addColor` for `insideColor` and `outsideColor`.
- Material: `size`, `sizeAttenuation: true`, `depthWrite: false`, `AdditiveBlending`, `vertexColors: true`.
- Destroy the old galaxy first: `if(points !== null) { geometry.dispose(); material.dispose(); scene.remove(points) }` (p.5).
- `colorInside` / `colorOutside` are created **inside** `generateGalaxy`. Each particle's color is `colorInside.clone().lerp(colorOutside, radius / parameters.radius)` (p.13–14).
- The positioning formula is rewritten at each step:
  1. random cube (p.2)
  2. radius line (p.7)
  3. branches (p.8)
  4. spin (p.9)
  5. randomness (p.10)
  6. `Math.pow` randomness power (p.11)
  7. colors: all red first (p.12–13), then the lerp (p.14)

  Keep each version and add a **"Handout step"** dropdown that picks which one `generateGalaxy` uses. Default **7 - Colors (final)**.
- **Final state (p.14):** an orange-to-blue three-branch spiral galaxy seen from the starter camera at (3, 3, 3).

### 3.3 Scroll-Based Animation (29 pages)

- **Setup and scroll:**
  - Remove `overflow: hidden` from `style.css` (p.2).
  - `alpha: true` on the renderer, then `renderer.setClearAlpha(0)` (p.3).
  - `html { background: #1e1a20; }` (p.4).
- **Objects and material:**
  - `TorusGeometry(1, 0.4, 16, 60)`, `ConeGeometry(1, 2, 32)`, `TorusKnotGeometry(0.8, 0.35, 100, 16)`, all sharing one material (p.5–6).
  - Red `MeshBasicMaterial` first, then `MeshToonMaterial({ color: parameters.materialColor, gradientMap })`.
  - `DirectionalLight('#ffffff', 1)` at `(1, 1, 0)` (p.7).
  - The `materialColor` tweak's `.onChange` calls `material.color.set(...)`, and later also `particlesMaterial.color.set(...)` (p.7, p.24).
  - Load `'textures/gradients/3.jpg'` and set `gradientTexture.magFilter = THREE.NearestFilter` (p.7–9).
- **Positions:**
  - The p.9 test code (`mesh1.position.y = 2`, `mesh2.visible = false`, ...) is temporary. The handout says to remove it, so don't keep it.
  - `objectsDistance = 4` (p.10). `mesh.position.y = -objectsDistance * i`.
  - x positions: `2`, `-2`, `2` (p.14).
- **Animation and camera:**
  - `sectionMeshes = [mesh1, mesh2, mesh3]` and the permanent rotation (p.11). Switch it to `deltaTime` later (gap #2).
  - `scrollY` plus a `'scroll'` listener. `camera.position.y = -scrollY / sizes.height * objectsDistance` (p.12–14).
  - Parallax: the `cursor` object, normalized to −0.5…0.5 (p.15–16).
  - `cameraGroup = new THREE.Group()`. The camera goes into the group instead of `scene.add(camera)`. Parallax is applied to the group (p.17–18).
  - Easing with `previousTime` / `deltaTime`: `+= (parallaxX - cameraGroup.position.x) * 5 * deltaTime` (p.18–21).
  - Amplitude `* 0.5` (p.22).
- **Particles:** `particlesCount = 200`, x/z `(Math.random() - 0.5) * 10`, y from gap #1, `PointsMaterial({ color: parameters.materialColor, sizeAttenuation: true, size: 0.03 })` (p.22–24).
- **Triggered rotations:**
  - `currentSection = 0`. `newSection = Math.round(scrollY / sizes.height)`. When it changes: `gsap.to(sectionMeshes[currentSection].rotation, { duration: 1.5, ease: 'power2.inOut', x: '+=6', y: '+=3', z: '+=1.5' })` (p.25–28).
  - `import gsap from 'gsap'`.
- **Final state (p.28):**
  - the dark `#1e1a20` page with "My Portfolio" / "My projects" / "Contact me"
  - toon-shaded torus, cone and torus knot alternating right/left/right
  - stars across all three sections
  - smooth mouse parallax, and a spin when you reach each section
- GUI:
  - keep `materialColor`
  - a **"Material"** dropdown: Basic (red) / Toon / Toon + gradient, default **Toon + gradient**
  - **"Nearest filter"** (on)
  - **"Parallax"** (on)
  - **"Easing"** (on)
  - **"Particles"** (on)
  - **"Spin on section"** (on)

## Workflow

1. Read this whole file, then `handout/Activity_3.1.pdf`, then Activity 2.3 in the submission repo for conventions. Write a short plan and start; no need to wait for my approval.
2. `git init` this folder (keep the starter pack, handout and transcripts in it). Commit after each finished activity. Don't push anywhere.
3. For each activity, in order 3.1, then 3.2, then 3.3:
   1. Copy the starter folder to its new name (table above), personalize it (rule 4), and run `npm install` (plus `npm install gsap@3.5.1` for 3.3).
   2. Build it step by step from the handout, using the notes above.
   3. **Verify:**
      - `npm run build` passes.
      - Run `npm run dev` and confirm there are no console errors (missing textures, "before initialization" errors, shader errors).
      - If you have a browser tool (Playwright, Claude in Chrome, etc.):
        - Open the page and compare it with the handout's final screenshot.
        - Save `screenshot.png` (about 1280×720) in the activity folder.
        - Save a `screenshots/` folder with one numbered picture per handout step, named like Activity 2.3's (`01-sphere.png`, `02-random-particles.png`, ...). For 3.3, take the shots at different scroll positions.
        - Save a short `recording.mp4` (10–20 s) showing the animation. For 3.3, scroll through all three sections and move the mouse.
      - If you don't have a browser tool, tell me exactly what I should see so I can check it myself, and list which images are still missing.
   4. Write the activity's `README.md` in the 2.3 format:
      - Student / Section / Instructor
      - the screenshot, plus a line pointing to `screenshots/` and `recording.mp4`
      - "What it does" (3–4 plain bullets)
      - "How to run"
   5. Commit.
4. Write `STUDY-GUIDE.md` at the root of this folder. It's **for me, not for submission**.
   - Cover 3.1–3.3 in the format of `ite18-activity-2\STUDY-GUIDE.md`: "What the code does", "Likely questions" (4–5 per activity, with answers), "Try this".
   - Highlight key terms with `<mark>…</mark>` instead of bold. Plain bold is hard for me to read.
   - Spell out every acronym the first time it appears in each section, e.g.:
     - WebGL → Web Graphics Library
     - GPU → Graphics Processing Unit
     - GSAP → GreenSock Animation Platform
     - GUI → Graphical User Interface
     - RGB → Red, Green, Blue
     - FPS → Frames Per Second
     - lerp → linear interpolation
5. **Copy to the submission folder.** Copy the three finished activity folders (without `node_modules` and `.git`) into `C:\Users\Nemo\Desktop\Pala_Nimrod_ITE18-FNHX1_ThreeJS_Activities\`, next to the 2.x folders. Then, in that folder's root `README.md`:
   - Add the three rows (3.1, 3.2, 3.3) to the Activities table, in the same style.
   - Change the intro sentence so it also covers Activity 3 (Particles, Galaxy Generator, Scroll-Based Animation).
   - Update the Notes bullets:
     - The screenshots / recording note covers Activity 2 and 3.
     - The r148 note covers Activity 2 and 3.
     - Add one bullet: 3.3 uses GSAP 3.5.1 as the handout specifies.
   - Don't touch anything else in that folder.
6. **Final report:** what's done, every deviation from the handout and why, and anything I still need to check by hand.

## Done when

- [ ] All three folders run with `npm install` + `npm run dev` and build with `npm run build`
- [ ] Each page's default view matches the handout's final screenshot (3.1 p.17, 3.2 p.14, 3.3 p.28)
- [ ] Every handout step is in the code, labeled with its section, and switchable where a later step replaces it
- [ ] No console errors
- [ ] `README.md`, `screenshot.png`, `screenshots/` and `recording.mp4` in each activity, and `STUDY-GUIDE.md` at the root
- [ ] Copied to the submission folder, and its root `README.md` updated
