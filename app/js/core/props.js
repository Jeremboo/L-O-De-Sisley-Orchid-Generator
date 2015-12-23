import LoadingManager from 'js/core/LoadingManager';

var props = {
  // GUI
  // - global
  stress : 10,
  tiredness : 5,
  mood : 5,
  // - hack
  showCanvasPetalPattern : false,
  textureBackgroundColor : [200, 288, 258],
  // GLOBAL DATA
  objURL : '3d_model/flower.obj',
  rotation : new THREE.Vector3( 0, 0, 0 ),
  imgs : {
    petalBase : LoadingManager.loadImage('tex/petal_base.png'),
    petalPoints : LoadingManager.loadImage('tex/petal_points.png')
  },
  texts : {
    petalBackground : THREE.ImageUtils.loadTexture('tex/petal_background.jpg'),
    petalSpringiness : THREE.ImageUtils.loadTexture('tex/petal_springiness.jpg')
  },
  colors : [
    [247, 201, 84],
    [232, 163, 84],
    [251, 164, 139],
    [206, 127, 134],
    [160, 92, 128],
    [73, 90, 146],
    [95, 73, 148],
    [61, 121, 133],
    [169, 195, 153],
    [168, 183, 10],
    [149, 96, 107]
  ]
}

module.exports = props;
