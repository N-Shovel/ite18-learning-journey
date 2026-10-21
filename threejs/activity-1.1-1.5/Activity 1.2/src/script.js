// 'three' is not a file path: Vite finds the package in node_modules/three
// (installed by `npm install` from package.json) and bundles it for the browser
import * as THREE from 'three'

/**
 * Info panel
 */
// Show which Three.js version Vite loaded from node_modules (should be 148)
document.querySelector('.revision').textContent = THREE.REVISION
console.log('Three.js revision:', THREE.REVISION)

/**
 * Canvas
 */
const canvas = document.querySelector('canvas.webgl')

/**
 * Scene
 */
const scene = new THREE.Scene()

/**
 * Object
 */
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
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
camera.position.z = 3
scene.add(camera)

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.render(scene, camera)
