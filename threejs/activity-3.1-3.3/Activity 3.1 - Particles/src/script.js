/**
 * Activity 3.1 - Particles
 * Nimrod P. Pala | ITE 18-FNHX1 | ITE-18 Applications Development and Emerging Technologies
 *
 * 20000 multi-colored particles floating on a wave, made with a BufferGeometry,
 * a PointsMaterial and a Points object.
 * Steps that the handout replaces later (the sphere of particles, the map before the
 * alphaMap, the alphaTest and depthTest fixes, the test cube, the single pink color,
 * the rotation before the wave) are kept and can be switched back on from the debug
 * panel. The final state of the handout is the default.
 */
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'

/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const particleTexture = textureLoader.load('textures/particles/2.png')

/**
 * Debug parameters (the defaults are the final state of the handout)
 */
const parameters = {
    geometry: 'random',
    count: 20000,
    color: false,
    texture: 'alphaMap',
    transparencyFix: 'depthWrite',
    testCube: false,
    additiveBlending: true,
    vertexColors: true,
    animation: 'wave'
}

/**
 * Particles
 */
// Geometry
// First particles: a sphere, each vertex becomes a particle
const sphereGeometry = new THREE.SphereGeometry(1, 32, 32)

// Custom geometry: 500 particles, then 5000, then 20000 in the Blending section
let count = parameters.count
let particlesGeometry = null

const generateParticlesGeometry = () =>
{
    // Destroy the old geometry
    if(particlesGeometry !== null)
    {
        particlesGeometry.dispose()
    }

    count = parameters.count
    particlesGeometry = new THREE.BufferGeometry()

    const positions = new Float32Array(count * 3) // Multiply by 3 because each position is composed of 3 values (x, y, z)
    // Different colors: one red, green and blue value per particle
    const colors = new Float32Array(count * 3)

    for(let i = 0; i < count * 3; i++) // Multiply by 3 for same reason
    {
        positions[i] = (Math.random() - 0.5) * 10 // Math.random() - 0.5 to have a random value between -0.5 and +0.5
        colors[i] = Math.random()
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3)) // Create the Three.js BufferAttribute and specify that each information is composed of 3 values
    particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
}
generateParticlesGeometry()

// Material
const particlesMaterial = new THREE.PointsMaterial({
    size: 0.02,
    sizeAttenuation: true
})
// Custom geometry: bigger particles
particlesMaterial.size = 0.1

const updateMaterial = () =>
{
    // Color, map and alpha map: one color for every particle
    // Commented out in the Different colors section, so it is off by default
    particlesMaterial.color = parameters.color ? new THREE.Color('#ff88cc') : new THREE.Color('#ffffff')

    // Color, map and alpha map: the texture on the map (front particles hide the back ones)
    particlesMaterial.map = parameters.texture === 'map' ? particleTexture : null

    // Color, map and alpha map: transparent + alphaMap instead of the map
    particlesMaterial.transparent = parameters.texture === 'alphaMap'
    particlesMaterial.alphaMap = parameters.texture === 'alphaMap' ? particleTexture : null

    // Using alphaTest: don't render the pixels with an alpha of 0
    particlesMaterial.alphaTest = parameters.transparencyFix === 'alphaTest' ? 0.001 : 0

    // Using depthTest: replaces the alphaTest, but draws the particles over the test cube
    particlesMaterial.depthTest = parameters.transparencyFix !== 'depthTest'

    // Using depthWrite: replaces the depthTest, the particles aren't written in the depth buffer
    particlesMaterial.depthWrite = parameters.transparencyFix !== 'depthWrite'

    // Blending: add the color of each pixel to the pixel already drawn (keeps the depthWrite)
    particlesMaterial.blending = parameters.additiveBlending ? THREE.AdditiveBlending : THREE.NormalBlending

    // Different colors: use the color attribute
    particlesMaterial.vertexColors = parameters.vertexColors

    // These properties change the shader, so the material has to be recompiled
    particlesMaterial.needsUpdate = true
}
updateMaterial()

// Points
const particles = new THREE.Points(
    parameters.geometry === 'sphere' ? sphereGeometry : particlesGeometry,
    particlesMaterial
)
scene.add(particles)

/**
 * Test cube (Using depthTest section, removed after the Blending section)
 */
const cube = new THREE.Mesh(
    new THREE.BoxGeometry(),
    new THREE.MeshBasicMaterial()
)
cube.visible = parameters.testCube
scene.add(cube)

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
 * Debug UI: switch earlier handout steps back on
 */
// First particles (sphere) or Custom geometry (random)
gui.add(parameters, 'geometry', { 'Sphere': 'sphere', 'Random': 'random' }).name('Geometry').onChange(() =>
{
    particles.geometry = parameters.geometry === 'sphere' ? sphereGeometry : particlesGeometry
})

gui.add(parameters, 'count').min(100).max(100000).step(100).name('count').onFinishChange(() =>
{
    generateParticlesGeometry()
    if(parameters.geometry === 'random')
    {
        particles.geometry = particlesGeometry
    }
})

gui.add(particlesMaterial, 'size').min(0.001).max(0.5).step(0.001).name('size')

gui.add(parameters, 'color').name('Color #ff88cc').onChange(updateMaterial)

gui.add(parameters, 'texture', { 'None': 'none', 'map': 'map', 'alphaMap': 'alphaMap' }).name('Texture').onChange(updateMaterial)

gui.add(parameters, 'transparencyFix', { 'None': 'none', 'alphaTest': 'alphaTest', 'depthTest': 'depthTest', 'depthWrite': 'depthWrite' }).name('Transparency fix').onChange(updateMaterial)

gui.add(parameters, 'testCube').name('Test cube').onChange((value) =>
{
    cube.visible = value
})

gui.add(parameters, 'additiveBlending').name('Additive blending').onChange(updateMaterial)

gui.add(parameters, 'vertexColors').name('Vertex colors').onChange(updateMaterial)

gui.add(parameters, 'animation', { 'None': 'none', 'Rotate': 'rotate', 'Wave': 'wave' }).name('Animation').onChange(() =>
{
    // Put the particles back where they were before the animation changed
    particles.rotation.y = 0
    if(parameters.animation !== 'wave')
    {
        generateParticlesGeometry()
        if(parameters.geometry === 'random')
        {
            particles.geometry = particlesGeometry
        }
    }
})

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update particles
    // By using the points as an object: rotate the whole particles
    if(parameters.animation === 'rotate')
    {
        particles.rotation.y = elapsedTime * 0.2
    }

    // By changing the attributes: each particle goes up and down on a wave
    if(parameters.animation === 'wave')
    {
        for(let i = 0; i < count; i++)
        {
            let i3 = i * 3
            const x = particlesGeometry.attributes.position.array[i3]
            particlesGeometry.attributes.position.array[i3 + 1] = Math.sin(elapsedTime + x)
        }
        particlesGeometry.attributes.position.needsUpdate = true
    }

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()
