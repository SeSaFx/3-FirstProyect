// Imports Daniel Restrepo Sebast
import * as THREE from 'https://cdn.skypack.dev/three@0.131.3';
import * as dat from 'dat.gui';
import { OrbitControls } from 'https://cdn.skypack.dev/three@0.131.3/examples/jsm/controls/OrbitControls.js';

// Configuracion basica
let gui = undefined;

let size = 0;
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000,
);
const renderer = new THREE.WebGLRenderer();

// Paleta de colores
const palette = {
  bgColor: '#7E7E7E', // CSS String
};
var wireframe = {
  switch:false
};
let plane = undefined;

// Variables generales
let countCube = undefined;
let countsphere = undefined;
let ambientLight = undefined;
let spotLight = undefined;
let pointLight = undefined;
let directionalLight = undefined;

let GUIFolderCube = 1;
let GUIFolderSphere= 1;

let GUIFolderAmbientLight = 1;
let GUIFolderSpotLight = 1;
let GUIFolderPointLight = 1;
let GUIFolderDirectionalLight = 1;
wireframe.switch=true;

// Arreglos de objetos
const objectsCube = [];
const objectsSphere = [];

const objectAmbientLight = [];
const objetSpotLight = []; 
const objectPointLight = [];
const objectDirectionalLight = [];


window.onresize = () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight, true);
};

export function reset() {
  scene.children = [];
  renderer.setSize(0, 0, true);
  countCube = 0;
  GUIFolderCube = 1;
  countsphere = 0;
  GUIFolderSphere = 1;

  GUIFolderAmbientLight =1;
  ambientLight=0;
  GUIFolderSpotLight= 1;
  spotLight= 0;
  GUIFolderPointLight =1;
  pointLight=0;
  GUIFolderDirectionalLight= 1;
  directionalLight= 0;
}

export function main(optionSize) {
  reset();
  // Configuracion inicial
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.setClearColor(palette.bgColor, 1);
  document.body.appendChild(renderer.domElement);

  camera.position.z = 15;
  camera.position.y = 15;

  // Controls
  new OrbitControls(camera, renderer.domElement);

  // Plano por defecto
  defaultPlane(optionSize);

  // GUI
  loadGUI();

  // Render
  animate();
}

//
function defaultPlane(size) {
  const geometry = new THREE.PlaneGeometry(size, size, size, size);
  const material = new THREE.MeshPhongMaterial({
    color: 0x535353,
    side: THREE.DoubleSide,
    wireframe: wireframe.switch,
  });
  plane = new THREE.Mesh(geometry, material);
  scene.add(plane);
  plane.receiveShadow = true;
  //plane.castShadow =true;
  
  plane.rotation.x = Math.PI / 2;

  
}


//
function loadGUI() {
  cleanGUI();
  gui = new dat.GUI();
  gui.open();

  const folderP = gui.addFolder('plane');
  folderP.open();
  folderP.add(wireframe,'switch').name('wireframe');


}

// Limpia el GUI
export function cleanGUI() {
  const dom = document.querySelector('.dg.main');
  if (dom) dom.remove();
}

/* // LUCES
export function setupLights() {
  const ambient = new THREE.AmbientLight(0xffffff, 0.4);
  scene.add(ambient);

  spotLight = new THREE.SpotLight(0xffffff, 1);
  spotLight.position.set(0, 10, 0);
  spotLight.angle = Math.PI / 4;
  spotLight.penumbra = 0.1;
  spotLight.decay = 2;
  spotLight.distance = 200;

  spotLight.castShadow = true;
  scene.add(spotLight);

  
}
 */
function animate() {
  requestAnimationFrame(animate);
  updateElements();
  renderer.render(scene, camera);
}

function updateElements() {
  _updateCubes();
  _updateSpheres();

  _updateAmbientLights();
  _updateSpotLights();
  _updatePointLights();
  _updateDirectionalLights();

  plane.material.wireframe = wireframe.switch;
  
}

//CUBO
export function createCubeGeneric() {
  const geometry = new THREE.BoxGeometry();
  const material = new THREE.MeshBasicMaterial({
    color: 0x00B9FF,
    wireframe: false,
  });
  const cube = new THREE.Mesh(geometry, material);

  scene.add(cube);
  objectsCube.push(cube);
  cube.position.y = 0.5;
  cube.castShadow = true;
  cube.receiveShadow = true;

  cube.GUIcube = _cubeObject();
  _createCubeGUI(cube.GUIcube);

  countCube = countCube + 1;
}

