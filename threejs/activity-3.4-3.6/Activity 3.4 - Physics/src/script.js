/**
 * Activity 3.4 - Physics
 * Nimrod P. Pala | ITE 18-FNHX1 | ITE-18 Applications Development and Emerging Technologies
 *
 * A Cannon.js (cannon-es) physics world next to the Three.js scene: spheres and boxes
 * fall, bounce, tumble and play a hit sound when they collide hard enough.
 * Steps that the handout replaces later (the single sphere with its push and wind, the
 * concrete/plastic materials before the default material) are kept and can be switched
 * back on from the debug panel. The final state of the handout is the default.
 */
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
// Deviation from handout: the handout starts with 'cannon' (import CANNON from 'cannon') and only switches to cannon-es at the end (p.23); the starter already depends on cannon-es 0.20, the version the handout tested, so it is used from the start
import * as CANNON from 'cannon-es'


/**
 * Debug
 */
const gui = new dat.GUI()
const debugObject = {}



/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Sounds
 */
const hitSound = new Audio('sounds/hit.mp3')

// Events, first version (p.17): replaced below because it does nothing while the sound is already playing
// const playHitSound = () =>
// {
//     hitSound.play()
// }

// Events, second version (p.18): restart the sound, but it plays even for the slightest touch
// const playHitSound = () =>
// {
//     hitSound.currentTime = 0
//     hitSound.play()
// }

// Events, final version (p.19-20): only play for strong impacts, with a random volume
const playHitSound = (collision) =>
{
    // console.log(collision)
    // console.log(collision.contact.getImpactVelocityAlongNormal())
    const impactStrength = collision.contact.getImpactVelocityAlongNormal()

    if(impactStrength > 1.5)
    {
        hitSound.volume = Math.random()
        hitSound.currentTime = 0
        // Deviation from handout: .catch() added so Chrome's block on sounds before the first click doesn't show as an uncaught error
        hitSound.play().catch(() => {})
    }
}

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const cubeTextureLoader = new THREE.CubeTextureLoader()

const environmentMapTexture = cubeTextureLoader.load([
    'textures/environmentMaps/0/px.png',
    'textures/environmentMaps/0/nx.png',
    'textures/environmentMaps/0/py.png',
    'textures/environmentMaps/0/ny.png',
    'textures/environmentMaps/0/pz.png',
    'textures/environmentMaps/0/nz.png'
])

/**
 * Physics
 */
// World (p.4)
const world = new CANNON.World()
world.gravity.set(0, - 9.82, 0)

// Performance: Broadphase and Sleep (p.17)
world.broadphase = new CANNON.SAPBroadphase(world)
world.allowSleep = true

// Contact material, first version (p.7-8): one Material per type of surface.
// Created before the bodies that use them. Used by the "Contact material" switch below.
const concreteMaterial = new CANNON.Material('concrete')
const plasticMaterial = new CANNON.Material('plastic')

const concretePlasticContactMaterial = new CANNON.ContactMaterial(
    concreteMaterial,
    plasticMaterial,
    {
        friction: 0.1,
        restitution: 0.7
    }
)
world.addContactMaterial(concretePlasticContactMaterial)

// Default material (p.8-9): replaces the two materials above, one material for every body
const defaultMaterial = new CANNON.Material('default')
const defaultContactMaterial = new CANNON.ContactMaterial(
    defaultMaterial,
    defaultMaterial,
    {
        friction: 0.1,
        restitution: 0.7
    }
)
world.addContactMaterial(defaultContactMaterial)
world.defaultContactMaterial = defaultContactMaterial

// Step 1 - Single sphere (p.4-9): replaced by createSphere() in "Handle multiple objects" (p.10).
// Not added to the world on load; the "Step 1 - single sphere demo" button adds it.
const sphereShape = new CANNON.Sphere(0.5)
const sphereBody = new CANNON.Body({
    mass: 1,
    position: new CANNON.Vec3(0, 3, 0),
    shape: sphereShape,
    material: plasticMaterial
})
// world.addBody(sphereBody)

// Floor (p.6-7)
const floorShape = new CANNON.Plane()
const floorBody = new CANNON.Body()
floorBody.material = concreteMaterial
floorBody.mass = 0
floorBody.addShape(floorShape)
floorBody.quaternion.setFromAxisAngle(new CANNON.Vec3(- 1, 0, 0), Math.PI * 0.5)
world.addBody(floorBody)

