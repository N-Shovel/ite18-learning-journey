/**
 * Activity 3.3 - Scroll Based Animation
 * Nimrod P. Pala | ITE 18-FNHX1 | ITE-18 Applications Development and Emerging Technologies
 *
 * Three.js as the background of a classic HTML page: the camera follows the scroll,
 * moves with the cursor (parallax with easing), stars fill the three sections, and
 * each object spins with GSAP when its section is reached.
 * Steps that the handout replaces later (the red MeshBasicMaterial, the toon material
 * without a gradient, the gradient without the NearestFilter, the parallax without
 * easing, the permanent rotation with the elapsedTime) are kept and can be switched
 * back on from the debug panel. The final state of the handout is the default.
 */
import * as THREE from 'three'
import * as dat from 'lil-gui'
import gsap from 'gsap'

/**
 * Debug
 */
const gui = new dat.GUI()

const parameters = {
    materialColor: '#ffeded'
}

gui
    .addColor(parameters, 'materialColor')
    .onChange(() =>
    {
        material.color.set(parameters.materialColor)
        toonMaterial.color.set(parameters.materialColor)
        particlesMaterial.color.set(parameters.materialColor)
    })

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Objects
 */
// Texture
const textureLoader = new THREE.TextureLoader()
const gradientTexture = textureLoader.load('textures/gradients/3.jpg')
// Use the closest pixel of the 3 pixels gradient instead of interpolating them
gradientTexture.magFilter = THREE.NearestFilter

// Objects: a red MeshBasicMaterial first
const basicMaterial = new THREE.MeshBasicMaterial({ color: '#ff0000' })

// Base material: MeshToonMaterial (black until there is a light)
const toonMaterial = new THREE.MeshToonMaterial({ color: parameters.materialColor })

// Material: MeshToonMaterial with the gradient texture
const material = new THREE.MeshToonMaterial({
    color: parameters.materialColor,
    gradientMap: gradientTexture
})

// Meshes
const mesh1 = new THREE.Mesh(
    new THREE.TorusGeometry(1, 0.4, 16, 60),
    material
)
const mesh2 = new THREE.Mesh(
    new THREE.ConeGeometry(1, 2, 32),
    material
)
const mesh3 = new THREE.Mesh(
    new THREE.TorusKnotGeometry(0.8, 0.35, 100, 16),
    material
)

// Position: 2 first, increased until the objects are far enough apart
const objectsDistance = 4

mesh1.position.y = - objectsDistance * 0
mesh2.position.y = - objectsDistance * 1
mesh3.position.y = - objectsDistance * 2

// Position object horizontally, to match the titles
mesh1.position.x = 2
mesh2.position.x = - 2
mesh3.position.x = 2

scene.add(mesh1, mesh2, mesh3)

// Permanent rotation
const sectionMeshes = [ mesh1, mesh2, mesh3 ]

/**
 * Lights
 */
const directionalLight = new THREE.DirectionalLight('#ffffff', 1)
directionalLight.position.set(1, 1, 0)
scene.add(directionalLight)

/**
 * Particles
 */
// Geometry
const particlesCount = 200
const positions = new Float32Array(particlesCount * 3)

for(let i = 0; i < particlesCount; i++)
{
    // First test: positions[i * 3 + 0], [i * 3 + 1] and [i * 3 + 2] = Math.random(), a small cube
    positions[i * 3 + 0] = (Math.random() - 0.5) * 10
    // From the instructor's video (missing from the handout): start half a section above the first object, spread down to the last one
    positions[i * 3 + 1] = objectsDistance * 0.5 - Math.random() * objectsDistance * sectionMeshes.length
    positions[i * 3 + 2] = (Math.random() - 0.5) * 10
}

const particlesGeometry = new THREE.BufferGeometry()
particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))

// Material
const particlesMaterial = new THREE.PointsMaterial({
    color: parameters.materialColor,
    sizeAttenuation: true,
    size: 0.03
})

// Points
const particles = new THREE.Points(particlesGeometry, particlesMaterial)
scene.add(particles)

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
// Group (the parallax moves the group, the scroll moves the camera inside it)
const cameraGroup = new THREE.Group()
scene.add(cameraGroup)

