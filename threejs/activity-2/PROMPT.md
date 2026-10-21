# Claude Code prompt: ITE-18 Activity 2 (Lights, Shadows, Haunted House)

> **How to start:** open a terminal in this folder (`C:\Users\Nemo\Desktop\Dev-Workspace\ite18-activity-2`), run `claude`, and type:
> **Read PROMPT.md and do everything in it.**

---

## Context

I'm **Nimrod P. Pala**, section **ITE 18-FNHX1**, Caraga State University.
Course: **ITE-18 Applications Development and Emerging Technologies**. Instructor: **James Earl D. Cubillas**.

Build Activity 2 of the course's "Introduction to Three.js" handouts as **three separate Vite projects** inside this folder:

| Folder to create | Handout part | PDF pages | Copy from starter |
| --- | --- | --- | --- |
| `Activity 2.1 - Lights` | Part 1: Lights | 1–9 | `Activity 2 Starter Pack/Activity 2.1 Lights` |
| `Activity 2.2 - Shadows` | Part 2: Shadows | 10–25 | `Activity 2 Starter Pack/Activity 2.2 Shadows` |
| `Activity 2.3 - Haunted House` | Part 3: Haunted House | 26–43 | `Activity 2 Starter Pack/Activity 2.3 Haunted House Sample` |

## What's in this folder

- `handout/Activity_2.pdf` is the 43-page handout and the **source of truth**. Every code snippet is in it, and there's a screenshot of the expected result after each step. Read it in page ranges (max 20 pages per read). The final screenshots are on **p.9** (2.1), **p.24** (2.2) and **p.43** (2.3).
- `Activity 2 Starter Pack/` holds the instructor's starter projects. **Don't edit them.** Copy them.
- `PROMPT.md` is this file.

My earlier work, for conventions. **Read these, don't modify them:**

- `C:\Users\Nemo\Desktop\Pala_Nimrod_ITE18-FNHX1_ThreeJS_Activities\` has my submitted Activities 1.5–1.12. Look at the root `README.md` and at `Activity 1.10 - Materials\` (`README.md`, `package.json`, `.gitignore`, `src\index.html`, `src\script.js`), and copy their style.
- `C:\Users\Nemo\Desktop\Dev-Workspace\activity1-1.7\STUDY-GUIDE.md` shows the format for the study guide.

## Rules

1. **Versions: keep the starter's pinned versions** (`three ^0.148.0`, `lil-gui ^0.17.0`, `vite ^4.0.4`). Do **not** upgrade, even though Activities 1.5–1.12 used three r186.
   - Why: three r155 switched lights to physical units (legacy lighting off), so the handout's intensity values no longer give the same result. r151 also replaced the `uv2` attribute.
   - On r148, the handout's light intensities, `uv2` lines and `three/examples/jsm/...` import paths work exactly as written, and the result matches the handout's screenshots.
2. **Follow the handout exactly**: same values, same order. When a later step replaces an earlier one (lights removed and re-added, real-time shadows replaced by baked shadows), **don't delete the earlier code**.
   - Keep each technique in its own block with a comment header naming the handout section.
   - Make the blocks switchable from the lil-gui panel, the way Activity 1.10 switched materials.
   - **The default state on page load = the handout's final state** (its final screenshot).
3. If something in the handout doesn't work as written, make the smallest fix and add a one-line `// Deviation from handout: ...` comment explaining why, in the same style as 1.10.
4. **Personalize like 1.10:**
   - A header comment in `script.js` with the activity name, my name, section and course.
   - `<title>Activity 2.1 - Lights | Nimrod P. Pala</title>` and `<link rel="icon" href="data:,">`.
   - `package.json`: kebab-case name (`activity-2-1-lights`, etc., because the starter's names have spaces and capitals, which aren't valid npm package names), plus `description`, `author` and a `"preview": "vite preview"` script, like 1.10.
   - A `.gitignore` with `node_modules` and `dist`.
5. Keep the starter's `vite.config.js` (`root: 'src/'`, `publicDir: '../static/'`). Textures load from `'/textures/...'`.
6. This is Windows (PowerShell), and the folder names have spaces, so quote every path.
7. Only work inside this folder, apart from the copy step at the end. Don't add extras beyond the handout (no windows or chimney on the house, etc.).
8. Use the **caveman**, **ponytail** and **superpowers** plugins if they're installed.