// Contact material switch: "Concrete + plastic" (p.8) or "Default" (p.9, the material
// assignments of sphereBody and floorBody are removed and the world's default is used)
debugObject.contactMaterial = 'Default'

const applyContactMaterial = () =>
{
    if(debugObject.contactMaterial === 'Concrete + plastic')
    {
        sphereBody.material = plasticMaterial
        floorBody.material = concreteMaterial
    }
    else
    {
        sphereBody.material = null
        floorBody.material = null
    }
}
applyContactMaterial()

/**
 * Utils
 */
const objectsToUpdate = []

// Step 1 - Single sphere mesh (starter): keeps the starter's radius 0.5 geometry
const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 32, 32),
    new THREE.MeshStandardMaterial({
        metalness: 0.3,
        roughness: 0.4,
        envMap: environmentMapTexture,
        envMapIntensity: 0.5
    })
)
sphere.castShadow = true
// scene.add(sphere)

// Automate with functions, first version (p.10-12): a new geometry and material for every sphere.
// Replaced by the shared geometry and material in "Optimize" (p.14).
// const createSphere = (radius, position) =>
// {
//     // Three.js mesh
//     const mesh = new THREE.Mesh(
//         new THREE.SphereGeometry(radius, 20, 20),
//         new THREE.MeshStandardMaterial({
//             metalness: 0.3,
//             roughness: 0.4,
//             envMap: environmentMapTexture,
//             envMapIntensity: 0.5
//         })
//     )
//     mesh.castShadow = true
//     mesh.position.copy(position)
//     scene.add(mesh)
//
//     // Cannon.js body
//     const shape = new CANNON.Sphere(radius)
//
//     const body = new CANNON.Body({
//         mass: 1,
//         position: new CANNON.Vec3(0, 3, 0),
//         shape: shape,
//         material: defaultMaterial
//     })
//     body.position.copy(position)
//     world.addBody(body)
//
//     // Save in objects to update
//     objectsToUpdate.push({ mesh, body })
// }

// Create sphere, optimized (p.14) with the hit sound (p.21)
// Deviation from handout: the starter's SphereGeometry(0.5, 32, 32) is replaced by the handout's (1, 20, 20), because the mesh is scaled by the radius
const sphereGeometry = new THREE.SphereGeometry(1, 20, 20)
const sphereMaterial = new THREE.MeshStandardMaterial({
    metalness: 0.3,
    roughness: 0.4,
    envMap: environmentMapTexture,
    envMapIntensity: 0.5
})

const createSphere = (radius, position) =>
{
    // Three.js mesh
    const mesh = new THREE.Mesh(sphereGeometry, sphereMaterial)
    mesh.castShadow = true
    mesh.scale.set(radius, radius, radius)
    mesh.position.copy(position)
    scene.add(mesh)

    // Cannon.js body
    const shape = new CANNON.Sphere(radius)

    const body = new CANNON.Body({
        mass: 1,
        position: new CANNON.Vec3(0, 3, 0),
        shape: shape,
        material: defaultMaterial
    })
    body.position.copy(position)
    body.addEventListener('collide', playHitSound)
    world.addBody(body)

    // Save in objects to update
    objectsToUpdate.push({ mesh, body })
}

// First call (p.11), removed when the boxes are added (p.15)
// createSphere(0.5, { x: 0, y: 3, z: 0 })

// Create box (p.15) with the hit sound (p.18)
const boxGeometry = new THREE.BoxGeometry(1, 1, 1)
const boxMaterial = new THREE.MeshStandardMaterial({
    metalness: 0.3,
    roughness: 0.4,
    envMap: environmentMapTexture,
    envMapIntensity: 0.5
})

const createBox = (width, height, depth, position) =>
{
    // Three.js mesh
    const mesh = new THREE.Mesh(boxGeometry, boxMaterial)
    mesh.scale.set(width, height, depth)
    mesh.castShadow = true
    mesh.position.copy(position)
    scene.add(mesh)

    // Cannon.js body
    const shape = new CANNON.Box(new CANNON.Vec3(width * 0.5, height * 0.5, depth * 0.5))

    const body = new CANNON.Body({
        mass: 1,
        position: new CANNON.Vec3(0, 3, 0),
        shape: shape,
        material: defaultMaterial
    })
    body.position.copy(position)
    body.addEventListener('collide', playHitSound)
    world.addBody(body)

    // Save in objects
    objectsToUpdate.push({ mesh, body })
}

