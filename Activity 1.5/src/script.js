import * as THREE from 'three'
// In r148 the addons live in examples/jsm (not 'three/addons/...')
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

/**
 * Cursor
 */
// Mouse position turned into a value from -0.5 to 0.5 on each axis
// (0 = center of the canvas). y is flipped because screen y goes down but 3D y goes up.
const cursor = {
    x: 0,
    y: 0
}

window.addEventListener('mousemove', (event) =>
{
    cursor.x = event.clientX / sizes.width - 0.5
    cursor.y = - (event.clientY / sizes.height - 0.5)
})

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Sizes
const sizes = {
    width: 800,
    height: 600
}

// Scene
const scene = new THREE.Scene()

// Object
const mesh = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1, 5, 5, 5),
    new THREE.MeshBasicMaterial({ color: 0xff0000 })
)
scene.add(mesh)

/**
 * Camera
 */
// PerspectiveCamera(fov, aspect, near, far)
// fov: vertical field of view in degrees (45-75 looks natural)
// aspect: width / height of the render, or the image looks stretched
// near / far: only objects between these distances are drawn.
// Avoid extreme values like 0.0001 and 9999999: depth precision runs out and
// faces that are close together flicker (z-fighting).
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)

// OrthographicCamera(left, right, top, bottom, near, far): no perspective,
// far objects look the same size as close ones.
// left/right are multiplied by the aspect ratio, otherwise the 800x600 canvas
// would squash a square render and the cube would look stretched.
// const aspectRatio = sizes.width / sizes.height
// const camera = new THREE.OrthographicCamera(-1 * aspectRatio, 1 * aspectRatio, 1, -1, 0.1, 100)

camera.position.x = 2
camera.position.y = 2
camera.position.z = 2
camera.lookAt(mesh.position)
scene.add(camera)

/**
 * Controls
 */
// OrbitControls: drag to rotate, scroll to zoom, right-drag to pan.
// Damping adds smooth easing, but it only works if controls.update() runs every frame.
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update objects
    mesh.rotation.y = elapsedTime

    // Custom controls (comment out the OrbitControls code above and uncomment this to use it)
    // sin and cos with the same angle put the camera on a circle of radius 3 around the cube.
    // cursor.x * Math.PI * 2 = one full turn across the width of the canvas.
    // camera.position.x = Math.sin(cursor.x * Math.PI * 2) * 3
    // camera.position.z = Math.cos(cursor.x * Math.PI * 2) * 3
    // camera.position.y = cursor.y * 5
    // camera.lookAt(mesh.position)

    // Update controls (needed for damping)
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()
