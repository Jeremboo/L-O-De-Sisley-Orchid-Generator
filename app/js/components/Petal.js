class Petal {
  constructor(mesh, material) {

    // ##
    // CONST
    this.TEXTURE_WIDTH = 512;
    this.TEXTURE_HEIGHT = 512;

    // ##
		// INIT
    this.mMesh = mesh; // TODO voir pour héritage
    this.mMaterial = material;

    // ##
    // GENERATE PATTERN TEXTURE
    // - create canvas
    this.canvas = document.createElement("canvas");
    //this.canvas = document.getElementById("flower-pattern");
    this.canvas.width = this.TEXTURE_WIDTH;
    this.canvas.height = this.TEXTURE_HEIGHT;
    this.ctx = this.canvas.getContext("2d");
    // - create textures
    // -- load images for texture
    //TODO avoir les images déjà chargées
    this.patternTextureBase = new Image();
    this.patternTextureBase.src = 'tex/petal_base.png';
    this.patternTexturePoint = new Image();
    this.patternTexturePoint.src = 'tex/petal_points.png';
    // -- add images to canvas
    this.patternTextureBase.onload = () => {
      this._drawTexture();
    };
    this.patternTexture = new THREE.Texture(this.canvas);
    // - update material
    this.mMaterial.uniforms.petalPatternMap.value = this.patternTexture;

    // ##
    // SET MATERIAL AT METAL MESH
    this.mMesh.material = material;
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
    let textureBaseHeight = this.TEXTURE_HEIGHT * this._getRandomFloat(0.2, 1);
    this.ctx.drawImage(this.patternTextureBase, 0, 0, this.TEXTURE_WIDTH, textureBaseHeight);
      //une taille différente
      // une rotation différente
      // une opacitée différente

    //Appliquer les points avec
    this.ctx.drawImage(this.patternTexturePoint, this._getRandomFloat(-100, 100), this._getRandomFloat(-100, 100), this.TEXTURE_WIDTH, this.TEXTURE_HEIGHT);
      //une taille différente
      // une rotation différente

    //Appliquer les points deuxième fois  avec
    // une rotation & taille différente
    this.ctx.rotate(this._getRandomFloat(0, 360*Math.PI))
    this.ctx.drawImage(this.patternTexturePoint, this._getRandomFloat(-100, 100), this._getRandomFloat(-100, 100), this.TEXTURE_WIDTH, this.TEXTURE_HEIGHT);
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
