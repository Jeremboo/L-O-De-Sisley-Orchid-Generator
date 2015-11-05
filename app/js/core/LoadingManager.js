import OBJLoader from 'js/vendors/loaders/OBJLoader';


class LoadingManager {
	constructor() {
		this._binds = {};
		this._binds.load = this._load.bind(this);
		this._binds.loadWithMtl = this._loadWithMtl.bind(this);
	}

	_load(fileName, callback) {

		let loader = new THREE.OBJLoader( );
			loader.load( fileName, function ( obj ) {
			callback(obj)
		}, this._onProgress.bind(this), this._onError.bind(this) );
	}

	_loadWithMtl(OBJFileName, MTLFileName, callback) {

		let loader = new THREE.OBJMTLLoader();
		loader.load( OBJFileName, MTLFileName, function ( obj ) {
			callback(obj)
		}, this._onProgress.bind(this), this._onError.bind(this) );
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