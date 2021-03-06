let renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// array of functions for the rendering loop
let renderCollection = [];

// init scene and camera
let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.01, 1000);
camera.position.z = 0;

let markerObject3D = new THREE.Object3D;
scene.add(markerObject3D);
let FLOOR = -250;
let mixer, bonesClip;
let mesh, helper;
let clock = new THREE.Clock();


let createScene = (geometry, materials, x, y, z, s) => {
    geometry.computeBoundingBox();
    for (let i = 0; i < materials.length; i++)
    {
        let m = materials[i];
        m.skinning = true;
        m.morphTargets = true;
        m.specular.setHSL(0, 0, 0.1);
        m.color.setHSL(0.6, 0, 0.6);
    }

    mesh = new THREE.SkinnedMesh(geometry, materials);
    mesh.scale.set(1, 1, 1).multiplyScalar(1 / 20);
    mesh.rotation.x = Math.PI / 2;
    helper = new THREE.SkeletonHelper(mesh);
    helper.material.linewidth = 3;
    helper.visible = false;
    scene.add(helper);
    mixer = new THREE.AnimationMixer(mesh);

    bonesClip = geometry.animations[0];
    markerObject3D.add(mesh);
    mixer.clipAction(bonesClip, null).play();
};

let initLoader = () => {
    let loader = new THREE.MMDLoader();
    let modelUrl = 'models/miku/';
    loader.load(modelUrl + 'miku_v2.pmd', [modelUrl + 'wavefile_v2.vmd'], _mesh => {
        _mesh.scale.set(1, 1, 1).multiplyScalar(1 / 20);
        _mesh.rotation.x = Math.PI / 2;
        createScene(_mesh.geometry, _mesh.material, 0, FLOOR, -300, 30);
    });
};

initLoader();

// handle window resize
window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
}, false);


// render the scene
renderCollection.push(() => renderer.render(scene, camera));

// init the marker recognition
let jsArucoMarker = new THREEx.JsArucoMarker();
let videoGrabbing = new THREEx.WebcamGrabbing();
jsArucoMarker.videoScaleDown = 2;

// attach the videoGrabbing.domElement to the body
document.body.appendChild(videoGrabbing.domElement);

// process the image source with the marker recognition
renderCollection.push(() => {
    let markers = jsArucoMarker.detectMarkers(videoGrabbing.domElement);
    markerObject3D.visible = false;
    // see if this.markerId has been found
    markers.forEach(marker => {
        jsArucoMarker.markerToObject3D(marker, markerObject3D);
        markerObject3D.visible = true;
    })
});

let render = () => {
    if (mixer)
    {
        mixer.update(0.75 * clock.getDelta());
    }
    renderCollection.forEach(callback => callback())
};

let animate = () => {
    requestAnimationFrame(animate);
    render();
};
animate();