# Claude Code prompt: ITE-18 Activity 3.4–3.6 (Physics, Imported Models, Raycaster and Mouse Events)

> **How to start:** open a terminal in this folder (`C:\Users\Nemo\Desktop\Dev-Workspace\ite18-activity-3.4-3.6`), run `claude`, and type:
> **Read PROMPT.md and do everything in it.**

> **Deadline:** no Classroom submission post for 3.4–3.6 yet (only the "Three.Js Activity 3.4 -3.6 Materials" post from Oct 19). Work in order 3.4, then 3.5, then 3.6, and finish each one fully before starting the next.

---

## Context

I'm **Nimrod P. Pala**, section **ITE 18-FNHX1**, Caraga State University.
Course: **ITE-18 Applications Development and Emerging Technologies**. Instructor: **James Earl D. Cubillas**.

Build Activities 3.4–3.6 of the course's "Introduction to Three.js" handouts as **three separate Vite projects** inside this folder:

| Folder to create | Handout | Pages | Final screenshot | Copy from starter |
| --- | --- | --- | --- | --- |
| `Activity 3.4 - Physics` | `handout/Activity_3.4.pdf` (Part 4) | **1–24 only** | p.21 | `Activity 3.4-3.6 Starter Pack/Activity 3.4 Physics` |
| `Activity 3.5 - Imported Models` | `handout/Activity_3.5.pdf` (Part 5) | 16 | p.15 (top) | `Activity 3.4-3.6 Starter Pack/Activity 3.5 Imported Models` |
| `Activity 3.6 - Raycaster and Mouse Events` | `handout/Activity_3.6.pdf` (Part 6) | 17 | p.12 (duck + spheres) and the p.17 final code | `Activity 3.4-3.6 Starter Pack/Activity 3.6  Raycaster and Mouse Events` |

Two things to know about the files:

- The 3.6 starter folder name has **two spaces** after "3.6". The new folder name has one.
- `Activity_3.4.pdf` is 40 pages long. Pages 25–40 are a copy of the 3.5 handout, so use `Activity_3.5.pdf` for 3.5. All page numbers below for 3.5 refer to `Activity_3.5.pdf`.

## What's in this folder

- `handout/` has the three PDF handouts. They are the **source of truth**: every code snippet is in them, with a screenshot of the expected result after each step. Read them in page ranges (max 20 pages per read).
- `Activity 3.4-3.6 Starter Pack/` has the instructor's three starter projects (three `^0.148.0`, lil-gui `^0.17.0`, vite `^4.0.4`; 3.4 also has `cannon-es ^0.20.0`). **Don't edit them.** Copy them. What they include:
  - **3.4:** a sphere on a floor with shadows. It also has the sphere/box geometries and materials pre-made in a "Utils" section, `environmentMaps/0–4`, and `static/sounds/hit.mp3`.
  - **3.5:** an empty floor with an AmbientLight and a DirectionalLight, plus `static/models/Duck` (4 formats), `FlightHelmet` and `Fox`. There is **no `draco` folder**; see gap #4.
  - **3.6:** three red spheres, plus `static/draco/` and `static/models/Duck`.
- `transcripts/` has the auto-generated captions of the instructor's three recorded videos. They're a messy Bisaya/English mix, so **don't** build from them. Everything useful in them is already summarized under "Gaps in the handouts" below.
- `PROMPT.md` is this file.

My earlier work, for conventions. **Read these, don't modify them:**

- `C:\Users\Nemo\Desktop\Pala_Nimrod_ITE18-FNHX1_ThreeJS_Activities\` is my submission repo. Look at the root `README.md` and at `Activity 2.3 - Haunted House\` (`README.md`, `package.json`, `.gitignore`, `src\index.html`, `src\script.js`, `screenshots\`), and copy their style. The 3.1–3.3 folders may be there too, if that session has finished; if so, match them.
- `C:\Users\Nemo\Desktop\Dev-Workspace\ite18-activity-2\STUDY-GUIDE.md` shows the format for the study guide.

## Rules

1. **Keep the starter's pinned versions** (`three ^0.148.0`, `lil-gui ^0.17.0`, `vite ^4.0.4`, and `cannon-es ^0.20.0` in 3.4). Don't upgrade and don't add other dependencies.
2. **Follow the handout exactly**: same values, same order. When a later step replaces an earlier one, **don't delete the earlier code**. Examples:
   - the single sphere replaced by `createSphere()`
   - the concrete/plastic materials replaced by the default material
   - the Duck replaced by the FlightHelmet, then the Fox
   - the fixed ray replaced by the mouse ray

   For each of these:
   - Keep each technique in its own block with a comment header naming the handout section.
   - Make the blocks switchable from the lil-gui panel, the way Activity 2 did.
   - **The default state on page load = the handout's final state.**
3. If something in the handout doesn't work as written, make the smallest fix and add a one-line `// Deviation from handout: ...` comment explaining why.
   - Where the fix comes from the video, use `// From the instructor's video (missing from the handout): ...` instead.
