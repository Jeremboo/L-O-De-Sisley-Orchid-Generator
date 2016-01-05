import LoadingManager from 'js/core/LoadingManager';

const props = {
  // BOOL
  onMobile: false,
  // GUI
  // - global
  stress: 0,
  tiredness: 0,
  mood: 0,
  // - hack
  zoom: 4,
  mouseCapture: true,
  showCanvasPetalPattern: false,
  textureBackgroundColor: [152, 146, 180],
  // GLOBAL DATA
  objURL: '3d_model/flower.obj',
  rotation: new THREE.Vector3(),
  imgs: {
    petalBase: LoadingManager.loadImage('tex/petal_base.png'),
    petalPoints: LoadingManager.loadImage('tex/petal_points.png'),
  },
  texts: {
    petalBackground: THREE.ImageUtils.loadTexture('tex/petal_background.png'),
    petalSpringiness: THREE.ImageUtils.loadTexture('tex/petal_springiness.png'),
    petalTransition: THREE.ImageUtils.loadTexture('tex/petal_transition.png'),
  },
  colors : [
    [255, 208, 129],  // 0 
    [249, 183, 112],  // 1 
    [251, 164, 139],  // 2 
    [255, 156, 148],  // 3 
    [214, 147, 153],  // 4 
    [194, 156, 178],  // 5 
    [175, 115, 147],  // 6 
    [135, 118, 178],  // 7 
    [105, 156, 166],  // 8 
    [149, 193, 188],  // 9 
    [185, 206, 172]  // 10 
  ],
  closedPetalPosition: [
    new THREE.Vector3(0.5, 0, 0),         // 0 - haut / milieu
    new THREE.Vector3(1, 0, -1),          // 1 - milieu / gauche
    new THREE.Vector3(-0.65, 0.6, -0.65), // 2 - bas / gauche
    new THREE.Vector3(-1, 0, 0),          // 3 - bas / milieu
    new THREE.Vector3(-0.65, -0.6, 0.65), // 4 - bas / droit
    new THREE.Vector3(1, 0, 1),           // 5 - milieu / droit
    new THREE.Vector3(1, 0, 0),           // 6 - haut / milieu
  ],
};

module.exports = props;
