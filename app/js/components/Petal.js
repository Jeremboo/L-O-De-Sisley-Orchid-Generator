class Petal {
  constructor(mesh, material) {
    // ##
		// VALUES
    this.mMesh = mesh; // TODO voir pour héritage
    this.mMaterial = material;

    // ##
    // GENERATE PATTERNTEXTURE
    // - load textures
    this.patternTextureBase = THREE.ImageUtils.loadTexture('tex/petal_base.png');
    this.patternTexturePoints = THREE.ImageUtils.loadTexture('tex/petal_points.png');
    // TODO faire le canvas qui genere la texture

    // ## SET MATERIAL AT METAL MESH
    this.mMaterial.uniforms.petalPatternMap.value = this.patternTextureBase;
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
}
module.exports = Petal;