4. **Personalize like Activity 2.3:**
   - A header comment in `script.js` with the activity name, my name, section and course.
   - `<title>Activity 3.4 - Physics | Nimrod P. Pala</title>` (etc.) and `<link rel="icon" href="data:,">`.
   - The starter's 3.4 title has a typo, "Acitivity". Fix it.
   - `package.json`: kebab-case name (`activity-3-4-physics`, `activity-3-5-imported-models`, `activity-3-6-raycaster-and-mouse-events`), plus `description`, `author` and a `"preview": "vite preview"` script, like 2.3.
   - A `.gitignore` with `node_modules` and `dist`.
5. Keep the starter's `vite.config.js` (`root: 'src/'`, `publicDir: '../static/'`). Assets load the way the handout writes them:
   - `'/sounds/hit.mp3'`
   - `'/models/Duck/glTF/Duck.gltf'`
   - `'/draco/'`
   - `'./models/Duck/glTF-Binary/Duck.glb'` in 3.6
6. This is Windows (PowerShell), and the folder names have spaces (and one double space), so quote every path.
7. Only work inside this folder, apart from the copy step at the end. Don't add extras beyond the handout and the video notes below. In particular, skip the handout's "go further" ideas: constraints, workers, Ammo.js and Physijs in 3.4.
8. Use the **caveman**, **ponytail** and **superpowers** plugins if they're installed.

## Gaps in the handouts (from the instructor's videos and the starter)

These are places where the handout, the starter and r148 don't match, or where the video shows a fix. Everything else: follow the handout.

1. **3.4 uses `cannon-es`, not `cannon`.** The handout says `npm install --save cannon` and `import CANNON from 'cannon'`, and only switches to cannon-es at the end (p.23). The starter already depends on `cannon-es ^0.20.0`, the version the handout says it tested.
   - Use `import * as CANNON from 'cannon-es'` from the start, and don't install `cannon`.
   - The API is the same for everything in this handout.
   - Add a deviation comment.
2. **3.4 floor height.** The starter puts the Three.js floor at `floor.position.y = - 0.5`, but the Cannon.js plane is at y = 0, so the ball stops floating half a unit above the visible floor.
   - The instructor hit this in the video and fixed it by putting the Three.js floor at y = 0. Do the same.
   - It also matches the handout's screenshots.
3. **3.4 sphere geometry size.** The starter's pre-made `sphereGeometry` is `SphereGeometry(0.5, 32, 32)`. The handout's "Optimize" step (p.14) needs `SphereGeometry(1, 20, 20)` because the mesh is scaled by `radius`.
   - Use the handout's geometry, or every sphere will look half the size of its physics body.
   - The early single-sphere step can keep using a radius-0.5 geometry.
4. **3.4 order of declarations.** In the video the instructor got "Cannot access ... before initialization" errors. The fix is the handout's own instruction:
   - Create the Cannon `Material`s and the `ContactMaterial` **before** the bodies that use them.
   - `debugObject`'s functions come **after** `createSphere` / `createBox` are defined.
5. **3.5 Draco decoder path.** The handout says to copy `/node_modules/three/examples/js/libs/draco/` into `static/` (p.11). That folder doesn't exist in r148, which removed `examples/js`.
   - Copy `node_modules/three/examples/jsm/libs/draco/` to `static/draco/` instead. It's byte-for-byte the same as the `static/draco/` already in the 3.6 starter.
   - Then use `dracoLoader.setDecoderPath('/draco/')` as written.
6. **3.5 Fox scale.** The handout uses `0.025` on p.12 but `0.03` in the code block on p.14. The video uses `0.025`.
   - Use **0.025**, and add a deviation comment noting the handout's inconsistency.
7. **3.4 sounds in Chrome.** Chrome won't play `hit.mp3` until you've clicked the page, as the handout says. That's expected, not a bug.

