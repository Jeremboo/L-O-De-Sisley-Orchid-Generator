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
  }
}

module.exports = props;
