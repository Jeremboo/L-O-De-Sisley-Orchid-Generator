import OBJLoader from 'js/vendors/loaders/OBJLoader';

class LoadingManager {
  constructor() {}

  loadObj(fileName, callback) {
    const loader = new THREE.OBJLoader();
    loader.load(fileName, (obj) => {
      callback(obj);
    }, this._onProgress, this._onError);
  }

  loadObjWithMtl(OBJFileName, MTLFileName, callback) {
    const loader = new THREE.OBJMTLLoader();
    loader.load(OBJFileName, MTLFileName, (obj) => {
      callback(obj);
    }, this._onProgress, this._onError);
  }

  loadImage(url) {
    const img = new Image();
    img.src = url;
    return img;
  }

  _onProgress(xhr) {
    if (xhr.lengthComputable) {
      const percentComplete = xhr.loaded / xhr.total * 100;
      console.log(Math.round(percentComplete, 2) + '% downloaded');
    }
  }

  _onError(xhr) {
    console.error('LoadingERROR : ', xhr);
  }

  _onLoaded(item, loaded, total) {
    console.log('Loaded : ', item, loaded, total);
  }
}

module.exports = new LoadingManager();