## Per-activity notes

### 3.4 Physics (handout pages 1–24)

- **Step 1: single sphere (p.4–10), in handout order:**
  1. `world = new CANNON.World()` and `world.gravity.set(0, - 9.82, 0)`.
  2. The sphere body: `sphereShape = new CANNON.Sphere(0.5)`, `sphereBody` (mass 1, position `(0, 3, 0)`), `world.addBody`.
  3. `world.step(1 / 60, deltaTime, 3)` in `tick`, using the starter's `oldElapsedTime` delta. Then `sphere.position.copy(sphereBody.position)`.
  4. The floor body: `CANNON.Plane`, mass 0, `floorBody.quaternion.setFromAxisAngle(new CANNON.Vec3(- 1, 0, 0), Math.PI * 0.5)`.
  5. Contact materials:
     - `concrete` / `plastic` with `ContactMaterial` friction 0.1, restitution 0.7, assigned to the bodies.
     - Then replace them with one `default` material + `defaultContactMaterial` (same values), and set `world.defaultContactMaterial = defaultContactMaterial`.
     - Then remove the per-body material assignment (p.9).
  6. Forces:
     - `sphereBody.applyLocalForce(new CANNON.Vec3(150, 0, 0), new CANNON.Vec3(0, 0, 0))` once at the start.
     - Wind: `sphereBody.applyForce(new CANNON.Vec3(- 0.5, 0, 0), sphereBody.position)` in `tick`, **before** `world.step`.
