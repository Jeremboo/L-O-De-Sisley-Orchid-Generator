import props from 'js/core/props';

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
    this.closedPetalPosition = props.closedPetalPosition[this.id]
    // - init petal to seed.
    this.mMesh.rotation.setFromVector3(this.closedPetalPosition);

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
      this._getXBetweenTwoNumbers(0, this.closedPetalPosition.x * red, props.tiredness),
      this._getXBetweenTwoNumbers(0, this.closedPetalPosition.y * red, props.tiredness),
      this._getXBetweenTwoNumbers(0, this.closedPetalPosition.z * red, props.tiredness)
    );
    this._animatePetal(posTargeted);
  }

  _onToSeed(){
    this._animatePetal(this.closedPetalPosition);
  }

  _animatePetal(vectorTargeted){
    // - PETAL ROTATION
    let forceRotation = vectorTargeted.clone()
    forceRotation.sub(this.mMesh.rotation.toVector3()).multiplyScalar(0.03);
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
    this.ctx.drawImage(props.imgs.petalBase, 0, 0, TEXTURE_WIDTH, TEXTURE_HEIGHT * this._getRandomFloat(0.2, 1.2));

    // - Add points
    this.ctx.globalAlpha = props.mood/10;
    // -- First Texture points
    // --- Random position
    this.ctx.drawImage(props.imgs.petalPoints, this._getRandomFloat(-100, 100), this._getRandomFloat(-100, 100), TEXTURE_WIDTH, TEXTURE_HEIGHT);
    // -- Second Texture points
    // --- Random Rotation
    let rotation =  this._getRandomFloat(0, 360*Math.PI);
    this.ctx.rotate(rotation);
    // --- Random position
    this.ctx.drawImage(props.imgs.petalPoints, this._getRandomFloat(-100, 100), this._getRandomFloat(-100, 100), TEXTURE_WIDTH, TEXTURE_HEIGHT);
    this.ctx.globalAlpha = 1;
    this.ctx.rotate(-rotation);

    // ##
    // UPDATE TEXTURE
    this.patternTexture.needsUpdate = true;
  }

  // ##########
  // FCTS UTILS
  // ##########
  _getRandomFloat(min, max) {
        return Math.random() * (max - min) + min;
	}

  _getXBetweenTwoNumbers(min, max, x){
    return min + ( x * ( (max - min)/10 ));
  }
}
module.exports = Petal;
