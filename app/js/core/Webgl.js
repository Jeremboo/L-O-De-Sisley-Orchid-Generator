import props from 'js/core/props';
import OrbitControls from 'js/vendors/OrbitControls';

class Webgl {
  constructor() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;

    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(50, 0, 1, 1000);
    this.camera.position.z = props.zoom;

    // this.controls = new THREE.OrbitControls( this.camera );
    // this.controls.addEventListener( 'change', render );

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
  }

  init() {
    window.addEventListener('orientationchange', this.onResize, false);
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

  onResize() {
    const width = window.innerWidth;
    const height = window.innerHeight;

    if (props.onMobile) {
      this.camera.position.y = 1;
      this.renderer.setClearColor(0xfff4e7, 0);
    } else {
      this.camera.position.y = 0;
      this.renderer.setClearColor(0xfff4e7);
    }

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(width, height);
  }

  updateZoom(newZoom) {
    this.camera.position.z = newZoom;
  }
}

module.exports = new Webgl();
