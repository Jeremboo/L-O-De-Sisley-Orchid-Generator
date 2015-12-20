import props from 'js/core/props';

import petalVert from 'shaders/petal-vert';
import petalFrag from 'shaders/petal-frag';

const TEXTURE_WIDTH = 256;
const TEXTURE_HEIGHT = 256;


class Petal {
  constructor(mesh, backgroundColor) {

    // ##
		// INIT
    this.mMesh = mesh;

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

  }

  onUpdate(distRotationMatrix, windForceMatrix){
    // ##
		// UPDATE SHADER
		// - rotation force
		this.mMesh.material.uniforms.rotationForceMatrix.value = distRotationMatrix;
		// - wind force
		this.mMesh.material.uniforms.windForceMatrix.value = windForceMatrix;
  }

  updateColor(color){
    this.mMesh.material.uniforms.backgroundColor.value = color;
  }

  _drawTexture(){
    //Appliquer la base avec
    let textureBaseHeight = TEXTURE_HEIGHT  * this._getRandomFloat(0.2, 1.2) //TODO avoir un ratio en fonction de l'humeur ?;
    this.ctx.drawImage(props.imgs.petalBase, 0, 0, TEXTURE_WIDTH, textureBaseHeight);
      //une taille différente
      // une rotation différente
      // une opacitée différente

    //Appliquer les points avec
    this.ctx.drawImage(props.imgs.petalPoints, this._getRandomFloat(-100, 100), this._getRandomFloat(-100, 100), TEXTURE_WIDTH, TEXTURE_HEIGHT);
      //une taille différente
      // une rotation différente

    //Appliquer les points deuxième fois  avec
    // une rotation & taille différente
    this.ctx.rotate(this._getRandomFloat(0, 360*Math.PI))
    this.ctx.drawImage(props.imgs.petalPoints, this._getRandomFloat(-100, 100), this._getRandomFloat(-100, 100), TEXTURE_WIDTH, TEXTURE_HEIGHT);
    this.ctx.restore();

    // ##
    // UPDATE TEXTURE
    this.patternTexture.needsUpdate = true;
  }

  _getRandomFloat(min, max) {
        return Math.random() * (max - min) + min;
	}
}
module.exports = Petal;
