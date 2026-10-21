# Activity 2.1–2.3 Study Guide

This file is for you, not for submission. The folders to upload are `Activity 2.1 - Lights`, `Activity 2.2 - Shadows` and `Activity 2.3 - Haunted House`.

Run any activity:

```bash
cd "Activity 2.1 - Lights"
npm install      # only the first time
npm run dev      # opens the page in your browser
```

All three use the starter pack's versions (three.js r148, lil-gui 0.17, Vite 4), not r186 like Activities 1.5–1.12. From r155 on, lights use physical units, so the handout's intensity values (0.3, 0.5...) would give a much darker result. On r148 they work exactly as written.

---

## Activity 2.1: Lights

#### What the code does

- The starter has a sphere, a cube, a torus and a floor sharing one <mark>MeshStandardMaterial</mark> (roughness 0.4, so light reflections show). This material reacts to lights. MeshBasicMaterial would not.
- The handout first removes the starter's two lights to get a black render. They're kept in the code but switched off (the "Starter lights (removed)" folder in the panel).
- Then one block per light type, all on at once:
  - <mark>AmbientLight</mark> `(0xffffff, 0.5)`: lights every face equally from everywhere. Used to fake light bouncing off walls, which three.js doesn't calculate.
  - <mark>DirectionalLight</mark> `(0x00fffc, 0.3)` at `(1, 0.25, 0)`: parallel rays like the sun. Only the direction matters (from its position toward the center), not the distance.
  - <mark>HemisphereLight</mark> `(0xff0000, 0x0000ff, 0.3)`: red from the sky, blue from the ground. Faces pointing up get red, faces pointing down get blue.
  - <mark>PointLight</mark> `(0xff9000, 0.5, 10, 2)` at `(1, -0.5, 1)`: like a lighter, shining in every direction from one point. `distance` 10 and `decay` 2 make it fade.
  - <mark>RectAreaLight</mark> `(0x4e00ff, 2, 1, 1)`: a 1 × 1 rectangle of light, like a photo studio panel. `lookAt(new THREE.Vector3())` turns it toward the center. It only works with MeshStandardMaterial and MeshPhysicalMaterial.
  - <mark>SpotLight</mark> `(0x78ff00, 0.5, 10, Math.PI * 0.1, 0.25, 1)`: a cone like a flashlight. The arguments are color, intensity, distance, angle, penumbra (soft edge) and decay.
- The spotlight aims at its <mark>target</mark>, an invisible object. Moving `target.position.x` to -0.75 does nothing until the target is added to the scene with `scene.add(spotLight.target)`.
- <mark>Helpers</mark> draw where each light is and where it points. `RectAreaLightHelper` isn't in the THREE core, so it's imported from `three/examples/jsm/helpers/`.
- `spotLightHelper.update()` runs once on the next frame. The helper doesn't follow a moved target by itself, so without this the cone would point at the center instead of x = -0.75.
- Panel: one folder per light (on/off and intensity), plus "show helpers".

#### Likely questions

1. *Which lights are cheap and which are expensive?* Ambient and Hemisphere cost the least, Directional and Point cost a moderate amount, and Spot and RectArea cost the most. Each light adds work for the <mark>GPU (Graphics Processing Unit)</mark> on every pixel, so use as few as possible.
2. *Why doesn't the DirectionalLight's distance matter?* Its rays are treated as coming from infinitely far away, all parallel. Only the direction from its position to the center counts.
3. *Why did changing `spotLight.target.position.x` do nothing at first?* The target wasn't in the scene, so its world position was never updated. `scene.add(spotLight.target)` fixes it.
4. *What do the four PointLight arguments mean?* Color, intensity, distance (where the light reaches 0) and decay (how fast it fades). Without distance, the light never fades.
5. *Why does the scene look flat with only an AmbientLight?* Every face gets the same amount of light, so there's no shading. It looks like MeshBasicMaterial.

#### Try this

in the panel, turn off every light except the HemisphereLight. The tops of the objects turn red and the bottoms blue. Then turn on only the SpotLight and drag its intensity up to see the green cone on the floor.

---

## Activity 2.2: Shadows

#### What the code does