function _cubeObject() {
  var GUIcube = {
    material: 'Basic',
    Wireframe:false,
    materialColor: 0x00B9FF,
    scaleX: 2,
    scaleY: 2,
    scaleZ: 2,
    segmento1:1,
    segmento2:1,
    segmento3:1,
    posX: 0,
    posY: 4,
    posZ: 0,
  };

  return GUIcube;
}

function _createCubeGUI(GUIcube) {
  const folder = gui.addFolder('Cube ' + GUIFolderCube);
  //wireframe}
  folder.add(GUIcube, 'Wireframe');
  // Material
  folder.addColor(GUIcube, 'materialColor').name('COLOR');
  folder.add(GUIcube, 'material', ['Basic', 'Phong', 'Lambert']);

  // Escala
  folder.add(GUIcube, 'scaleX').name("Escala X");
  folder.add(GUIcube, 'scaleY').name("Escala Y");
  folder.add(GUIcube, 'scaleZ').name("Escala Z");

  // segmentos
  folder.add(GUIcube, 'segmento1').name("SEGMENTOS X");
  folder.add(GUIcube, 'segmento2').name("SEGMENTOS Y");
  folder.add(GUIcube, 'segmento3').name("SEGMENTOS Z");

  // Posicion
  folder.add(GUIcube, 'posX').name("POSICION X");
  folder.add(GUIcube, 'posY').name("POSICION Y");
  folder.add(GUIcube, 'posZ').name("POSICION Z");

  GUIFolderCube = GUIFolderCube + 1;
}

function _updateCubes() {
  Object.keys(objectsCube).forEach((i) => {
    const cubeSelected = objectsCube[i];
    //Material cubo
    cubeSelected.GUIcube.material == 'Basic'
      ? (cubeSelected.material = new THREE.MeshBasicMaterial({
          color: cubeSelected.GUIcube.materialColor,
        }))
      : cubeSelected.GUIcube.material == 'Lambert'
      ? (cubeSelected.material = new THREE.MeshLambertMaterial({
          color: cubeSelected.GUIcube.materialColor,
        }))
      : (cubeSelected.material = new THREE.MeshPhongMaterial({
          color: cubeSelected.GUIcube.materialColor,
        }));

    //Escalar cubo
    cubeSelected.geometry = new THREE.BoxGeometry(
      cubeSelected.GUIcube.scaleX,
      cubeSelected.GUIcube.scaleY,
      cubeSelected.GUIcube.scaleZ,
      cubeSelected.GUIcube.segmento1,
      cubeSelected.GUIcube.segmento2,
      cubeSelected.GUIcube.segmento3,
    );
    
    //wireframe
    cubeSelected.material.wireframe = cubeSelected.GUIcube.Wireframe;
      
    


    //Posición
    cubeSelected.position.x = cubeSelected.GUIcube.posX;
    cubeSelected.position.y = cubeSelected.GUIcube.posY;
    cubeSelected.position.z = cubeSelected.GUIcube.posZ;
  });
}

//ESFERA
export function createSphereGeneric() {
  const geometry = new THREE.SphereGeometry();
  const material = new THREE.MeshBasicMaterial({
    color: 0xffaec0,
    wireframe: false,
  });
  const sphere = new THREE.Mesh(geometry, material);

  scene.add(sphere);
  objectsSphere.push(sphere);
  sphere.position.y = 0.5;
  sphere.castShadow = true;
  sphere.receiveShadow = true;

  sphere.GUIsphere = _SphereObject();
  _createSphereGUI(sphere.GUIsphere);

  countsphere = countsphere + 1;
}

function _SphereObject() {
  var GUIsphere = {
    material: 'Basic',
    Wireframe:false,
    materialColor: 0xffaec0,
    scaleX: 4,
    scaleY: 32,
    scaleZ: 32,
    /* seg1:1,
    seg2:1,
    seg3:1, */
    posX: 0,
    posY: 4,
    posZ: 0,
  };

  return GUIsphere;
}

function _createSphereGUI(GUIsphere) {
  const folder2 = gui.addFolder('Sphere ' + GUIFolderSphere);

  //wireframe
  folder2.add(GUIsphere,'Wireframe');
  // Material
  folder2.addColor(GUIsphere, 'materialColor');
  folder2.add(GUIsphere, 'material', ['Basic', 'Phong', 'Lambert']);

  // Escala
  folder2.add(GUIsphere, 'scaleX');
  folder2.add(GUIsphere, 'scaleY');
  folder2.add(GUIsphere, 'scaleZ');

   // segmentos
  /*  folder2.add(GUIsphere, 'seg1');
   folder2.add(GUIsphere, 'seg2');
   folder2.add(GUIsphere, 'seg3'); */

  // Posicion
  folder2.add(GUIsphere, 'posX');
  folder2.add(GUIsphere, 'posY');
  folder2.add(GUIsphere, 'posZ');

  GUIFolderSphere = GUIFolderSphere + 1;
}