- **Step 2: multiple objects = final state:**
  - Remove/comment the single sphere (p.10). `createSphere(radius, position)` makes both the mesh and the body (p.10–11). Push `{ mesh, body }` into `objectsToUpdate`, and copy position + quaternion in `tick` (p.12, p.16).
  - `debugObject` with `createSphere` (random radius `Math.random() * 0.5`, x/z `(Math.random() - 0.5) * 3`, y 3), `createBox` and `reset` buttons (p.12–15, p.21–22).
  - Optimized shared geometries/materials (p.14, gap #3). `createBox(width, height, depth, position)` uses `CANNON.Box(new CANNON.Vec3(width * 0.5, height * 0.5, depth * 0.5))` (p.15).
  - On load: **one** `createBox(1, 1.5, 2, { x: 0, y: 3, z: 0 })`, with no first `createSphere` call (p.15).
  - Performance: `world.broadphase = new CANNON.SAPBroadphase(world)` and `world.allowSleep = true` (p.17).
  - Hit sound:
    - `new Audio('/sounds/hit.mp3')`.
    - `body.addEventListener('collide', playHitSound)` on boxes **and** spheres (p.18, p.21).
    - Play only if `collision.contact.getImpactVelocityAlongNormal() > 1.5`, with `volume = Math.random()` and `currentTime = 0` (p.19–20).
  - `reset`: `removeEventListener('collide', playHitSound)`, `world.removeBody`, `scene.remove`, then `objectsToUpdate.splice(0, objectsToUpdate.length)` (p.21–22).
- **Final state (p.21):** one box falls onto the floor on load. The panel has createSphere / createBox / reset. Clicking the buttons rains bouncing spheres and tumbling boxes with hit sounds.
- GUI (besides the three buttons):
  - a **"Step 1 - single sphere demo"** button that calls `reset` and then runs the step-1 sphere (with its 150 push)
  - a **"Wind"** toggle, **off** by default, that applies the step-1 wind to that sphere
  - a **"Contact material"** dropdown: Concrete + plastic / Default, default **Default**

### 3.5 Imported Models (`Activity_3.5.pdf`, 16 pages)

- **Steps, in handout order:**
  1. Import `GLTFLoader` from `'three/examples/jsm/loaders/GLTFLoader.js'` and load `'/models/Duck/glTF/Duck.gltf'` with the success, progress and error callbacks (p.4–5). Then trim to just the success callback.
  2. `scene.add(gltf.scene.children[0])` (p.6). The Binary and Embedded duck paths are also on p.6.
  3. FlightHelmet (p.7–9), each attempt kept:
     - `children[0]` (only a few parts)
     - the buggy `for...of` loop
     - `while(gltf.scene.children.length)`
     - the spread copy `[...gltf.scene.children]`
     - finally `scene.add(gltf.scene)`
  4. Draco duck `'/models/Duck/glTF-Draco/Duck.gltf'`:
     - Import `DRACOLoader` from `'three/examples/jsm/loaders/DRACOLoader.js'`.
     - `dracoLoader.setDecoderPath('/draco/')` (gap #5), then `gltfLoader.setDRACOLoader(dracoLoader)`.
     - (p.9–11)
  5. Fox `'/models/Fox/glTF/Fox.gltf'`, scaled with `gltf.scene.scale.set(0.025, 0.025, 0.025)` (gap #6) and `scene.add(gltf.scene)` (p.12).
     - Set up `let mixer = null`, `mixer = new THREE.AnimationMixer(gltf.scene)`, `mixer.clipAction(gltf.animations[...]).play()`.
     - In `tick`: `if(mixer) mixer.update(deltaTime)`, using the starter's `previousTime` delta (p.13–14).
     - The final clip is `gltf.animations[2]` (run) (p.15).
  6. The Three.js editor part (p.15–16) has no code. Skip it, but mention it in the README as something I tried by hand.
- **Final state (p.15 top):** the low-poly fox **running** on the grey floor, seen from the starter camera at (2, 2, 2) looking at (0, 0.75, 0).
- GUI:
  - a **"Model"** dropdown: Duck (glTF) / Duck (Binary) / Duck (Embedded) / Duck (Draco) / Flight Helmet / Fox, default **Fox**. Switching removes the previous model from the scene and sets `mixer` back to `null`.
  - a **"Helmet add method"** dropdown: children[0] / for...of (buggy) / while loop / spread copy / gltf.scene, default **gltf.scene**
  - a **"Fox animation"** dropdown: 0 Survey / 1 Walk / 2 Run, default **Run**. The video tried all three.

### 3.6 Raycaster and Mouse Events (17 pages)

- **Steps, in handout order:**
  1. **Fixed ray, cast once (p.2–3):**
     - `raycaster = new THREE.Raycaster()`
     - `rayOrigin (- 3, 0, 0)`, `rayDirection (10, 0, 0).normalize()`, `raycaster.set(...)`
     - `intersectObject(object2)` and `intersectObjects([object1, object2, object3])` logged
  2. **Test on each frame (p.4–6):**
     - Remove the one-off code.
     - Animate the spheres: `y = Math.sin(elapsedTime * 0.3) * 1.5`, `* 0.8`, `* 1.4`.
     - Cast the fixed ray in `tick` with direction `(1, 0, 0)` and `objectsToTest`.
     - Set all spheres red `'#ff0000'`, then set the intersected ones blue `'#0000ff'`.
  3. **Mouse hover (p.7–8):**
     - Comment out the fixed ray.
     - `mouse = new THREE.Vector2()`, with `mousemove` setting `mouse.x = event.clientX / sizes.width * 2 - 1` and `mouse.y = - (event.clientY / sizes.height) * 2 + 1`.
     - In `tick`: `raycaster.setFromCamera(mouse, camera)`. Hovered spheres go blue; the rest go red via `intersects.find(...)`.
  4. **Mouse enter / leave (p.8–9):** `let currentIntersect = null`, logging `'mouse enter'` / `'mouse leave'`.
  5. **Click (p.9–10):** a `window` `'click'` listener with the `switch(currentIntersect.object)` logging `'click on object 1/2/3'`.
  6. **Model:**
     - Import `GLTFLoader`, `let model = null`, load `'./models/Duck/glTF-Binary/Duck.glb'`, `model = gltf.scene`, `model.position.y = - 1.2`, `scene.add(model)` (p.10–14).
     - Add `AmbientLight('#ffffff', 0.3)` and `DirectionalLight('#ffffff', 0.7)` at `(1, 2, 3)` (p.12).
     - In `tick`: `if(model)` → `raycaster.intersectObject(model)` → `model.scale.set(1.2, 1.2, 1.2)` while hovered, else `(1, 1, 1)` (p.15–17).
- Declare `mouse` and its listener **above** the `tick()` call. The instructor got a "mouse before initialization" error in the video.
- **Final state:** three red spheres bobbing at different speeds, each turning blue while the cursor is over it, and the duck below them growing to 1.2× while hovered. The console logs enter/leave/click.
- GUI:
  - a **"Ray mode"** dropdown: Fixed ray (step 2) / Mouse (final), default **Mouse**
  - a **"Animate spheres"** toggle (on)
  - a **"Show duck"** toggle (on)

## Workflow

1. Read this whole file, then `handout/Activity_3.4.pdf` pages 1–24, then Activity 2.3 in the submission repo for conventions. Write a short plan and start; no need to wait for my approval.
2. `git init` this folder (keep the starter pack, handout and transcripts in it). Commit after each finished activity. Don't push anywhere.
3. For each activity, in order 3.4, then 3.5, then 3.6:
   1. Copy the starter folder to its new name (table above), personalize it (rule 4), and run `npm install`.
   2. Build it step by step from the handout, using the notes above.
   3. **Verify:**
      - `npm run build` passes.
      - Run `npm run dev` and confirm there are no console errors: missing models or textures, the "No DRACOLoader instance provided" warning, "before initialization" errors. The handout's own `console.log` lines are fine.
      - If you have a browser tool (Playwright, Claude in Chrome, etc.):
        - Open the page and compare it with the handout's final screenshot.
        - Save `screenshot.png` (about 1280×720) in the activity folder.
          - For 3.4, click createSphere and createBox a few times first.
          - For 3.6, put the cursor over one sphere so it's blue.
        - Save a `screenshots/` folder with one numbered picture per handout step, named like Activity 2.3's (`01-sphere-falls.png`, `02-sphere-on-floor.png`, ...). Use the GUI switches to reach the earlier steps.
        - Save a short `recording.mp4` (10–20 s):
          - 3.4: boxes and spheres being dropped
          - 3.5: the fox running, then switching models
          - 3.6: hovering the spheres and the duck
      - If you don't have a browser tool, tell me exactly what I should see so I can check it myself, and list which images are still missing.
   4. Write the activity's `README.md` in the 2.3 format:
      - Student / Section / Instructor
      - the screenshot, plus a line pointing to `screenshots/` and `recording.mp4`
      - "What it does" (3–4 plain bullets)
      - "How to run"
   5. Commit.
4. Write `STUDY-GUIDE.md` at the root of this folder. It's **for me, not for submission**.
   - Cover 3.4–3.6 in the format of `ite18-activity-2\STUDY-GUIDE.md`: "What the code does", "Likely questions" (4–5 per activity, with answers), "Try this".
   - Highlight key terms with `<mark>…</mark>` instead of bold. Plain bold is hard for me to read.
   - Spell out every acronym the first time it appears in each section, e.g.:
     - glTF → GL Transmission Format (GL = Graphics Library)
     - GLB → glTF Binary
     - SAP → Sweep and Prune
     - CPU → Central Processing Unit
     - GPU → Graphics Processing Unit
     - wasm → WebAssembly
     - JSON → JavaScript Object Notation
     - UV → the texture's U and V coordinate axes
     - WebGL → Web Graphics Library
     - GUI → Graphical User Interface
5. **Copy to the submission folder.** Copy the three finished activity folders (without `node_modules` and `.git`) into `C:\Users\Nemo\Desktop\Pala_Nimrod_ITE18-FNHX1_ThreeJS_Activities\`, next to the other activity folders.
   - Then **re-read** that folder's root `README.md` right before editing it, because the 3.1–3.3 session may have just changed it.
   - Add the three rows (3.4, 3.5, 3.6) to the Activities table, in the same style, after 3.3 if it's there.
   - Make the intro sentence also cover Physics, Imported Models, and Raycaster and Mouse Events.
   - Update the Notes bullets:
     - The screenshots / recording note covers these folders too.
     - The r148 note covers these too.
     - Add one bullet: 3.4 uses cannon-es 0.20 (the maintained fork of Cannon.js the handout recommends), and 3.5's Draco decoder comes from r148's `examples/jsm/libs/draco`.
   - Don't touch anything else in that folder.
6. **Final report:** what's done, every deviation from the handout and why, and anything I still need to check by hand.

## Done when

- [ ] All three folders run with `npm install` + `npm run dev` and build with `npm run build`
- [ ] Each page's default view matches the handout's final state (3.4 p.21, 3.5 p.15, 3.6 p.12 + p.17)
- [ ] Every handout step is in the code, labeled with its section, and switchable where a later step replaces it
- [ ] No console errors, and hit sounds play after the first click in 3.4
- [ ] `README.md`, `screenshot.png`, `screenshots/` and `recording.mp4` in each activity, and `STUDY-GUIDE.md` at the root
- [ ] Copied to the submission folder, and its root `README.md` updated
