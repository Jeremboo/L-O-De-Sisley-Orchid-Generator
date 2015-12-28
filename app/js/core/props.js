import LoadingManager from 'js/core/LoadingManager';

var props = {
  // GUI
  // - global
  wind : 10,
  vel : 5,
  mood : 5,
  // - hack
  showCanvasPetalPattern : true,
  textureBackgroundColor : [255, 255, 255],
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