function _updateSpheres() {
  Object.keys(objectsSphere).forEach((i) => {
    const sphereSelected = objectsSphere[i];
    //Material Esfera
    sphereSelected.GUIsphere.material == 'Basic'
      ? (sphereSelected.material = new THREE.MeshBasicMaterial({
          color: sphereSelected.GUIsphere.materialColor,
        }))
      : sphereSelected.GUIsphere.material == 'Lambert'
      ? (sphereSelected.material = new THREE.MeshLambertMaterial({
          color: sphereSelected.GUIsphere.materialColor,
        }))
      : (sphereSelected.material = new THREE.MeshPhongMaterial({
          color: sphereSelected.GUIsphere.materialColor,
        }));

    //Escalar Esfera
    sphereSelected.geometry = new THREE.SphereGeometry(
      sphereSelected.GUIsphere.scaleX,
      sphereSelected.GUIsphere.scaleY,
      sphereSelected.GUIsphere.scaleZ,
      /* sphereSelected.GUIsphere.seg1,
      sphereSelected.GUIsphere.seg2,
      sphereSelected.GUIsphere.seg3, */
    );

    //WIREFRAME
    sphereSelected.material.wireframe = sphereSelected.GUIsphere.Wireframe;

    //Posición
    sphereSelected.position.x = sphereSelected.GUIsphere.posX;
    sphereSelected.position.y = sphereSelected.GUIsphere.posY;
    sphereSelected.position.z = sphereSelected.GUIsphere.posZ;
  });
}



//LIGHTS - AMBIENT LIGHT
export function createAmbientLight() {

  const ambient = new THREE.AmbientLight(0xffffff);
  ambient.castShadow = true; 

  scene.add(ambient);
   
  objectAmbientLight.push(ambient);
  ambient.GUIambient = _ambientLight();
  _createAmbientLightGUI(ambient.GUIambient);

  ambientLight = ambientLight + 1;

}


 function _ambientLight() {
  var GUIambient = {
    color: 0xffffff,
    intensidad:2,
    
    
  };
  
  return GUIambient;
}


function _createAmbientLightGUI(GUIambient) {
  const folder = gui.addFolder('AmbientLight ' + GUIFolderAmbientLight);
  
  //Color
  folder.addColor(GUIambient, 'color');
  folder.add(GUIambient, 'intensidad');

 

  GUIFolderAmbientLight = GUIFolderAmbientLight + 1;
}
 

function _updateAmbientLights() {
  Object.keys(objectAmbientLight).forEach((i) => {
    const LightSelected = objectAmbientLight[i];
    
    LightSelected.color.setHex(LightSelected.GUIambient.color);
    LightSelected.intensity = LightSelected.GUIambient.intensidad;

    
  });
}



//SPOT LIGHT
export function createSpotLight() {

  const spot = new THREE.SpotLight(0xffffff,1);
    spot.castShadow = true;
    spot.position.set(15,40,35);   
    spot.angle = Math.PI/4; 
    spot.penumbra = 0.1;
    spot.decay = 4000;
    spot.distance = 30;
    spot.focus = 1;

  /*   const renderer = new THREE.WebGLRenderer();
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap; */

     
  
scene.add( spot );


objetSpotLight.push(spot);
spot.GUIspot = _spotLight();
_createSpotLightGUI(spot.GUIspot);

spotLight = spotLight + 1;

}


function _spotLight() {
  var GUIspot = {
    LightColor: 0xffffff,
    intensidad:2,
    angle:Math.PI/4,
    penumbra:0.1,
    decay:-15,
    distance:0,
    focus:1,
    posX: 15,
    posY: 40,
    posZ: 35,
  };
  
  return GUIspot;
}


function _createSpotLightGUI(GUIspot) {
  const folder = gui.addFolder('SpotLight ' + GUIFolderSpotLight);

  //Color
  folder.addColor(GUIspot, 'LightColor');

  folder.add(GUIspot, 'angle');
  folder.add(GUIspot, 'intensidad');
  folder.add(GUIspot, 'penumbra');
  folder.add(GUIspot, 'decay');
  folder.add(GUIspot, 'distance');
  folder.add(GUIspot, 'focus');


  // Posicion
  folder.add(GUIspot, 'posX');
  folder.add(GUIspot, 'posY');
  folder.add(GUIspot, 'posZ');

  GUIFolderSpotLight = GUIFolderSpotLight + 1;
}
 

