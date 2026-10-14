/**
 * Activity 2.2 - Shadows
 * Nimrod P. Pala | ITE 18-FNHX1 | ITE-18 Applications Development and Emerging Technologies
 *
 * The handout builds three shadow techniques, each one replacing the one before:
 * real-time shadows, baked shadows, and the simple-shadow alternative.
 * All three are kept below in their own labeled blocks, and the "Shadow technique"
 * dropdown in the debug panel switches between them live.
 * The final state of the handout (Simple: a bouncing sphere with a fake shadow) is the default.
 */
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'

/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const bakedShadow = textureLoader.load('/textures/bakedShadow.jpg')
const simpleShadow = textureLoader.load('/textures/simpleShadow.jpg')

/**
 * Lights
 */
// Ambient light
// Intensity: 0.5 in the starter, 0.4 in the SpotLight section, 0.3 in the PointLight section
const ambientLight = new THREE.AmbientLight(0xffffff, 0.3)
gui.add(ambientLight, 'intensity').min(0).max(1).step(0.001)
scene.add(ambientLight)

// Directional light
// Intensity: 0.5 in the starter, 0.4 in the SpotLight section, 0.3 in the PointLight section
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.3)
directionalLight.position.set(2, 2, - 1)
gui.add(directionalLight, 'intensity').min(0).max(1).step(0.001)
gui.add(directionalLight.position, 'x').min(- 5).max(5).step(0.001)
gui.add(directionalLight.position, 'y').min(- 5).max(5).step(0.001)
gui.add(directionalLight.position, 'z').min(- 5).max(5).step(0.001)

// --- How to activate shadows ---
directionalLight.castShadow = true

// Handout step to look at the shadow settings (commented out to keep the console clean)
// console.log(directionalLight.shadow)

// --- Shadow map optimisations: Render size ---
directionalLight.shadow.mapSize.width = 1024
directionalLight.shadow.mapSize.height = 1024

// --- Shadow map optimisations: Near and far ---
directionalLight.shadow.camera.near = 1
directionalLight.shadow.camera.far = 6

// --- Shadow map optimisations: Amplitude ---
directionalLight.shadow.camera.top = 2
directionalLight.shadow.camera.right = 2
directionalLight.shadow.camera.bottom = - 2
directionalLight.shadow.camera.left = - 2

// --- Shadow map optimisations: Blur ---
// Ignored with PCFSoftShadowMap (see the Renderer section); kept as in the handout
directionalLight.shadow.radius = 10

scene.add(directionalLight)

const directionalLightCameraHelper = new THREE.CameraHelper(directionalLight.shadow.camera)
directionalLightCameraHelper.visible = false
scene.add(directionalLightCameraHelper)

// --- SpotLight ---
// Intensity: 0.4 when added, 0.3 in the PointLight section
const spotLight = new THREE.SpotLight(0xffffff, 0.3, 10, Math.PI * 0.3)
spotLight.castShadow = true
spotLight.shadow.mapSize.width = 1024
spotLight.shadow.mapSize.height = 1024
spotLight.shadow.camera.fov = 30
// Deviation from handout: in three.js r148 the spotlight's shadow camera fov is recomputed from
// light.angle * shadow.focus on every frame, so fov = 30 alone is overwritten. focus gives the same 30°.
spotLight.shadow.focus = THREE.MathUtils.degToRad(30) / (2 * spotLight.angle)
spotLight.shadow.camera.near = 1
// far is also replaced by the light's distance (10) in r148; that only makes the shadow range longer
spotLight.shadow.camera.far = 6
spotLight.position.set(0, 2, 2)
scene.add(spotLight)
scene.add(spotLight.target)

const spotLightCameraHelper = new THREE.CameraHelper(spotLight.shadow.camera)
spotLightCameraHelper.visible = false
scene.add(spotLightCameraHelper)

// --- PointLight ---
const pointLight = new THREE.PointLight(0xffffff, 0.3)
pointLight.castShadow = true
pointLight.shadow.mapSize.width = 1024
pointLight.shadow.mapSize.height = 1024
pointLight.shadow.camera.near = 0.1
pointLight.shadow.camera.far = 5
pointLight.position.set(- 1, 1, 0)
scene.add(pointLight)

const pointLightCameraHelper = new THREE.CameraHelper(pointLight.shadow.camera)
pointLightCameraHelper.visible = false
scene.add(pointLightCameraHelper)

/**
 * Materials
 */
const material = new THREE.MeshStandardMaterial()
material.roughness = 0.7
gui.add(material, 'metalness').min(0).max(1).step(0.001)
gui.add(material, 'roughness').min(0).max(1).step(0.001)