## Per-activity notes (the parts that trip people up)

### 2.1 Lights (pages 1–9)

- The starter has a sphere, a cube, a torus and a plane sharing one `MeshStandardMaterial` (roughness 0.4), plus an ambient light and a point light. The handout removes both lights and then adds each light type in its own section.
- **Final state (p.9):** all six lights on at once, with the handout's values:
  - `AmbientLight(0xffffff, 0.5)`
  - `DirectionalLight(0x00fffc, 0.3)` at `(1, 0.25, 0)`
  - `HemisphereLight(0xff0000, 0x0000ff, 0.3)`
  - `PointLight(0xff9000, 0.5, 10, 2)` at `(1, -0.5, 1)`
  - `RectAreaLight(0x4e00ff, 2, 1, 1)` at `(-1.5, 0, 1.5)`, `lookAt(new THREE.Vector3())`
  - `SpotLight(0x78ff00, 0.5, 10, Math.PI * 0.1, 0.25, 1)` at `(0, 2, 3)`, `target.position.x = -0.75`, with `scene.add(spotLight.target)`
  - Plus the five helpers: Hemisphere, Directional, Point, Spot, and RectArea.
- `RectAreaLightHelper` is imported from `'three/examples/jsm/helpers/RectAreaLightHelper.js'`.
- If the RectAreaLight has no visible effect, import `RectAreaLightUniformsLib` from `'three/examples/jsm/lights/RectAreaLightUniformsLib.js'`, call `RectAreaLightUniformsLib.init()` once, and add a deviation comment.
- `SpotLightHelper` doesn't follow a moved target on its own. Call `spotLightHelper.update()` after the target moves (e.g. on the next frame) so the cone points the right way.
- GUI: one folder per light with an on/off toggle (`visible`) and `intensity`, plus one toggle for all helpers.

### 2.2 Shadows (pages 10–25)

- **Real-time section, in handout order:**
  1. `renderer.shadowMap.enabled`, then `castShadow` on the sphere and `receiveShadow` on the plane.
  2. Directional light: `castShadow`, `mapSize` 1024, `near` 1 / `far` 6 with a `CameraHelper`, amplitude `top/right/bottom/left = ±2`, `radius` 10.
  3. `PCFSoftShadowMap`. Radius is ignored with this type; the handout says to choose. Keep PCFSoft and add a comment.
  4. SpotLight `(0xffffff, 0.4, 10, Math.PI * 0.3)` at `(0, 2, 2)` with its target and camera helper, `mapSize` 1024, `fov` 30, `near` 1 / `far` 6.
  5. PointLight `(0xffffff, 0.3)` at `(-1, 1, 0)`, `mapSize` 1024, `near` 0.1 / `far` 5.
  6. Lower the other intensities as the handout does (they end at 0.3). All camera helpers hidden.
- **Baked section:** real-time shadows off (`castShadow = false` on the three lights, `renderer.shadowMap.enabled = false`). The plane uses `MeshBasicMaterial({ map: bakedShadow })` with `bakedShadow.jpg`.
- **Simple-shadow alternative = final state (p.24):**
  - The plane goes back to the shared `MeshStandardMaterial`.
  - Add a `sphereShadow` plane (1.5 × 1.5, black, `transparent`, `alphaMap: simpleShadow`) at `plane.position.y + 0.01`.
  - The sphere circles and bounces, and the shadow follows it with `opacity = (1 - sphere.position.y) * 0.3`.
- GUI: a **"Shadow technique"** dropdown (Real-time / Baked / Simple, default **Simple**) and a toggle for the camera helpers. If switching to Real-time doesn't show shadows, set `material.needsUpdate = true` after toggling `renderer.shadowMap.enabled`, because r148 needs the shaders recompiled.

### 2.3 Haunted House (pages 26–43)

- **Remove the temporary sphere.** Inside a `house` Group:
  - walls: `BoxGeometry(4, 2.5, 4)` at y 1.25
  - roof: `ConeGeometry(3.5, 1, 4)`, `rotation.y = Math.PI * 0.25`, y `2.5 + 0.5`
  - door: final size `PlaneGeometry(2.2, 2.2, 100, 100)` at y 1, z `2 + 0.01`
  - 4 bushes sharing one geometry and one material
