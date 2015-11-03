import props from 'js/core/props';

class Stem extends THREE.Object3D {
	constructor(){
		super();

		// ##
		// INIT
		// - var
		this.segments = 20;
		this.radius = 2;
		this.radiusSegment = 8;
		this.path = false; //TODO
		// - material
		this.material = new THREE.MeshLambertMaterial( { color: 0x1B010D, wireframe : true } );
		// - pollenHead geometry/mesh
		this.pollenHeadGeometry = new THREE.SphereGeometry( 1, 12, 12 );
		this.pollenHeadMesh = new THREE.Mesh( this.pollenHeadGeometry, this.material );		
		// - pollenStem geometry/mesh
		//this.pollenStemGeometry = new THREE.TubeGeometry( this.path, this.segments, this.radius, this.radiusSegment, true );
		//this.pollenStemMesh = new THREE.Mesh( this.pollenStemGeometry, this.material );		
		// -- pollen
		this.pollenMesh = new THREE.Object3D();
		this.pollenMesh.add(this.pollenHeadMesh);
		//this.pollenMesh.add(this.pollenStemMesh);

		// ##
		// SAVE BINDING
		this._binds = {};
		this._binds.onUpdate = this._onUpdate.bind(this);
	}

	_onUpdate() {

			
	}
}

module.exports = Stem;