/**
 * Objects
 */
const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 32, 32),
    material
)
sphere.castShadow = true

const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(5, 5),
    material
)
plane.receiveShadow = true
plane.rotation.x = - Math.PI * 0.5
plane.position.y = - 0.5

// Baking shadows alternative: a black plane with the halo texture as alphaMap, just above the floor
const sphereShadow = new THREE.Mesh(
    new THREE.PlaneGeometry(1.5, 1.5),
    new THREE.MeshBasicMaterial({
        color: 0x000000,
        transparent: true,
        alphaMap: simpleShadow
    })
)
sphereShadow.rotation.x = - Math.PI * 0.5
sphereShadow.position.y = plane.position.y + 0.01

scene.add(sphere, sphereShadow, plane)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 1
camera.position.y = 1
camera.position.z = 2
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

// --- How to activate shadows ---
renderer.shadowMap.enabled = true

// --- Shadow map algorithm ---
// PCFSoftShadowMap gives softer edges but ignores shadow.radius. The handout says to choose: I kept PCFSoft.
renderer.shadowMap.type = THREE.PCFSoftShadowMap

/**
 * Shadow techniques
 */
// --- Real-time shadows (How to activate shadows to PointLight) ---
const useRealTimeShadows = () =>
{
    directionalLight.castShadow = true
    spotLight.castShadow = true
    pointLight.castShadow = true
    renderer.shadowMap.enabled = true

    plane.material = material
    sphereShadow.visible = false
}

// --- Baking shadows ---
// Real-time shadows are switched off on the lights and the renderer,
// and the plane uses a MeshBasicMaterial with the shadow already painted in the texture
const bakedShadowMaterial = new THREE.MeshBasicMaterial({
    map: bakedShadow
})

const useBakedShadows = () =>
{
    directionalLight.castShadow = false
    spotLight.castShadow = false
    pointLight.castShadow = false
    renderer.shadowMap.enabled = false

    plane.material = bakedShadowMaterial
    sphereShadow.visible = false
}

// --- Baking shadows alternative ---
// The plane gets the MeshStandardMaterial back and the sphereShadow halo follows the sphere
const useSimpleShadows = () =>
{
    directionalLight.castShadow = false
    spotLight.castShadow = false
    pointLight.castShadow = false
    renderer.shadowMap.enabled = false

    plane.material = material
    sphereShadow.visible = true
}

const shadowTechniques = {
    'Real-time': useRealTimeShadows,
    'Baked': useBakedShadows,
    'Simple': useSimpleShadows
}

/**
 * Debug UI
 */
const parameters = {
    shadowTechnique: 'Simple',
    cameraHelpers: false
}

const setShadowTechnique = (name) =>
{
    shadowTechniques[name]()

    // In r148 the shaders have to be recompiled after renderer.shadowMap.enabled changes
    material.needsUpdate = true

    // The sphere only moves in the Simple technique (the baked texture can't follow it)
    if(name !== 'Simple')
    {
        sphere.position.set(0, 0, 0)
    }
}

gui
    .add(parameters, 'shadowTechnique', Object.keys(shadowTechniques))
    .name('Shadow technique')
    .onChange(setShadowTechnique)

const cameraHelpers = [
    [directionalLight, directionalLightCameraHelper],
    [spotLight, spotLightCameraHelper],
    [pointLight, pointLightCameraHelper]
]

gui
    .add(parameters, 'cameraHelpers')
    .name('camera helpers')
    .onChange((visible) =>
    {
        for(const [light, helper] of cameraHelpers)
        {
            // A CameraHelper only reads its camera when created, and the handout
            // changes near/far/amplitude after that, so redraw it before showing it.
            // updateMatrices places the shadow camera even when no shadow is rendered
            // (5 = the PointLight's last, downward render; the other lights ignore it)
            light.shadow.updateMatrices(light, 5)
            light.shadow.camera.updateProjectionMatrix()
            helper.update()
            helper.visible = visible
        }
    })

setShadowTechnique(parameters.shadowTechnique)

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    if(parameters.shadowTechnique === 'Simple')
    {
        // Update the sphere
        sphere.position.x = Math.cos(elapsedTime) * 1.5
        sphere.position.z = Math.sin(elapsedTime) * 1.5
        sphere.position.y = Math.abs(Math.sin(elapsedTime * 3))

        // Update the shadow
        sphereShadow.position.x = sphere.position.x
        sphereShadow.position.z = sphere.position.z
        sphereShadow.material.opacity = (1 - sphere.position.y) * 0.3
    }

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()
