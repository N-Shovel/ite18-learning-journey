import * as THREE from 'three'

/**
 * Canvas
 */
// The <canvas class="webgl"> from index.html, where Three.js will draw
const canvas = document.querySelector('canvas.webgl')

/**
 * Scene
 */
// 1st element: the scene is the container that holds every object, light and camera
const scene = new THREE.Scene()

/**
 * Object
 */
// 2nd element: an object (Mesh) = geometry (the shape) + material (how it looks)
const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 })
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

// Outline: EdgesGeometry keeps only the edges of the cube, drawn as white lines.
// Added as a child of the mesh so it moves, scales and rotates with the cube.
const edges = new THREE.EdgesGeometry(mesh.geometry)
const outline = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 0xffffff }))
mesh.add(outline)

/**
 * Sizes
 */
const sizes = {
    width: 800,
    height: 600
}

/**
 * Camera
 */
// 3rd element: the camera is the point of view we render from
// PerspectiveCamera(field of view in degrees, aspect ratio)
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
// Everything starts at (0, 0, 0), so move the camera back or it would be inside the cube
camera.position.z = 3
scene.add(camera)

/**
 * Renderer
 */
// 4th element: the renderer draws the scene, seen from the camera, onto the canvas
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.render(scene, camera)