function _updateSpotLights() {
  Object.keys(objetSpotLight).forEach((i) => {
    const LightSelected = objetSpotLight[i];

    //Color
    LightSelected.color.setHex(LightSelected.GUIspot.LightColor);
    LightSelected.angle = LightSelected.GUIspot.angle;
    LightSelected.intensity = LightSelected.GUIspot.intensidad;
    LightSelected.penumbra = LightSelected.GUIspot.penumbra;
    LightSelected.decay = LightSelected.GUIspot.decay;
    LightSelected.distance = LightSelected.GUIspot.distance;
    LightSelected.focus = LightSelected.GUIspot.focus;

    //Posición
    LightSelected.position.x = LightSelected.GUIspot.posX;
    LightSelected.position.y = LightSelected.GUIspot.posY;
    LightSelected.position.z = LightSelected.GUIspot.posZ;
  });
}



//POINT LIGHT
export function createPointLight() {

  const point = new THREE.PointLight( 0xff0000, 1.0, 100 );
  point.position.set( 50, 50, 50 );
  point.castShadow = true;
  scene.add( point );


  /* const renderer = new THREE.WebGLRenderer();
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;  */

  /* const LightSelected = pointLight; */
  objectPointLight.push(point);
  point.GUIpoint = _pointLight();
  _createPointLightGUI(point.GUIpoint);

  pointLight = pointLight + 1;

}


function _pointLight() {
  var GUIpoint = {
    LightColor: 0xffffff,
    intensidad:7,
    distancia:0,
    cadencia:5,
    posX: 5,
    posY: 21,
    posZ: -3,
  };
  
  return GUIpoint;
}


function _createPointLightGUI(GUIpoint) {
  const folder = gui.addFolder('PointLight ' + GUIFolderPointLight);
  
  //Color, intensidad distancia y cadencia
  folder.addColor(GUIpoint, 'LightColor');
  
  folder.add(GUIpoint, 'intensidad');

  folder.add(GUIpoint, 'distancia');

  folder.add(GUIpoint, 'cadencia');

  // Posicion
  folder.add(GUIpoint, 'posX');
  folder.add(GUIpoint, 'posY');
  folder.add(GUIpoint, 'posZ');

  GUIFolderPointLight = GUIFolderPointLight + 1;


}
 

function _updatePointLights() {
  Object.keys(objectPointLight).forEach((i) => {
    const LightSelected = objectPointLight[i];
    
    /* (LightSelected.material = new THREE.pointLight({
      color: lightSelected.GUIpoint.materialColor,
    })) */

    LightSelected.intensity = LightSelected.GUIpoint.intensidad;
    LightSelected.color.setHex(LightSelected.GUIpoint.LightColor);
    LightSelected.decay = LightSelected.GUIpoint.cadencia;

    //Posición
    LightSelected.position.x = LightSelected.GUIpoint.posX;
    LightSelected.position.y = LightSelected.GUIpoint.posY;
    LightSelected.position.z = LightSelected.GUIpoint.posZ;

  });
}



//DIRECTIONAL LIGHT
export function createDirectionalLight() {

  const directional = new THREE.DirectionalLight( 0xffffff, 1.0 );
  directional.castShadow = true;
  scene.add( directional );
  

  objectDirectionalLight.push(directional);
  directional.GUIdirectional = _directionalLight();

  _createDirectionalLightGUI(directional.GUIdirectional);

  directionalLight = directionalLight + 1;
  

}


function _directionalLight() {
  var GUIdirectional = {
    LightColor: 0xffffff,
    intensidad:2,
    distancia:0,
    posX: 0,
    posY: 12,
    posZ: 3,
    
  };
  
  return GUIdirectional;
}


function _createDirectionalLightGUI(GUIdirectional) {
  const folder = gui.addFolder('DirectionalLight ' + GUIFolderDirectionalLight);
  
  //Color
  folder.addColor(GUIdirectional, 'LightColor');
  folder.add(GUIdirectional, 'intensidad');
  folder.add(GUIdirectional, 'distancia');
  // Posicion
  folder.add(GUIdirectional, 'posX');
  folder.add(GUIdirectional, 'posY');
  folder.add(GUIdirectional, 'posZ');


  GUIFolderDirectionalLight = GUIFolderDirectionalLight + 1;
}


function _updateDirectionalLights() {
  Object.keys(objectDirectionalLight).forEach((i) => {
    const LightSelected = objectDirectionalLight[i];
    
    LightSelected.color.setHex(LightSelected.GUIdirectional.LightColor);
    
    LightSelected.intensity = LightSelected.GUIdirectional.intensidad;
    LightSelected.distance = LightSelected.GUIdirectional.distancia;

    //Posición
    LightSelected.position.x = LightSelected.GUIdirectional.posX;
    LightSelected.position.y = LightSelected.GUIdirectional.posY;
    LightSelected.position.z = LightSelected.GUIdirectional.posZ;
    
  });
}

