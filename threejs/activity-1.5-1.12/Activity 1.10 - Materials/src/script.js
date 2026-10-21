/**
 * Activity 1.10 - Materials
 * Nimrod P. Pala | ITE 18-FNHX1 | ITE-18 Applications Development and Emerging Technologies
 *
 * Instead of commenting materials in and out by hand, every material from the handout
 * is built below in its own labeled block, and the "material" dropdown in the debug panel
 * switches the sphere, plane and torus between them live.
 * The final state of the handout (MeshStandardMaterial + all door maps) is the default.
 */
import * as THREE from 'three'
// Deviation from handout: addons are now imported from 'three/addons/...'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
// Deviation from handout: lil-gui replaces dat.gui (same API)
import { GUI } from 'lil-gui'

/**
 * Debug
 */
const gui = new GUI()

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const cubeTextureLoader = new THREE.CubeTextureLoader()

const doorColorTexture = textureLoader.load('textures/door/color.jpg')
const doorAlphaTexture = textureLoader.load('textures/door/alpha.jpg')
const doorAmbientOcclusionTexture = textureLoader.load('textures/door/ambientOcclusion.jpg')
const doorHeightTexture = textureLoader.load('textures/door/height.jpg')
const doorNormalTexture = textureLoader.load('textures/door/normal.jpg')
const doorMetalnessTexture = textureLoader.load('textures/door/metalness.jpg')
const doorRoughnessTexture = textureLoader.load('textures/door/roughness.jpg')
const matcapTexture = textureLoader.load('textures/matcaps/1.png')
const gradientTexture = textureLoader.load('textures/gradients/3.jpg')

// Deviation from handout: since three.js r152, color textures (map, matcap) must be
// flagged as sRGB, otherwise they look washed out. Data maps stay linear.
doorColorTexture.colorSpace = THREE.SRGBColorSpace
matcapTexture.colorSpace = THREE.SRGBColorSpace

// Toon gradient: NearestFilter keeps the hard cel-shading steps instead of blending them
gradientTexture.minFilter = THREE.NearestFilter
gradientTexture.magFilter = THREE.NearestFilter
gradientTexture.generateMipmaps = false

/**
 * Environment map (CubeTextureLoader)
 * Park2 cube map by Emil Persson (Humus), from the three.js repository
 */
const environmentMapTexture = cubeTextureLoader.load([
    'textures/environmentMaps/0/px.jpg',
    'textures/environmentMaps/0/nx.jpg',
    'textures/environmentMaps/0/py.jpg',
    'textures/environmentMaps/0/ny.jpg',
    'textures/environmentMaps/0/pz.jpg',
    'textures/environmentMaps/0/nz.jpg'
])
environmentMapTexture.colorSpace = THREE.SRGBColorSpace

/**
 * Materials
 */
const materials = {}

// --- MeshBasicMaterial ---
materials.MeshBasicMaterial = new THREE.MeshBasicMaterial()
materials.MeshBasicMaterial.map = doorColorTexture
// materials.MeshBasicMaterial.color = new THREE.Color('#ff0000')
// materials.MeshBasicMaterial.wireframe = true
// materials.MeshBasicMaterial.transparent = true
// materials.MeshBasicMaterial.opacity = 0.5
// materials.MeshBasicMaterial.alphaMap = doorAlphaTexture

// --- MeshNormalMaterial ---
materials.MeshNormalMaterial = new THREE.MeshNormalMaterial()
// materials.MeshNormalMaterial.flatShading = true

// --- MeshMatcapMaterial ---
materials.MeshMatcapMaterial = new THREE.MeshMatcapMaterial()
materials.MeshMatcapMaterial.matcap = matcapTexture

// --- MeshDepthMaterial ---
materials.MeshDepthMaterial = new THREE.MeshDepthMaterial()

// --- MeshLambertMaterial ---
materials.MeshLambertMaterial = new THREE.MeshLambertMaterial()

// --- MeshPhongMaterial ---
materials.MeshPhongMaterial = new THREE.MeshPhongMaterial()
materials.MeshPhongMaterial.shininess = 100
materials.MeshPhongMaterial.specular = new THREE.Color(0x1188ff)

// --- MeshToonMaterial ---
materials.MeshToonMaterial = new THREE.MeshToonMaterial()
materials.MeshToonMaterial.gradientMap = gradientTexture

