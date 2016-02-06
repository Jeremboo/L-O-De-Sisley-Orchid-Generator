import props from 'js/core/props';
import OrbitControls from 'js/vendors/OrbitControls';

class Webgl {
  constructor() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;

    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(50, 0, 1, 1000);
    this.camera.position.y = 0.2;
    this.camera.position.z = 5;

    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setClearColor(0xfff4e7);
    this.dom = this.renderer.domElement;

    this.usePostprocessing = false;
    // Create this.composer for have postprocessing
    this.initPostprocessing();

    this._binds = {};
    this._binds.onUpdate = this.onUpdate.bind(this);
    this._binds.onResize = this.onResize.bind(this);
  }

  initPostprocessing() {
    if (!this.usePostprocessing) return;
    this.vignettePass = new WAGNER.VignettePass();
    this.fxaaPass = new WAGNER.FXAAPass();
  }

  add(mesh) {
    this.scene.add(mesh);
  }

  onUpdate() {
    if (this.usePostprocessing) {
      // reset this.composer
    } else {
      this.renderer.autoClear = false;
      this.renderer.clear();
      this.renderer.render(this.scene, this.camera);
    }
  }

  onResize(width, height) {

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(width, height);
  }
}

module.exports = new Webgl();
