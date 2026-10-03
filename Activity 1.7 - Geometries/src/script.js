/**
 * Activity 1.7 - Geometries
 * Nimrod P. Pala | ITE 18-FNHX1 | ITE-18 Applications Development and Emerging Technologies
 */
import * as THREE from 'three'
// Deviation from handout: addons are now imported from 'three/addons/...'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'

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

// --- Step 1: BoxGeometry with subdivisions, shown in wireframe ---
// (Kept for reference. The final step below replaces it with a custom BufferGeometry.)
// const geometry = new THREE.BoxGeometry(1, 1, 1, 2, 2, 2)
// const material = new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true })
// const mesh = new THREE.Mesh(geometry, material)
// scene.add(mesh)

// --- Step 2: SphereGeometry, more subdivisions = smoother sphere (kept for reference) ---
// const geometry = new THREE.SphereGeometry(1, 32, 32)
// const material = new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true })
// const mesh = new THREE.Mesh(geometry, material)
// scene.add(mesh)

// --- Step 3: a single triangle from a Float32Array (kept for reference) ---
// const positionsArray = new Float32Array([
//     0, 0, 0, // First vertex
//     0, 1, 0, // Second vertex
//     1, 0, 0  // Third vertex
// ])
// const positionsAttribute = new THREE.BufferAttribute(positionsArray, 3)
// const geometry = new THREE.BufferGeometry()
// geometry.setAttribute('position', positionsAttribute)

// --- Step 4 (final): custom BufferGeometry with 50 random triangles ---
const geometry = new THREE.BufferGeometry()

// Create 50 triangles (450 values)
const count = 50
const positionsArray = new Float32Array(count * 3 * 3)
for(let i = 0; i < count * 3 * 3; i++)
{
    positionsArray[i] = (Math.random() - 0.5) * 4
}

// Create the attribute and name it 'position' (itemSize 3 = x, y, z per vertex)
const positionsAttribute = new THREE.BufferAttribute(positionsArray, 3)
geometry.setAttribute('position', positionsAttribute)

const material = new THREE.MeshBasicMaterial({
    color: 0xff0000,
    wireframe: true
})
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
camera.position.z = 3
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