- The back of an object being dark is the <mark>core shadow</mark>; lights already do that. This activity adds the <mark>drop shadow</mark>, the shadow an object throws onto another one.
- How it works: before the normal render, three.js renders the scene from each shadow-casting light's point of view. The result is a texture called a <mark>shadow map</mark>, which is then projected onto the objects that receive shadows.
- Real-time shadows, in handout order:
  - `renderer.shadowMap.enabled = true`, then `sphere.castShadow` and `plane.receiveShadow`, then `directionalLight.castShadow`. Only Point, Directional and Spot lights can cast shadows.
  - <mark>mapSize</mark> 1024 × 1024 (default 512) for a sharper shadow. It must be a power of 2.
  - The light's shadow camera: <mark>near/far</mark> 1 and 6. For the DirectionalLight it's an orthographic camera, so its <mark>amplitude</mark> is set with `top/right/bottom/left = ±2`. A smaller box gives a more precise shadow, but too small crops it. A <mark>CameraHelper</mark> shows this box.
  - `shadow.radius = 10` blurs the shadow, but only with the default shadow type.
  - `renderer.shadowMap.type = THREE.PCFSoftShadowMap`. <mark>PCF (Percentage-Closer Filtering)</mark> soft gives smoother edges but ignores `radius`. The handout says to choose: I kept PCFSoft.
  - A SpotLight `(0xffffff, 0.3, 10, Math.PI * 0.3)` at (0, 2, 2), with a shadow camera that's a perspective camera, so it uses <mark>fov (Field of View)</mark> 30 instead of top/right/bottom/left.
  - A PointLight `(0xffffff, 0.3)` at (-1, 1, 0). It renders its shadow 6 times, once per direction (a cube shadow map), so it's the most expensive one.
  - The other lights go down to 0.3 so the scene isn't too bright.