// --- MeshStandardMaterial (final state of the handout) ---
const material = new THREE.MeshStandardMaterial()
// With metalnessMap/roughnessMap, the handout resets these to their original values
material.metalness = 0
material.roughness = 1
material.map = doorColorTexture
material.aoMap = doorAmbientOcclusionTexture
material.aoMapIntensity = 1
material.displacementMap = doorHeightTexture
material.displacementScale = 0.05
material.metalnessMap = doorMetalnessTexture
material.roughnessMap = doorRoughnessTexture
material.normalMap = doorNormalTexture
material.normalScale.set(0.5, 0.5)
material.transparent = true
material.alphaMap = doorAlphaTexture
// Environment map section: reflections from the cube map
material.envMap = environmentMapTexture
materials.MeshStandardMaterial = material

// --- MeshStandardMaterial, envMap only (the handout's environment map step) ---
materials['MeshStandardMaterial (envMap only)'] = new THREE.MeshStandardMaterial({
    metalness: 0.7,
    roughness: 0.2,
    envMap: environmentMapTexture
})

// Show the back of the plane too
for(const key in materials)
{
    materials[key].side = THREE.DoubleSide
}

/**
 * Objects
 */
// Higher segment counts so the displacementMap has vertices to move
const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 64, 64),
    material
)
sphere.position.x = - 1.5

const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(1, 1, 100, 100),
    material
)

const torus = new THREE.Mesh(
    new THREE.TorusGeometry(0.3, 0.2, 64, 128),
    material
)
torus.position.x = 1.5

// Deviation from handout: the uv2 attribute is no longer needed for aoMap.
// Since three.js r151, aoMap reads the regular 'uv' attribute by default
// (texture.channel = 0), so duplicating uv into uv2 does nothing anymore.
// sphere.geometry.setAttribute('uv2', new THREE.BufferAttribute(sphere.geometry.attributes.uv.array, 2))
// plane.geometry.setAttribute('uv2', new THREE.BufferAttribute(plane.geometry.attributes.uv.array, 2))
// torus.geometry.setAttribute('uv2', new THREE.BufferAttribute(torus.geometry.attributes.uv.array, 2))

scene.add(sphere, plane, torus)

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
scene.add(ambientLight)

// Deviation from handout: lights use physical units now (decay = 2 by default),
// so the handout's intensity of 0.5 leaves the scene almost black. 30 looks right.
const pointLight = new THREE.PointLight(0xffffff, 30)
pointLight.position.x = 2
pointLight.position.y = 3
pointLight.position.z = 4
scene.add(pointLight)

/**
 * Debug UI
 */
const parameters = {
    material: 'MeshStandardMaterial'
}

const standardFolder = gui.addFolder('MeshStandardMaterial')
standardFolder.add(material, 'metalness').min(0).max(1).step(0.0001)
standardFolder.add(material, 'roughness').min(0).max(1).step(0.0001)
standardFolder.add(material, 'aoMapIntensity').min(0).max(10).step(0.001)
standardFolder.add(material, 'displacementScale').min(0).max(1).step(0.0001)

gui
    .add(parameters, 'material', Object.keys(materials))
    .name('material')
    .onChange((name) =>
    {
        sphere.material = materials[name]
        plane.material = materials[name]
        torus.material = materials[name]
        standardFolder.show(name === 'MeshStandardMaterial')
    })

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

window.addEventListener('dblclick', () =>
{
    const fullscreenElement = document.fullscreenElement || document.webkitFullscreenElement

    if(!fullscreenElement)
    {
        if(canvas.requestFullscreen)
        {
            canvas.requestFullscreen()
        }
        else if(canvas.webkitRequestFullscreen)
        {
            canvas.webkitRequestFullscreen()
        }
    }
    else
    {
        if(document.exitFullscreen)
        {
            document.exitFullscreen()
        }
        else if(document.webkitExitFullscreen)
        {
            document.webkitExitFullscreen()
        }
    }
})

/**
 * Camera
 */
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

/**
 * Animate
 */
// Deviation from handout: THREE.Clock is deprecated in recent three.js, THREE.Timer replaces it.
// timer.update() must be called once per frame, then timer.getElapsed() replaces clock.getElapsedTime()
const timer = new THREE.Timer()

const tick = () =>
{
    timer.update()
    const elapsedTime = timer.getElapsed()

    // Update objects
    sphere.rotation.y = 0.1 * elapsedTime
    plane.rotation.y = 0.1 * elapsedTime
    torus.rotation.y = 0.1 * elapsedTime

    sphere.rotation.x = 0.15 * elapsedTime
    plane.rotation.x = 0.15 * elapsedTime
    torus.rotation.x = 0.15 * elapsedTime

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()
