class LoadingManager {
	constructor() {
		this.manager = new THREE.LoadingManager();
		this.manager.onProgress = this._onLoaded.bind(this);

		this.loader = new THREE.OBJLoader( this.manager );

		this._binds = {};
		this._binds.load = this._load.bind(this);
	}

	_load(fileName, callback) {

		this.loader.load( fileName, function ( obj ) {
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