/**
 * Activity 1.9 - Textures
 * Nimrod P. Pala | ITE 18-FNHX1 | ITE-18 Applications Development and Emerging Technologies
 */
import * as THREE from 'three'
// Deviation from handout: addons are now imported from 'three/addons/...'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'

/**
 * Textures
 */

// --- Step 1: loading an image by hand with the native Image API (kept for reference) ---
// const image = new Image()
// const texture = new THREE.Texture(image)
// texture.colorSpace = THREE.SRGBColorSpace
// image.onload = () =>
// {
//     texture.needsUpdate = true
// }
// image.src = 'textures/door/color.jpg'

// --- Step 2: LoadingManager + TextureLoader ---
const loadingManager = new THREE.LoadingManager()
loadingManager.onStart = () =>
{
    console.log('loading started')
}
loadingManager.onLoad = () =>
{
    console.log('loading finished')
}
loadingManager.onProgress = (url, itemsLoaded, itemsTotal) =>
{
    console.log(`loading progressing: ${url} (${itemsLoaded}/${itemsTotal})`)
}
loadingManager.onError = (url) =>
{
    console.log(`loading error: ${url}`)
}

const textureLoader = new THREE.TextureLoader(loadingManager)

// Door textures (all loaded so the LoadingManager progress can be seen in the console)
const colorTexture = textureLoader.load('textures/door/color.jpg')
const alphaTexture = textureLoader.load('textures/door/alpha.jpg')
const heightTexture = textureLoader.load('textures/door/height.jpg')
const normalTexture = textureLoader.load('textures/door/normal.jpg')
const ambientOcclusionTexture = textureLoader.load('textures/door/ambientOcclusion.jpg')
const metalnessTexture = textureLoader.load('textures/door/metalness.jpg')
const roughnessTexture = textureLoader.load('textures/door/roughness.jpg')

// Deviation from handout: since three.js r152, color textures must be flagged as sRGB
// or they look washed out. Data maps (alpha, normal, height...) stay linear.
colorTexture.colorSpace = THREE.SRGBColorSpace

// --- Step 3: UV transformations on the door color texture (kept for reference) ---
// Repeat (needs RepeatWrapping, otherwise the last pixel is stretched)
// colorTexture.repeat.x = 2
// colorTexture.repeat.y = 3
// colorTexture.wrapS = THREE.RepeatWrapping
// colorTexture.wrapT = THREE.RepeatWrapping
// colorTexture.wrapS = THREE.MirroredRepeatWrapping
// colorTexture.wrapT = THREE.MirroredRepeatWrapping

// Offset
// colorTexture.offset.x = 0.5
// colorTexture.offset.y = 0.5

// Rotation around the centre of the texture instead of the bottom-left corner
// colorTexture.rotation = Math.PI * 0.25
// colorTexture.center.x = 0.5
// colorTexture.center.y = 0.5

// --- Step 4: filtering and mipmapping with the checkerboards (kept for reference) ---
// const checkerboardTexture = textureLoader.load('textures/checkerboard-1024x1024.png')
// checkerboardTexture.colorSpace = THREE.SRGBColorSpace
// checkerboardTexture.minFilter = THREE.NearestFilter // minification: sharp but moiré
//
// const checkerboardSmallTexture = textureLoader.load('textures/checkerboard-8x8.png')
// checkerboardSmallTexture.colorSpace = THREE.SRGBColorSpace
// checkerboardSmallTexture.magFilter = THREE.NearestFilter // magnification: crisp pixels

// --- Step 5 (final): minecraft.png with NearestFilter, no mipmaps ---
const minecraftTexture = textureLoader.load('textures/minecraft.png')
minecraftTexture.colorSpace = THREE.SRGBColorSpace
minecraftTexture.generateMipmaps = false // not needed with NearestFilter as minFilter, saves GPU memory
minecraftTexture.minFilter = THREE.NearestFilter
minecraftTexture.magFilter = THREE.NearestFilter

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Object
 */
const geometry = new THREE.BoxGeometry(1, 1, 1)

// Other geometries to see how the UV unwrapping changes (kept for reference)
// const geometry = new THREE.SphereGeometry(1, 32, 32)
// const geometry = new THREE.ConeGeometry(1, 1, 32)
// const geometry = new THREE.TorusGeometry(1, 0.35, 32, 100)

// Swap the map to see each step: colorTexture, checkerboardTexture, checkerboardSmallTexture...
const material = new THREE.MeshBasicMaterial({ map: minecraftTexture })
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

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
camera.position.z = 1
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
const tick = () =>
{
    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()