createBox(1, 1.5, 2, { x: 0, y: 3, z: 0 })

/**
 * Floor
 */
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(10, 10),
    new THREE.MeshStandardMaterial({
        color: '#777777',
        metalness: 0.3,
        roughness: 0.4,
        envMap: environmentMapTexture,
        envMapIntensity: 0.5
    })
)
floor.receiveShadow = true
floor.rotation.x = - Math.PI * 0.5
// From the instructor's video (missing from the handout): the starter's y = - 0.5 is moved to 0 to match the Cannon.js plane, or the objects float above the floor
floor.position.y = 0
scene.add(floor)

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.7)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.2)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.set(1024, 1024)
directionalLight.shadow.camera.far = 15
directionalLight.shadow.camera.left = - 7
directionalLight.shadow.camera.top = 7
directionalLight.shadow.camera.right = 7
directionalLight.shadow.camera.bottom = - 7
directionalLight.position.set(5, 5, 5)
scene.add(directionalLight)

/**
 * Debug buttons
 * Created after createSphere and createBox
 */
// Add to Dat.GUI, first version (p.13): every sphere pops at the same position
// debugObject.createSphere = () =>
// {
//     createSphere(0.5, { x: 0, y: 3, z: 0 })
// }

debugObject.createSphere = () =>
{
    createSphere(
        Math.random() * 0.5,
        {
            x: (Math.random() - 0.5) * 3,
            y: 3,
            z: (Math.random() - 0.5) * 3
        }
    )
}
gui.add(debugObject, 'createSphere')

debugObject.createBox = () =>
{
    createBox(
        Math.random(),
        Math.random(),
        Math.random(),
        {
            x: (Math.random() - 0.5) * 3,
            y: 3,
            z: (Math.random() - 0.5) * 3
        }
    )
}
gui.add(debugObject, 'createBox')

// Reset (p.21-22)
debugObject.reset = () =>
{
    // console.log('reset')
    for(const object of objectsToUpdate)
    {
        // Remove body
        object.body.removeEventListener('collide', playHitSound)
        world.removeBody(object.body)

        // Remove mesh
        scene.remove(object.mesh)
    }

    objectsToUpdate.splice(0, objectsToUpdate.length)

    // Not in the handout: also remove the step 1 sphere if its demo is running
    world.removeBody(sphereBody)
    scene.remove(sphere)
}
gui.add(debugObject, 'reset')

// Step 1 - single sphere demo: the sphere of p.4-9 with its push from Apply forces (p.9)
debugObject.singleSphereDemo = () =>
{
    debugObject.reset()

    sphereBody.position.set(0, 3, 0)
    sphereBody.velocity.set(0, 0, 0)
    sphereBody.angularVelocity.set(0, 0, 0)
    sphereBody.wakeUp()
    world.addBody(sphereBody)
    scene.add(sphere)

    sphereBody.applyLocalForce(new CANNON.Vec3(150, 0, 0), new CANNON.Vec3(0, 0, 0))
}
gui.add(debugObject, 'singleSphereDemo').name('Step 1 - single sphere demo')

// Wind from Apply forces (p.9), pushes the step 1 sphere on every frame
debugObject.wind = false
gui.add(debugObject, 'wind').name('Wind')

gui.add(debugObject, 'contactMaterial', ['Concrete + plastic', 'Default']).name('Contact material').onChange(applyContactMaterial)

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
camera.position.set(- 3, 3, 3)
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
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()
let oldElapsedTime = 0

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - oldElapsedTime
    oldElapsedTime = elapsedTime

    // Update physics
    if(debugObject.wind)
    {
        sphereBody.applyForce(new CANNON.Vec3(- 0.5, 0, 0), sphereBody.position)
    }

    world.step(1 / 60, deltaTime, 3)

    // Step 1 (p.6): the single sphere follows its body
    // console.log(sphereBody.position.y)
    // sphere.position.x = sphereBody.position.x
    // sphere.position.y = sphereBody.position.y
    // sphere.position.z = sphereBody.position.z
    sphere.position.copy(sphereBody.position)

    // Use an array of objects (p.12, p.16)
    for(const object of objectsToUpdate)
    {
        object.mesh.position.copy(object.body.position)
        object.mesh.quaternion.copy(object.body.quaternion)
    }

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()
