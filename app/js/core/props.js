import LoadingManager from 'js/core/LoadingManager';

var props = {
  // BOOL
  onMobile : false,
  // GUI
  // - global
  stress : 0,
  tiredness : 0,
  mood : 0,
  // - hack
  mouseCapture : true,
  showCanvasPetalPattern : false,
  textureBackgroundColor : [152, 146, 180],
  // GLOBAL DATA
  objURL : '3d_model/flower.obj',
  rotation : new THREE.Vector3(),
  imgs : {
    petalBase : LoadingManager.loadImage('tex/petal_base.png'),
    petalPoints : LoadingManager.loadImage('tex/petal_points.png')
  },
  texts : {
    petalBackground : THREE.ImageUtils.loadTexture('tex/petal_background.png'),
    petalSpringiness : THREE.ImageUtils.loadTexture('tex/petal_springiness.png')
  },
  colors : [
    [251, 218, 131],  // 0
    [252, 206, 154],  // 1
    [243, 195, 139],  // 2
    [253, 194, 177],  // 3
    [222, 166, 172],  // 4
    [194, 156, 178],  // 5
    [190, 138, 166],  // 6
    [135, 118, 178],  // 7
    [105, 156, 166],  // 8
    [202, 218, 192],  // 9
    [204, 215, 151]   // 10
  ],
  closedPetalPosition : [
    new THREE.Vector3(0.5, 0, 0),         // 0 - haut / milieu
    new THREE.Vector3(1, 0, -1),          // 1 - milieu / gauche
    new THREE.Vector3(-0.65, 0.6, -0.65), // 2 - bas / gauche
    new THREE.Vector3(-1, 0, 0),          // 3 - bas / milieu
    new THREE.Vector3(-0.65, -0.6, 0.65), // 4 - bas / droit
    new THREE.Vector3(1, 0, 1),           // 5 - milieu / droit
    new THREE.Vector3(1, 0, 0),           // 6 - haut / milieu
  ]
}

module.exports = props;