- <mark>Baked shadows</mark>: real-time shadows off, and the plane uses a `MeshBasicMaterial` whose texture (`bakedShadow.jpg`) already has the shadow painted in. It looks great and costs nothing, but it can't move.
- <mark>Simple shadow</mark> (the default, the handout's final state):
  - The plane gets the normal material back. A small black plane with `simpleShadow.jpg` as its <mark>alphaMap</mark> (white = visible, black = invisible) sits just above the floor (`+ 0.01` to avoid z-fighting).
  - In `tick()`, the sphere circles (`cos`/`sin` × 1.5) and bounces (`Math.abs(Math.sin(t * 3))`). The shadow follows its x/z, and its opacity is `(1 - y) * 0.3`, so it fades as the sphere goes up.
- Panel: "Shadow technique" (Real-time / Baked / Simple) and "camera helpers". The sphere only moves in Simple, because the baked texture can't follow it.

#### Likely questions

1. *Which three things must be set for a real-time shadow?* `renderer.shadowMap.enabled`, `castShadow` on the light and the object that throws the shadow, and `receiveShadow` on the object it falls on.
2. *Why does a bigger mapSize look better, and what does it cost?* The shadow map is a texture. More pixels means sharper edges but more memory and slower renders. It must be a power of 2 (512, 1024, 2048) because of mipmapping.
3. *What's the difference between PCFShadowMap, PCFSoftShadowMap and VSMShadowMap?* PCF (Percentage-Closer Filtering) is the default with smooth edges. PCFSoft is softer, but `radius` is ignored. <mark>VSM (Variance Shadow Map)</mark> is less performant and can give unexpected results. BasicShadowMap is the fastest and looks the worst.
4. *Why is the PointLight's shadow the most expensive?* It shines in all directions, so three.js renders the shadow map 6 times (a cube), once per direction.
5. *Why use the simple-shadow trick at all?* It's one transparent plane: no shadow-map renders, so it runs fast even on phones, and unlike a baked shadow it can move with the object.

#### Try this

switch to Real-time and tick "camera helpers" to see each light's shadow camera. Then switch to Baked and orbit around: the shadow stays even though nothing in the scene is casting it.

---

## Activity 2.3: Haunted House

#### What the code does

- <mark>Units</mark>: 1 unit = 1 meter here, so the walls are 2.5 high and the door about 2.2.
- <mark>House</mark>: a `Group` holds everything, so the house can be moved or scaled as one.
  - Walls: `BoxGeometry(4, 2.5, 4)`, raised by half its height (y = 1.25) so it isn't half underground.
  - Roof: a `ConeGeometry(3.5, 1, 4)` with only 4 sides is a pyramid. It's turned 45° (`Math.PI * 0.25`) to line up with the walls, at y = `2.5 + 0.5` (top of the walls + half the cone).
  - Door: a plane at z = `2 + 0.01`. The extra 0.01 avoids <mark>z-fighting</mark> (two faces in the same place flickering).
  - 4 bushes share one geometry and one material, which is faster.
- <mark>Graves</mark>: 50 in a loop. A random angle (0 to 2π) and a random radius (3 to 9) give `x = cos(angle) * radius` and `z = sin(angle) * radius`, which is a random ring around the house. Each grave is tilted a little. They all share one geometry and one material.
- <mark>Lights</mark>:
  - Ambient and moon lights dimmed to `'#b9d5ff', 0.12` (blue-ish).
  - A warm `doorLight` PointLight `('#ff7d46', 1, 7)` above the door, added to the house group.
- <mark>Fog</mark> `('#262837', 1, 15)` starts 1 unit from the camera and is fully opaque at 15. `renderer.setClearColor('#262837')` makes the background the same color, so there's no hard edge.
- <mark>Textures</mark>:
  - The door uses all 7 door maps: color, alpha, ambient occlusion, height (displacement, so the plane needs 100 × 100 subdivisions), normal, metalness and roughness.
  - The walls use 4 brick maps and the floor 4 grass maps. The grass is repeated 8 × 8 with `RepeatWrapping`.
  - The <mark>aoMap (Ambient Occlusion map)</mark> darkens creases. In r148 it reads a second set of UVs called `uv2`, so the code copies `uv` into `uv2` on the door, walls and floor. UV means the texture's 2D coordinates, u across and v up.
- <mark>Ghosts</mark>: three PointLights (magenta, cyan, yellow; intensity 2, distance 3) moved in `tick()` with `cos`/`sin` on circles of radius 4, 5 and about 7. Their y uses `sin` waves, so they dip through the floor.
- <mark>Shadows</mark>:
  - The moon, door light and 3 ghosts cast shadows, and so do the walls, the bushes and every grave (set inside the loop). The floor receives them.
  - mapSize 256 on all five lights for performance, `shadow.camera.far` 15 for the moon and 7 for the others, and `PCFSoftShadowMap`.
- Panel: light controls from the starter, plus "temporary sphere" (the starter scene), "textures" (off = the temporary colors and the first 2 × 2 door), "fog" and "shadows".

#### Likely questions

1. *Why put the house in a Group?* So you can move, rotate or scale the whole house at once. The door light is added to the group too, so it follows the house.
2. *How are the graves placed on a circle?* Pick a random angle, then `cos(angle)` gives x and `sin(angle)` gives z. Multiplying by a random radius between 3 and 9 makes a ring around the house instead of a perfect circle.
3. *Why `setClearColor` with the fog color?* The fog fades objects toward its color, but the empty background stays black. Using the same color hides the edge where the graves end.
4. *Why add the `uv2` attribute?* In this version of three.js, the aoMap reads `uv2`, a second set of texture coordinates. Copying `uv` into it makes the ambient occlusion show. (From r151 on, this isn't needed anymore.)
5. *Why reduce the shadow mapSize to 256?* There are 5 shadow-casting lights, and the 4 PointLights each render 6 times. Small maps keep the frame rate up, and the blurry shadows suit a foggy night anyway.

#### Try this

untick "textures" to see the scene before the Textures section, then untick "fog" to see why the fog matters. Or change `for(let i = 0; i < 50; i++)` to 100 and reload: twice as many graves, placed differently each time.

---

## Submission checklist
- Folder names are `Activity 2.1 - Lights`, `Activity 2.2 - Shadows`, `Activity 2.3 - Haunted House`. They're also copied to `Pala_Nimrod_ITE18-FNHX1_ThreeJS_Activities` next to the 1.x folders. Don't upload `Activity 2 Starter Pack`, `handout`, `PROMPT.md` or this file.
- Don't upload `node_modules/` or `dist/`. `npm install` and `npm run build` recreate them.
- Each folder has a `screenshot.png` of the default view.
