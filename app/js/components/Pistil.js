import props from 'js/core/props';
import utils from 'js/core/Utils';

import pistilVert from 'shaders/pistil-vert';
import pistilFrag from 'shaders/pistil-frag';


class Pistil extends THREE.Object3D {
  constructor(orientation) {
    super();

    // ##
    // INIT
    this.POZ = new THREE.Vector3(0, 0.03, -0.02);
    this.ROTATION = new THREE.Euler(-utils.getRandomFloat(0.5, 1), 0.5 - (orientation / 2), 0);
    // - var
    this.segments = 32;
    this.radiusSegment = 32;
    this.size = 0.1;
    this.color = utils.getVec4Color(props.petalColor);
    this.scalePistilOpened = 0.035;

    this.length = utils.getRandomFloat(5, 12);
    this.curve = this._createCustomCurve();
    this.pistilHeadPosition = this.curve.getPoints()[this.curve.getPoints().length - 1];

    // - STEM
    // -- geometry
    this.pistilStemGeometry = new THREE.TubeGeometry(this.curve, this.segments, this.size, this.radiusSegment / 2);
    // -- material
    this.stemShaderMaterial = new THREE.ShaderMaterial({
      uniforms: {
        rotationForceMatrix: { type: 'm4', value: new THREE.Matrix4() },
        windForceMatrix: { type: 'm4', value: new THREE.Matrix4() },
        color: { type: 'v4', value: this.color },
        newColor: { type: 'v4', value: this.color },
        transitionValue: { type: 'f', value: 0 },
      },
      vertexShader: pistilVert,
      fragmentShader: pistilFrag,
    });
    // -- mesh
    this.pistilStemMesh = new THREE.Mesh(this.pistilStemGeometry, this.stemShaderMaterial);

    // - HEAD
    // -- pistilHead geometry/mesh
    this.pistilHeadGeometry = new THREE.SphereGeometry(this.size * 4, this.radiusSegment, this.segment);
    // -- material
    this.headMaterial = new THREE.MeshBasicMaterial({ color: 0x28365b });
    // -- mesh
    this.pistilHeadMesh = new THREE.Mesh(this.pistilHeadGeometry, this.headMaterial);
    this.pistilHeadObject = new THREE.Object3D();
    this.pistilHeadObject.add(this.pistilHeadMesh);
    // -- position
    this.pistilHeadMesh.position.copy(this.pistilHeadPosition);

    // PISTIL (STEM + HEAD )
    this.add(this.pistilStemMesh);
    this.add(this.pistilHeadObject);

    // ##
    // INIT POSITION & SIZE
    this.scale.set(0.0001, 0.0001, 0.0001);
    this.position.copy(this.POZ);
    this.rotation.copy(this.ROTATION);

    // ##
    // MEDIATOR LISTENER
    mediator.subscribe('onGrow', this._onGrow.bind(this));
    mediator.subscribe('onToSeed', this._onToSeed.bind(this));
    mediator.subscribe('onTransitionUpdating', (timer) => {
      this._onTransitionUpdating(timer);
    });
  }

  // ##########
  // ONUPDATE
  // ##########
  onUpdate(matrixDistRotation, windForce, windForceMatrix) {

    // update shader for Stem
    this.pistilStemMesh.material.uniforms.rotationForceMatrix.value = matrixDistRotation;
    this.pistilStemMesh.material.uniforms.windForceMatrix.value = windForceMatrix;

    // update rotation pistilHead
    this.pistilHeadObject.rotation.setFromVector3(windForce);
  }

  _onGrow() {
    this.animatePistil(this.scalePistilOpened);
  }
  _onToSeed() {
    this.animatePistil(0);
  }

  _onTransitionUpdating(transitionTimer) {
    this.pistilStemMesh.material.uniforms.transitionValue.value = transitionTimer;
  }

  // ##########
  // ANIMATION
  // ##########
  animatePistil(size) {
    utils.easing(size, this.scale.x, {
      update: (f) => {this.scale.addScalar(f);},
    });
  }

  // ##########
  // UPDATING PARAMETERS
  // ##########
  updateMaterial() {
    this.color = utils.getVec4Color(props.patternColor);
    this.pistilStemMesh.material.uniforms.newColor.value = this.color;
  }
  updateMaterialEnd() {
    this.pistilStemMesh.material.uniforms.color.value = this.color;
  }

  // ##########
  // CUSTOM CURVE BUILDER
  // ##########
  _createCustomCurve() {
    const CustomSinCurve = THREE.Curve.create(
      // custom curve constructor
      (length, curve) => {
        this.curve = (curve === undefined) ? 1 : curve;
        this.length = (length === undefined) ? 1 : length;
      },
      // getPoint: t is between 0-1
      (t) => {
        const tx = 0;
        const ty = Math.sin(t * this.curve);
        const tz = t * this.length;

        return new THREE.Vector3(tx, ty, tz);
      }
    );
    return new CustomSinCurve(this.length, this.curve);
  }
}

module.exports = Pistil;
