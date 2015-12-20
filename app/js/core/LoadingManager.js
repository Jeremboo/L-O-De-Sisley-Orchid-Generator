import OBJLoader from 'js/vendors/loaders/OBJLoader';

class LoadingManager {
	constructor(){}

	loadObj(fileName, callback) {

		let loader = new THREE.OBJLoader( );
			loader.load( fileName, function ( obj ) {
			callback(obj)
		}, this._onProgress, this._onError );
	}

	loadObjWithMtl(OBJFileName, MTLFileName, callback) {

		let loader = new THREE.OBJMTLLoader();
		loader.load( OBJFileName, MTLFileName, function ( obj ) {
			callback(obj)
		}, this._onProgress, this._onError );
	}

	loadImage(url) {
		let img = new Image();
		img.src = url;
		return img
	}

	_onProgress( xhr ) {
		if ( xhr.lengthComputable ) {
			var percentComplete = xhr.loaded / xhr.total * 100;
				console.log( Math.round(percentComplete, 2) + '% downloaded' );
		}
	}

	_onError( xhr ) {
		console.error("LoadingERROR : ", xhr );
	}

	_onLoaded( item, loaded, total ) {
		console.log("Loaded : ", item, loaded, total );
	}
}

module.exports = new LoadingManager();
