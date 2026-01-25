import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';

import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

import * as TWEEN from "three/addons/libs/tween.module.js";

console.clear();

class BoxSkeleton extends THREE.Group{
  constructor(){
    super();
    const lim = 1;
    for(let x = -lim; x <= lim; x++){
      for(let y = -lim; y <= lim; y++){
        for(let z = -lim; z <= lim; z++){
          if(x == 0 && y == 0 && z == 0) continue;
          const obj = new THREE.Object3D();
          obj.position.set(x, y, z);
          obj.userData = {
            position: new THREE.Vector3(x, y, z),
            color: new THREE.Color(Math.random() > 0.5 ? "#ccc" : "#444")
          }
          this.add(obj);
        }
      }
    }
    
    this.animation = {
      axes: [
        new THREE.Vector3(1, 0, 0),
        new THREE.Vector3(0, 1, 0),
        new THREE.Vector3(0, 0, 1)
      ],
      coords: ["x", "y", "z"],
      layers: [-1, 0, 1]
    }
    
    this.sequence((Math.random() + 1) * 1000);
  }
  
  sequence(delay){
    //this.updateWorldMatrix();
    const ani = this.animation;
    const axisIdx = Math.floor(Math.random() * 3);
    const axis = ani.axes[axisIdx];
    const layer = ani.layers[Math.floor(Math.random() * 3)];
    const coord = ani.coords[axisIdx];
    //console.log(axis, layer, coord)
    const boxies = this.children.filter(boxie => {
      return Math.abs(boxie.position[coord] - layer) < 0.1;
    });
    //console.log(boxies);
    const rotation = Math.PI * 0.5 * 
          Math.sign(Math.random() - 0.5) * 
          (Math.random() > 0.5 ? 2 : 1);
    
    new TWEEN.Tween({val: 0}).to({val: 1}, 1000)
      .delay(delay)
      .easing(TWEEN.Easing.Exponential.Out)
      .onUpdate((val) => {
        boxies.forEach(boxie => {
          const angle = rotation * val.val;
          boxie.position.copy(boxie.userData.position).applyAxisAngle(axis, angle);
          boxie.rotation[coord] = angle;
        })
      })
      .onComplete(() => {
        boxies.forEach(boxie => {
          boxie.userData.position.copy(boxie.position);
          boxie.rotation.set(0, 0, 0);
        });
        this.sequence(Math.random() * 1000)
      })
      .start();
    
  }
}

class Boxes extends THREE.Group{
  constructor(){
    super();
    this.model = [];
    const lim = 2;
    for(let x = -lim; x <= lim; x++){
      for(let y = -lim; y <= lim; y++){
        for(let z = -lim; z <= lim; z++){
          const bs = new BoxSkeleton();
          bs.position.set(x, y, z).multiplyScalar(6);
          this.model.push(bs);
        }
      }
    }
    
    this.view = new THREE.InstancedMesh(
      new RoundedBoxGeometry(),
      new THREE.MeshStandardMaterial({
        metalness: 0.7,
        roughness: 0.4,
        emissive: new THREE.Color(0x88ffff),
        emissiveMap: (() => {
          const c = document.createElement("canvas");
          c.width = c.height = 512;
          const ctx = c.getContext("2d");
          const u = val => val * 0.01 * c.height;
          
          ctx.strokeStyle = "#fff";
          ctx.lineWidth = u(7);
          ctx.strokeRect(0, 0, c.width, c.height);
          
          const tex = new THREE.CanvasTexture(c);
          tex.colorSpace = "srgb";
          tex.anisotropy = 8;
          return tex;
        })()
      }),
      this.model.length * 26
    );
    this.model.forEach((boxSkeleton, bsIdx) => {
      boxSkeleton.children.forEach((boxie, bIdx) => {
        this.view.setColorAt(bsIdx * 26 + bIdx, boxie.userData.color);
      })
    })
    this.add(this.view);
    
    //this.update();
  }
  
  update(){
    this.model.forEach((boxSkeleton, bsIdx) => {
      boxSkeleton.updateMatrixWorld();
      boxSkeleton.children.forEach((boxie, bIdx) => {
        this.view.setMatrixAt(bsIdx * 26 + bIdx, boxie.matrixWorld);
      });
    });
    this.view.instanceMatrix.needsUpdate = true;
  }
}

const scene = new THREE.Scene();
scene.background = new THREE.Color("#012");
scene.fog = new THREE.Fog(scene.background, 20, 60);
const camera = new THREE.PerspectiveCamera(
  45,
  innerWidth / innerHeight,
  0.01,
  1000
);
camera.position.set(1, 1.9, 1).setLength(39);
const renderer = new THREE.WebGLRenderer({
  antialias: true
});
renderer.setPixelRatio(devicePixelRatio);
renderer.setSize(innerWidth, innerHeight);
document.body.appendChild(renderer.domElement);

addEventListener("resize", () => {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
});

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.enablePan = false;
controls.enableZoom = false;

const pmremGenerator = new THREE.PMREMGenerator( renderer );
scene.environment = pmremGenerator.fromScene( new RoomEnvironment(), 0.04 ).texture;

const boxes = new Boxes();
scene.add(boxes);

const clock = new THREE.Clock();
let t = 0;

renderer.setAnimationLoop(() => {
  const dt = clock.getDelta();
  t += dt;
  
  TWEEN.update();
  
  boxes.update();
  
  controls.update();
  renderer.render(scene, camera);
});