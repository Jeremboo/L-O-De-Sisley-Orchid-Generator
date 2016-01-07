import LoadingManager from 'js/core/LoadingManager';

const props = {
  // PARAMS
  stress: 0,
  tiredness: 0,
  mood: 0,
  // GLOBAL DATA
  objURL: '3d_model/flower.obj',
  openned: false,
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
  petalColor: [152, 146, 180],
  patternColor: [126, 98, 233],
  colors: [
    [249, 183, 112],  // 0
    [246, 150, 122],  // 1
    [255, 156, 148],  // 2
    [255, 208, 129],  // 3
    [190, 214, 170],  // 4
    [135, 118, 178],  // 5
    [105, 156, 166],  // 6
    [149, 193, 188],  // 7
    [214, 147, 153],  // 8
    [175, 115, 147],  // 9
    [194, 156, 178],  // 10
  ],
  patternColors: [
    [247, 98, 138],   // 0
    [255, 211, 143],  // 1
    [239, 247, 202],  // 2
    [158, 213, 211],  // 3
    [255, 229, 159],  // 4
    [255, 220, 143],  // 5
    [255, 225, 159],  // 6
    [251, 218, 159],  // 7
    [228, 241, 196],  // 8
    [250, 251, 198],  // 9
    [204, 246, 228],  // 10
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
