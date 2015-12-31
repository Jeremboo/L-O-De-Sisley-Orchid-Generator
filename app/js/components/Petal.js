import props from 'js/core/props';
import utils from 'js/core/Utils';

import petalVert from 'shaders/petal-vert';
import petalFrag from 'shaders/petal-frag';

const TEXTURE_WIDTH = 256;
const TEXTURE_HEIGHT = 256;


class Petal {
  constructor(id, mesh, backgroundColor) {
    this.id = id;
    this.mMesh = mesh;
    // ##
    // INIT
    // - get position to petal closed
    this.closedPetalRotation = props.closedPetalPosition[this.id];
    // - init petal to seed.
    this.mMesh.rotation.setFromVector3(this.closedPetalRotation);

    // ##
    // GENERATE PATTERN TEXTURE
    // - create canvas
    this.canvas = document.createElement("canvas");
    // TEMPS
    this.canvas.className = "texture";
    document.getElementById("wrapper-canvas").appendChild(this.canvas);
    // TEMPS
    this.canvas.width = TEXTURE_WIDTH;
    this.canvas.height = TEXTURE_HEIGHT;
    this.ctx = this.canvas.getContext("2d");
    // -- use canvas to texture
    this.patternTexture = new THREE.Texture(this.canvas);
    // - create texture with imgs
    this._drawTexture();

    // ##
    // PETAL MATERIAL
    // - create material
    this.petalShaderMaterial = new THREE.ShaderMaterial( {
      uniforms: {
  			backgroundColor : {type : "v4", value : backgroundColor },
  			rotationForceMatrix : { type : 'm4', value : new THREE.Matrix4() },
  			windForceMatrix : { type : 'm4', value : new THREE.Matrix4() },
  			petalMap: { type: "t", value: props.texts.petalBackground },
  			springinessMap: { type: "t", value: props.texts.petalSpringiness },
  			petalPatternMap : { type: "t", value: this.patternTexture },
  		},
      vertexShader: petalVert,
      fragmentShader: petalFrag,
      side: THREE.DoubleSide
    });
    // - apply material to petalMesh
    this.mMesh.material = this.petalShaderMaterial;

    // ##
    // MEDIATOR LISTENER
    mediator.subscribe("onGrow", () => {
      this._onGrow();
    });
    mediator.subscribe("onToSeed", () => {
      this._onToSeed();
    });
  }

  // ##########
  // ONUPDATE
  // ##########
  onUpdate(distRotationMatrix, windForceMatrix){
    // ##
		// UPDATE SHADER
		// - rotation force
		this.mMesh.material.uniforms.rotationForceMatrix.value = distRotationMatrix;
		// - wind force
		this.mMesh.material.uniforms.windForceMatrix.value = windForceMatrix;
  }

  _onGrow(){
    let red = 0.6; // reduce the closed position
    let posTargeted = new THREE.Vector3(
      utils.getXBetweenTwoNumbers(0, this.closedPetalRotation.x * red, props.tiredness),
      utils.getXBetweenTwoNumbers(0, this.closedPetalRotation.y * red, props.tiredness),
      utils.getXBetweenTwoNumbers(0, this.closedPetalRotation.z * red, props.tiredness)
    );
    this._animatePetal(posTargeted);
  }

  _onToSeed(){
    this._animatePetal(this.closedPetalRotation);
  }

  // ##########
  // ANIMATION
  // ##########
  _animatePetal(vectorTargeted){
    // - PETAL ROTATION
    let dist = vectorTargeted.clone().sub(this.mMesh.rotation.toVector3());
    let forceRotation = dist.multiplyScalar(0.03);
    this.mMesh.rotation.setFromVector3(this.mMesh.rotation.toVector3().add(forceRotation));
  }

  // ##########
	// UPDATING PARAMETERS
	// ##########
  updateColor(color){
    this.mMesh.material.uniforms.backgroundColor.value = color;
  }
  updateTexture(){
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this._drawTexture();
  }
  // TODO fusionner l'enssemble pour la version Sisley


  // ##########
  // TEXTURE DRAWING
  // ##########
  _drawTexture(){
    // - Add base
    // -- update base height
    this.ctx.drawImage(props.imgs.petalBase, 0, 0, TEXTURE_WIDTH, TEXTURE_HEIGHT * utils.getRandomFloat(0.2, 1.2));

    // - Add points
    this.ctx.globalAlpha = props.mood/10;
    // -- First Texture points
    // --- Random position
    this.ctx.drawImage(props.imgs.petalPoints, utils.getRandomFloat(-100, 100), utils.getRandomFloat(-100, 100), TEXTURE_WIDTH, TEXTURE_HEIGHT);
    // -- Second Texture points
    // --- Random Rotation
    let rotation =  utils.getRandomFloat(0, 360*Math.PI);
    this.ctx.rotate(rotation);
    // --- Random position
    this.ctx.drawImage(props.imgs.petalPoints, utils.getRandomFloat(-100, 100), utils.getRandomFloat(-100, 100), TEXTURE_WIDTH, TEXTURE_HEIGHT);
    this.ctx.globalAlpha = 1;
    this.ctx.rotate(-rotation);

    // ##
    // UPDATE TEXTURE
    this.patternTexture.needsUpdate = true;
  }
}
module.exports = Petal;
