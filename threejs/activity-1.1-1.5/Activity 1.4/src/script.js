import * as THREE from 'three'
import gsap from 'gsap'

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Object
const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 })
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

// Outline: EdgesGeometry keeps only the edges of the cube, drawn as white lines.
// Added as a child of the mesh so it moves, scales and rotates with the cube.
const edges = new THREE.EdgesGeometry(mesh.geometry)
const outline = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 0xffffff }))
mesh.add(outline)

// Sizes
const sizes = {
    width: 800,
    height: 600
}

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
camera.position.z = 3
scene.add(camera)

// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)

/**
 * GSAP
 */
// GSAP runs its own timer and changes mesh.scale for us (grow, then shrink back, forever).
// It only changes values: the tick() loop below still has to render every frame to show them.
gsap.to(mesh.scale, { duration: 1, delay: 1, x: 1.5, y: 1.5, z: 1.5, yoyo: true, repeat: -1 })

/**
 * Animate
 */

// Version 1: Date.now() delta time (kept for reference)
// A 144 Hz screen calls tick() more often than a 60 Hz one. Multiplying by deltaTime
// (milliseconds since the last frame) makes the speed the same on every screen.
// let time = Date.now()
//
// const tick = () =>
// {
//     const currentTime = Date.now()
//     const deltaTime = currentTime - time
//     time = currentTime
//
//     mesh.rotation.y += 0.001 * deltaTime
//
//     renderer.render(scene, camera)
//     window.requestAnimationFrame(tick)
// }

// Version 2: THREE.Clock (the one used)
// getElapsedTime() = seconds since the clock was created, so no manual delta is needed.
// Don't also call clock.getDelta() on the same clock: it resets the clock's internal timer,
// which breaks the values getElapsedTime() gives you.
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // One full turn per second (Math.PI * 2 radians)
    mesh.rotation.y = elapsedTime * Math.PI * 2

    // Circular motion: sin and cos of the same angle trace a circle of radius 1
    mesh.position.x = Math.cos(elapsedTime)
    mesh.position.y = Math.sin(elapsedTime)

    // Alternative: keep the cube still and circle the camera around it instead
    // camera.position.x = Math.sin(elapsedTime) * 3
    // camera.position.z = Math.cos(elapsedTime) * 3
    // camera.lookAt(mesh.position)

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()