// Base camera
const camera = new THREE.PerspectiveCamera(35, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 6
cameraGroup.add(camera)

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true
})
// Transparent clear color: the html background (#1e1a20) shows behind, even with the elastic scroll
renderer.setClearAlpha(0)
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Debug UI: switch earlier handout steps back on
 */
parameters.material = 'gradient'
parameters.nearestFilter = true
parameters.parallax = true
parameters.easing = true
parameters.particles = true
parameters.spinOnSection = true

const materials = {
    basic: basicMaterial,
    toon: toonMaterial,
    gradient: material
}

gui.add(parameters, 'material', { 'Basic (red)': 'basic', 'Toon': 'toon', 'Toon + gradient': 'gradient' }).name('Material').onChange(() =>
{
    for(const mesh of sectionMeshes)
    {
        mesh.material = materials[parameters.material]
    }
})

// Off: the default LinearFilter, which makes a smooth gradient instead of the toon effect
gui.add(parameters, 'nearestFilter').name('Nearest filter').onChange((value) =>
{
    gradientTexture.magFilter = value ? THREE.NearestFilter : THREE.LinearFilter
    gradientTexture.needsUpdate = true
})

gui.add(parameters, 'parallax').name('Parallax').onChange((value) =>
{
    if(! value)
    {
        cameraGroup.position.set(0, 0, 0)
    }
})

gui.add(parameters, 'easing').name('Easing')

gui.add(parameters, 'particles').name('Particles').onChange((value) =>
{
    particles.visible = value
})

// Off: no GSAP spin, and the permanent rotation goes back to the elapsedTime version
gui.add(parameters, 'spinOnSection').name('Spin on section')

/**
 * Scroll
 */
let scrollY = window.scrollY
let currentSection = 0

window.addEventListener('scroll', () =>
{
    scrollY = window.scrollY
    const newSection = Math.round(scrollY / sizes.height)

    if(newSection != currentSection)
    {
        currentSection = newSection

        // Triggered rotations
        if(parameters.spinOnSection)
        {
            gsap.to(
                sectionMeshes[currentSection].rotation,
                {
                    duration: 1.5,
                    ease: 'power2.inOut',
                    x: '+=6',
                    y: '+=3',
                    z: '+=1.5'
                }
            )
        }
    }
})

/**
 * Cursor
 */
const cursor = {}
cursor.x = 0
cursor.y = 0

window.addEventListener('mousemove', (event) =>
{
    // Normalized from -0.5 to 0.5, so the camera goes as much to the left as to the right
    cursor.x = event.clientX / sizes.width - 0.5
    cursor.y = event.clientY / sizes.height - 0.5
})

/**
 * Animate
 */
const clock = new THREE.Clock()
let previousTime = 0

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - previousTime
    previousTime = elapsedTime

    // Animate camera
    camera.position.y = - scrollY / sizes.height * objectsDistance

    // Parallax: the y is inverted so the camera follows the cursor, and the amplitude is lowered with * 0.5
    const parallaxX = cursor.x * 0.5
    const parallaxY = - cursor.y * 0.5

    if(parameters.parallax && parameters.easing)
    {
        // Easing: move a part of the distance to the target on each frame, the same on every screen frequency
        cameraGroup.position.x += (parallaxX - cameraGroup.position.x) * 5 * deltaTime
        cameraGroup.position.y += (parallaxY - cameraGroup.position.y) * 5 * deltaTime
    }
    else if(parameters.parallax)
    {
        // Parallax before the easing: the group goes straight to the target
        cameraGroup.position.x = parallaxX
        cameraGroup.position.y = parallaxY
    }

    // Animate meshes
    for(const mesh of sectionMeshes)
    {
        if(parameters.spinOnSection)
        {
            // From the instructor's video (missing from the handout): add the deltaTime so GSAP's spin isn't overwritten on each frame
            mesh.rotation.x += deltaTime * 0.1
            mesh.rotation.y += deltaTime * 0.12
        }
        else
        {
            // Permanent rotation: a rotation based on the elapsedTime
            mesh.rotation.x = elapsedTime * 0.1
            mesh.rotation.y = elapsedTime * 0.12
        }
    }

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()
