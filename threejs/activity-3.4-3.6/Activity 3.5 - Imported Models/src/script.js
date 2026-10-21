/**
 * Activity 3.5 - Imported Models
 * Nimrod P. Pala | ITE 18-FNHX1 | ITE-18 Applications Development and Emerging Technologies
 *
 * glTF models loaded with the GLTFLoader (and the DRACOLoader for the compressed duck):
 * the duck in four formats, the FlightHelmet and the animated Fox.
 * Steps that the handout replaces later (the ducks, the helmet and its five ways of being
 * added to the scene, the other fox animations) are kept and can be picked from the
 * debug panel. The final state of the handout (the fox running) is the default.
 */
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import * as dat from 'lil-gui'

/**
 * Base
 */
// Debug
const gui = new dat.GUI()
const debugObject = {
    model: 'Fox',
    helmetAddMethod: 'gltf.scene',
    foxAnimation: '2 Run'
}

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Models
 */
// Draco compression (p.10-11): the DRACOLoader is created before the gltfLoader
// Deviation from handout: the decoder comes from node_modules/three/examples/jsm/libs/draco/ because examples/js/ was removed in r148
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('/draco/')

const gltfLoader = new GLTFLoader()
gltfLoader.setDRACOLoader(dracoLoader)

let mixer = null

// Load the model in Three.js, first version (p.4-5): with the success, progress and error callbacks
// gltfLoader.load(
//     '/models/Duck/glTF/Duck.gltf',
//     (gltf) =>
//     {
//         console.log('success')
//         console.log(gltf)
//     },
//     (progress) =>
//     {
//         console.log('progress')
//         console.log(progress)
//     },
//     (error) =>
//     {
//         console.log('error')
//         console.log(error)
//     }
// )

// Then only the success callback (p.5)
// gltfLoader.load(
//     '/models/Duck/glTF/Duck.gltf',
//     (gltf) =>
//     {
//         console.log(gltf)
//     }
// )

// Model switch (not in the handout): every model below is loaded with loadModel(), which keeps
// track of what its callback added to the scene so that the next model can remove it
let modelObjects = []
let lastLoadId = 0

const loadModel = (path, callback) =>
{
    const loadId = ++lastLoadId

    gltfLoader.load(
        path,
        (gltf) =>
        {
            // A newer model was picked while this one was loading
            if(loadId !== lastLoadId)
                return

            const childrenBefore = [...scene.children]
            callback(gltf)
            modelObjects = scene.children.filter((child) => ! childrenBefore.includes(child))
        }
    )
}

const removeModel = () =>
{
    for(const object of modelObjects)
    {
        scene.remove(object)
    }
    modelObjects = []
    mixer = null
}

// Add the loaded model to our scene (p.6): only the Object3D with the duck, in the three formats
const loadDuck = (path) =>
{
    loadModel(
        path,
        (gltf) =>
        {
            scene.add(gltf.scene.children[0])
        }
    )
}

// FlightHelmet (p.7-9): each attempt at adding all of its children
const helmetAddMethods = {
    // Only a few parts (p.7)
    'children[0]': (gltf) =>
    {
        scene.add(gltf.scene.children[0])
    },
    // Buggy (p.7-8): adding a child removes it from gltf.scene, so the loop skips every other one
    'for...of (buggy)': (gltf) =>
    {
        for(const child of gltf.scene.children)
        {
            scene.add(child)
        }
    },
    // The whole helmet (p.8)
    'while loop': (gltf) =>
    {
        while(gltf.scene.children.length)
        {
            scene.add(gltf.scene.children[0])
        }
    },
    // A copy of the children array (p.9)
    'spread copy': (gltf) =>
    {
        const children = [...gltf.scene.children]
        for(const child of children)
        {
            scene.add(child)
        }
    },
    // The simplest one: add the whole scene (p.9)
    'gltf.scene': (gltf) =>
    {
        scene.add(gltf.scene)
    }
}

const loadHelmet = () =>
{
    loadModel(
        '/models/FlightHelmet/glTF/FlightHelmet.gltf',
        (gltf) =>
        {
            helmetAddMethods[debugObject.helmetAddMethod](gltf)
        }
    )
}

// Animations (p.12-15): the fox, scaled down and animated with an AnimationMixer
const foxAnimationIndexes = {
    '0 Survey': 0,
    '1 Walk': 1,
    '2 Run': 2
}
let foxAnimations = null

const loadFox = () =>
{
    loadModel(
        '/models/Fox/glTF/Fox.gltf',
        (gltf) =>
        {
            // Deviation from handout: p.14 uses 0.03, but p.12 and the instructor's video use 0.025
            gltf.scene.scale.set(0.025, 0.025, 0.025)
            scene.add(gltf.scene)

            mixer = new THREE.AnimationMixer(gltf.scene)
            foxAnimations = gltf.animations
            const action = mixer.clipAction(gltf.animations[foxAnimationIndexes[debugObject.foxAnimation]])
            action.play()
        }
    )
}

const models = {
    'Duck (glTF)': () => loadDuck('/models/Duck/glTF/Duck.gltf'), // Default glTF
    'Duck (Binary)': () => loadDuck('/models/Duck/glTF-Binary/Duck.glb'), // glTF-Binary
    'Duck (Embedded)': () => loadDuck('/models/Duck/glTF-Embedded/Duck.gltf'), // glTF-Embedded
    'Duck (Draco)': () => loadDuck('/models/Duck/glTF-Draco/Duck.gltf'), // glTF-Draco
    'Flight Helmet': loadHelmet,
    'Fox': loadFox
}

const showModel = () =>
{
    removeModel()
    models[debugObject.model]()
}
showModel()

gui.add(debugObject, 'model', Object.keys(models)).name('Model').onChange(showModel)

gui.add(debugObject, 'helmetAddMethod', Object.keys(helmetAddMethods)).name('Helmet add method').onChange(() =>
{
    if(debugObject.model === 'Flight Helmet')
    {
        showModel()
    }
})

// "You can test the other animations by changing the value in the clipAction(...) method" (p.14)
gui.add(debugObject, 'foxAnimation', Object.keys(foxAnimationIndexes)).name('Fox animation').onChange(() =>
{
    if(mixer && foxAnimations)
    {
        mixer.stopAllAction()
        mixer.clipAction(foxAnimations[foxAnimationIndexes[debugObject.foxAnimation]]).play()
    }
})

/**
 * Floor
 */
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(10, 10),
    new THREE.MeshStandardMaterial({
        color: '#444444',
        metalness: 0,
        roughness: 0.5
    })
)
floor.receiveShadow = true
floor.rotation.x = - Math.PI * 0.5
scene.add(floor)

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.8)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6)
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
camera.position.set(2, 2, 2)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.target.set(0, 0.75, 0)
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
let previousTime = 0

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - previousTime
    previousTime = elapsedTime

    // Update mixer (p.14)
    if(mixer)
    {
        mixer.update(deltaTime)
    }

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()
