/**
 * Activity 3.2 - Galaxy Generator
 * Nimrod P. Pala | ITE 18-FNHX1 | ITE-18 Applications Development and Emerging Technologies
 *
 * A spiral galaxy made of 100000 particles, generated again each time a parameter
 * changes in the debug panel.
 * The handout rewrites the positioning formula step by step (random cube, line,
 * branches, spin, randomness, randomness power, colors). Every version is kept, and
 * the "Handout step" menu picks which one generateGalaxy uses. The final state of
 * the handout is the default.
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
 * Galaxy
 */
const parameters = {}
// Base particles: 1000 particles of 0.02, then 100000 of 0.01 once the old galaxy is destroyed
parameters.count = 100000
parameters.size = 0.01
// Shape
parameters.radius = 5
parameters.branches = 3
parameters.spin = 1
parameters.randomness = 0.2
parameters.randomnessPower = 3
// Colors
parameters.insideColor = '#ff6030'
parameters.outsideColor = '#1b3984'
// Which version of the positioning formula generateGalaxy uses
parameters.step = 'colors'
// From the instructor's video (missing from the handout): rotate the whole galaxy, off so the default view matches the handout
parameters.rotateGalaxy = false

let geometry = null
let material = null
let points = null

const generateGalaxy = () =>
{
    // Destroy old galaxy
    if(points !== null)
    {
        geometry.dispose()
        material.dispose()
        scene.remove(points)
    }

    /**
     * Geometry
     */
    geometry = new THREE.BufferGeometry()

    const positions = new Float32Array(parameters.count * 3)
    const colors = new Float32Array(parameters.count * 3)

    const colorInside = new THREE.Color(parameters.insideColor)
    const colorOutside = new THREE.Color(parameters.outsideColor)

    for(let i = 0; i < parameters.count; i++)
    {
        const i3 = i * 3

        // Before the Colors section there are no vertex colors, so the particles are white
        colors[i3    ] = 1
        colors[i3 + 1] = 1
        colors[i3 + 2] = 1

        if(parameters.step === 'base')
        {
            // Base particles: a random cube
            positions[i3    ] = (Math.random() - 0.5) * 3
            positions[i3 + 1] = (Math.random() - 0.5) * 3
            positions[i3 + 2] = (Math.random() - 0.5) * 3
        }
        else if(parameters.step === 'radius')
        {
            // Radius: all the particles on a straight line
            const radius = Math.random() * parameters.radius
            positions[i3    ] = radius
            positions[i3 + 1] = 0
            positions[i3 + 2] = 0
        }
        else if(parameters.step === 'branches')
        {
            // Branches: an angle per branch, then cos and sin for the x and the z
            const radius = Math.random() * parameters.radius
            const branchAngle = (i % parameters.branches) / parameters.branches * Math.PI * 2

            positions[i3    ] = Math.cos(branchAngle) * radius
            positions[i3 + 1] = 0
            positions[i3 + 2] = Math.sin(branchAngle) * radius
        }
        else if(parameters.step === 'spin')
        {
            // Spin: the further the particle is from the center, the more spin it gets
            const radius = Math.random() * parameters.radius
            const spinAngle = radius * parameters.spin
            const branchAngle = (i % parameters.branches) / parameters.branches * Math.PI * 2

            positions[i3    ] = Math.cos(branchAngle + spinAngle) * radius
            positions[i3 + 1] = 0
            positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius
        }
        else if(parameters.step === 'randomness')
        {
            // Randomness: a random value on each axis, multiplied by the radius
            const radius = Math.random() * parameters.radius
            const spinAngle = radius * parameters.spin
            const branchAngle = (i % parameters.branches) / parameters.branches * Math.PI * 2

            const randomX = (Math.random() - 0.5) * parameters.randomness * radius
            const randomY = (Math.random() - 0.5) * parameters.randomness * radius
            const randomZ = (Math.random() - 0.5) * parameters.randomness * radius

            positions[i3    ] = Math.cos(branchAngle + spinAngle) * radius + randomX
            positions[i3 + 1] = randomY
            positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ
        }
        else
        {
            // Randomness power: Math.pow crushes the random values close to 0, then * -1 randomly
            const radius = Math.random() * parameters.radius
            const spinAngle = radius * parameters.spin
            const branchAngle = (i % parameters.branches) / parameters.branches * Math.PI * 2

            const randomX = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : - 1) * parameters.randomness * radius
            const randomY = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : - 1) * parameters.randomness * radius
            const randomZ = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : - 1) * parameters.randomness * radius

            positions[i3    ] = Math.cos(branchAngle + spinAngle) * radius + randomX
            positions[i3 + 1] = randomY
            positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ

            if(parameters.step === 'red')
            {
                // Colors: a red galaxy first
                colors[i3    ] = 1
                colors[i3 + 1] = 0
                colors[i3 + 2] = 0
            }
            else if(parameters.step === 'colors')
            {
                // Colors: mix the inside color with the outside color, depending on the distance from the center
                const mixedColor = colorInside.clone()
                mixedColor.lerp(colorOutside, radius / parameters.radius)

                colors[i3    ] = mixedColor.r
                colors[i3 + 1] = mixedColor.g
                colors[i3 + 2] = mixedColor.b
            }
        }
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

    /**
     * Material
     */
    material = new THREE.PointsMaterial({
        size: parameters.size,
        sizeAttenuation: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        vertexColors: true
    })

    /**
     * Points
     */
    points = new THREE.Points(geometry, material)
    scene.add(points)
}
generateGalaxy()

// The tweaks come after generateGalaxy, otherwise it doesn't exist yet
gui.add(parameters, 'step', {
    '1 - Base particles': 'base',
    '2 - Radius': 'radius',
    '3 - Branches': 'branches',
    '4 - Spin': 'spin',
    '5 - Randomness': 'randomness',
    '6 - Randomness power': 'power',
    '7 - Colors: all red': 'red',
    '7 - Colors (final)': 'colors'
}).name('Handout step').onFinishChange(generateGalaxy)
gui.add(parameters, 'count').min(100).max(1000000).step(100).onFinishChange(generateGalaxy)
gui.add(parameters, 'size').min(0.001).max(0.1).step(0.001).onFinishChange(generateGalaxy)
gui.add(parameters, 'radius').min(0.01).max(20).step(0.01).onFinishChange(generateGalaxy)
gui.add(parameters, 'branches').min(2).max(20).step(1).onFinishChange(generateGalaxy)
gui.add(parameters, 'spin').min(- 5).max(5).step(0.001).onFinishChange(generateGalaxy)
gui.add(parameters, 'randomness').min(0).max(2).step(0.001).onFinishChange(generateGalaxy)
gui.add(parameters, 'randomnessPower').min(1).max(10).step(0.001).onFinishChange(generateGalaxy)
gui.addColor(parameters, 'insideColor').onFinishChange(generateGalaxy)
gui.addColor(parameters, 'outsideColor').onFinishChange(generateGalaxy)
gui.add(parameters, 'rotateGalaxy').name('Rotate galaxy').onChange((value) =>
{
    if(! value && points !== null)
    {
        points.rotation.y = 0
    }
})

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
camera.position.x = 3
camera.position.y = 3
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
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // From the instructor's video (missing from the handout): rotate the whole galaxy
    if(parameters.rotateGalaxy && points !== null)
    {
        points.rotation.y = elapsedTime * 0.1
    }

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()