- **Graves:** 50 graves in a `graves` Group on a random ring (radius 3–9) with one shared geometry and material, using the handout's loop.
- **Lights:**
  - ambient and `moonLight`: `'#b9d5ff'`, 0.12
  - `doorLight = PointLight('#ff7d46', 1, 7)` at `(0, 2.2, 2.7)`, added to the house
  - `Fog('#262837', 1, 15)` plus `renderer.setClearColor('#262837')`
- **Textures:**
  - door: 7 maps, `transparent` + `alphaMap`, `displacementScale` 0.1
  - bricks: 4 maps
  - grass: 4 maps, `repeat.set(8, 8)`, `RepeatWrapping` on `wrapS` and `wrapT`
  - Remove the temporary colors.
  - Add the `uv2` attribute on the door, walls and floor for `aoMap`; r148 requires it.
- **Ghosts:** three `PointLight`s (`'#ff00ff'`, `'#00ffff'`, `'#ffff00'`, intensity 2, distance 3), animated with the handout's trig formulas in `tick`.
- **Shadows:**
  - `renderer.shadowMap.enabled`
  - `castShadow` on moonLight, doorLight, the three ghosts, the walls, the 4 bushes and every grave (inside the loop)
  - `floor.receiveShadow`
  - `mapSize` 256 on all five lights; `shadow.camera.far` 15 for the moon, 7 for the others
  - `PCFSoftShadowMap`
- **Final state = p.43 screenshot.**

## Workflow

1. Read this whole file, then the handout pages for 2.1, then Activity 1.10 for conventions. Write a short plan and start; no need to wait for my approval.
2. `git init` this folder (keep the starter pack and handout in it). Commit after each finished activity. Don't push anywhere.
3. For each activity, in order 2.1, then 2.2, then 2.3:
   1. Copy the starter folder to its new name (table above), personalize it (rule 4), and run `npm install`.
   2. Build it step by step from the handout.
   3. **Verify:**
      - `npm run build` passes.
      - Run `npm run dev` and confirm no console errors (missing textures, shader errors).
      - If you have a browser tool (Playwright, Claude in Chrome, etc.), open the page, compare it with the handout's final screenshot, and save a `screenshot.png` (about 1280×720) in the activity folder.
      - If you don't have one, tell me exactly what I should see so I can check it myself, and note that `screenshot.png` is still missing.
   4. Write the activity's `README.md` in the 1.10 format: Student / Section / Instructor, the screenshot, "What it does" (3–4 plain bullets), "How to run".
   5. Commit.
4. Write `STUDY-GUIDE.md` at the root of this folder. It's **for me, not for submission**.
   - Cover 2.1–2.3 in the format of `activity1-1.7\STUDY-GUIDE.md`: "What the code does", "Likely questions" (4–5 per activity, with answers), "Try this".
   - **Two changes from that file:**
     - Highlight key terms with `<mark>…</mark>` instead of bold. Plain bold is hard for me to read.
     - Spell out every acronym the first time it appears in each section, e.g. PCF → Percentage-Closer Filtering, VSM → Variance Shadow Map, AO → Ambient Occlusion, FOV → Field of View, GPU → Graphics Processing Unit.
5. **Copy to the submission folder.** Copy the three finished activity folders (without `node_modules` and `.git`) into `C:\Users\Nemo\Desktop\Pala_Nimrod_ITE18-FNHX1_ThreeJS_Activities\`, next to the 1.x folders. Then, in that folder's root `README.md`:
   - Add the three rows to the Activities table.
   - Change the "Parts 5 to 12" sentence so it also covers Activity 2 (Lights, Shadows, Haunted House).
   - Add a Notes bullet saying that Activity 2 uses the starter pack's Three.js r148 so the handout's light values match.
   - Don't touch anything else in that folder.
6. **Final report:** what's done, every deviation from the handout and why, and anything I still need to check by hand.

## Done when

- [ ] All three folders run with `npm install` + `npm run dev` and build with `npm run build`
- [ ] Each page's default view matches the handout's final screenshot (p.9, p.24, p.43)
- [ ] Every handout step is in the code, labeled with its section, and switchable where a later step replaces it
- [ ] No console errors
- [ ] `README.md` + `screenshot.png` in each activity, and `STUDY-GUIDE.md` at the root
- [ ] Copied to the submission folder, and its root `README.md` updated
