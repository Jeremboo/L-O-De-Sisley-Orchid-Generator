import props from 'js/core/props';
import OrbitControls from 'js/vendors/OrbitControls';

class Webgl {
	constructor( ){
		this.width = window.innerWidth;
		this.height = window.innerHeight;

		this.scene = new THREE.Scene();

		this.camera = new THREE.PerspectiveCamera(50, 0, 1, 1000);
		this.camera.position.z = 8;
		this.controls = new THREE.OrbitControls( this.camera );
  		//this.controls.addEventListener( 'change', render );

		this.renderer = new THREE.WebGLRenderer({
			antialias : true
		});
		this.renderer.setPixelRatio( window.devicePixelRatio );
		this.renderer.setClearColor(0xCBE0E7);
		this.dom = this.renderer.domElement;

		this.usePostprocessing = false;
		// Create this.composer for have postprocessing
		this.initPostprocessing();

		this._binds = {};
		this._binds.onUpdate = this._onUpdate.bind( this );
		this._binds.onResize = this._onResize.bind( this );
	}

	init() {
		window.addEventListener( "orientationchange", this._binds.onResize, false );
		this._onResize();
	}

	initPostprocessing() {
		if (!this.usePostprocessing) return;
		this.vignettePass = new WAGNER.VignettePass();
		this.fxaaPass = new WAGNER.FXAAPass();
	}

	add(mesh) {
		this.scene.add(mesh);
	}

	_onUpdate() {
		if (this.usePostprocessing) {
			//reset this.composer
		} else {
			this.renderer.autoClear = false;
			this.renderer.clear();
			this.renderer.render(this.scene, this.camera);
		}
	}

	_onResize() {
		let width = window.innerWidth;
		let height = window.innerHeight;

		this.camera.aspect = width / height;
		this.camera.updateProjectionMatrix();

		this.renderer.setSize(width, height);
	}
}

function render() {
  renderer.render( scene, camera );
}

module.exports = new Webgl();
