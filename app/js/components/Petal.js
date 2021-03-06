import props from 'js/core/props';
import utils from 'js/core/Utils';
import eventDispatcher from 'js/core/EventDispatcher';

import PetalPatern from 'js/components/PetalPattern';

import petalVert from 'shaders/petal-vert';
import petalFrag from 'shaders/petal-frag';

const TEXTURE_WIDTH = 256;
const TEXTURE_HEIGHT = 256;


class Petal {
  constructor(id, mesh) {
    this.id = id;
    this.mMesh = mesh;
    // ##
    // INIT
    // - color
    this.color = utils.getVec4Color(props.petalColor);
    // - generate Texture
    this.pattern = new PetalPatern();
    this.newPattern = new PetalPatern();
    // - get position to petal closed
    this.closedPetalRotation = props.closedPetalPosition[this.id];
    // - init petal to seed.
    this.mMesh.rotation.setFromVector3(this.closedPetalRotation);
    // - other values

    // ##
    // PETAL MATERIAL
    // - create material
    this.petalShaderMaterial = new THREE.ShaderMaterial({
      uniforms: {
        backgroundColor: { type: 'v4', value: this.color },
        newBackgroundColor: { type: 'v4', value: this.color },
        rotationForceMatrix: { type: 'm4', value: new THREE.Matrix4() },
        windForceMatrix: { type: 'm4', value: new THREE.Matrix4() },
        transitionValue: { type: 'f', value: 0 },
        transitionMap: { type: 't', value: props.texts.petalTransition },
        petalMap: { type: 't', value: props.texts.petalBackground },
        springinessMap: { type: 't', value: props.texts.petalSpringiness },
        petalPatternMap: { type: 't', value: this.pattern.texture },
        newPetalPatternMap: { type: 't', value: this.newPattern.texture },
      },
      vertexShader: petalVert,
      fragmentShader: petalFrag,
      side: THREE.DoubleSide,
    });
    // - apply material to petalMesh
    this.mMesh.material = this.petalShaderMaterial;

    // ##
    // EVENT LISTENER
    eventDispatcher.subscribe('onGrow', this._onGrow.bind(this));
    eventDispatcher.subscribe('onToSeed', () => {
      this._onToSeed();
    });
    eventDispatcher.subscribe('onTransitionUpdating', (timer) => {
      this._onTransitionUpdating(timer);
    });
  }

  // ##########
  // ONUPDATE
  // ##########
  onUpdate(distRotationMatrix, windForceMatrix) {
    if (this.transitionTimer >= 0) {
      this._onTransitionUpdating();
    }

    // ##
    // UPDATE SHADER
    // - rotation force
    this.mMesh.material.uniforms.rotationForceMatrix.value = distRotationMatrix;
    // - wind force
    this.mMesh.material.uniforms.windForceMatrix.value = windForceMatrix;
  }

  _onGrow() {
    const red = 0.6; // reduce the closed position
    const posTargeted = new THREE.Vector3(
      utils.getXBetweenTwoNumbers(0, this.closedPetalRotation.x * red, props.tiredness),
      utils.getXBetweenTwoNumbers(0, this.closedPetalRotation.y * red, props.tiredness),
      utils.getXBetweenTwoNumbers(0, this.closedPetalRotation.z * red, props.tiredness)
    );
    this._animatePetal(posTargeted);

    // this.mMesh.material.uniforms.transitionValue.value = this.transitionTimer;

  }

  _onToSeed() {
    this._animatePetal(this.closedPetalRotation);
  }

  _onTransitionUpdating(transitionTimer) {
    this.mMesh.material.uniforms.transitionValue.value = transitionTimer;
  }

  // ##########
  // ANIMATION
  // ##########
  _animatePetal(vectorTargeted) {
    // - PETAL ROTATION
    const dist = vectorTargeted.clone().sub(this.mMesh.rotation.toVector3());
    const forceRotation = dist.multiplyScalar(0.03);
    this.mMesh.rotation.setFromVector3(this.mMesh.rotation.toVector3().add(forceRotation));
  }

  // ##########
  // UPDATING PARAMETERS
  // ##########
  updateMaterial() {
    // set new values
    this.color = utils.getVec4Color(props.petalColor);
    // create new pattern to transition.
    this.newPattern.updateTexture();
    // update material
    this.mMesh.material.uniforms.newBackgroundColor.value = this.color;
    this.mMesh.material.uniforms.newPetalPatternMap.value = this.newPattern.texture;
  }
  updateMaterialEnd() {
    this.mMesh.material.uniforms.backgroundColor.value = this.color;
    this.pattern.clone(this.newPattern);
  }
}
module.exports = Petal;
