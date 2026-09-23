import * as THREE from 'three'

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Objects
 */
// Outline: EdgesGeometry keeps only the edges of a geometry, drawn as white lines.
// It's added as a child of the cube so it follows the cube's position, scale and rotation.
const outlineMaterial = new THREE.LineBasicMaterial({ color: 0xffffff })
const addOutline = (cube) =>
{
    const edges = new THREE.EdgesGeometry(cube.geometry)
    cube.add(new THREE.LineSegments(edges, outlineMaterial))
}

const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 })
const mesh = new THREE.Mesh(geometry, material)
addOutline(mesh)
scene.add(mesh)

/**
 * Position
 */
// position is a Vector3: set each axis one by one...
mesh.position.x = 0.7
mesh.position.y = -0.6
mesh.position.z = 1
// ...or all three at once (this overwrites the lines above with the same values)
mesh.position.set(0.7, -0.6, 1)

// Length of the vector = distance from the center of the scene (0, 0, 0)
console.log('position.length():', mesh.position.length())

/**
 * Axes helper
 */
// Red = x, green = y, blue = z. Each line is 2 units long
const axesHelper = new THREE.AxesHelper(2)
scene.add(axesHelper)

/**
 * Scale
 */
mesh.scale.x = 2
mesh.scale.y = 0.25
mesh.scale.z = 0.5
// Same as the three lines above
mesh.scale.set(2, 0.25, 0.5)

/**
 * Rotation
 */
// rotation is an Euler, in radians: Math.PI = half a turn, Math.PI * 2 = a full turn
// Default order is 'XYZ'. reorder() changes it and must be called before setting the values.
// Rotating Y first (like looking left/right, then up/down) avoids gimbal lock:
// with the wrong order, one rotation can line up two axes so they spin the same way
// and you lose one degree of freedom.
mesh.rotation.reorder('YXZ')
mesh.rotation.x = Math.PI * 0.25
mesh.rotation.y = Math.PI * 0.25

/**
 * Group
 */
// A Group is an empty container: transforming it transforms every child together
const group = new THREE.Group()
group.position.y = 1
group.scale.y = 2
group.rotation.y = 0.2
scene.add(group)

const cube1 = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({ color: 0xff0000 })
)
addOutline(cube1)
group.add(cube1)

const cube2 = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({ color: 0x00ff00 })
)
cube2.position.x = -2
addOutline(cube2)
group.add(cube2)

const cube3 = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({ color: 0x0000ff })
)
cube3.position.x = 2
addOutline(cube3)
group.add(cube3)

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
camera.position.set(1, 1, 5)
scene.add(camera)

// Distance between the mesh and the camera (both positions are Vector3)
console.log('distanceTo(camera):', mesh.position.distanceTo(camera.position))

// Point the camera at the mesh (try group.position or new THREE.Vector3(0, 0, 0))
camera.lookAt(mesh.position)

/**
 * Normalize
 */
// normalize() keeps the direction but makes the length 1.
// It changes the vector itself, so we do it on a clone to keep the mesh where it is.
// (mesh.position.normalize() would move the mesh to a point 1 unit from the center.)
const direction = mesh.position.clone().normalize()
console.log('normalized:', direction, 'length:', direction.length())

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.render(scene, camera)
