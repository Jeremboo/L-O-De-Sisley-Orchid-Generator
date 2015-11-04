import props from 'js/core/props';

class Stem extends THREE.Object3D {
	constructor(){
		super();

		// ##
		// INIT
		// - var
		this.heightSegment = 6;
		this.radiusSegment = 10;
		this.currentFloor = 1;
		this._a = 0;
		// - material
		this.material = new THREE.MeshLambertMaterial( { color: 0x1B010D, wireframe : true } );		
		// - geometry
		this.stemGeometry = new THREE.CylinderGeometry( 0.03, 0.08, 5, this.radiusSegmen, this.heightSegment, true );
		// -- init stem to 0
		this.stemGeometry.vertices.map((vertice) => {
			vertice.y = 0;
		})
		// - mesh
		this.stemMesh = new THREE.Mesh( this.stemGeometry, this.material );		

		// ##
		// SAVE BINDING
		this._binds = {};
		this._binds.onUpdate = this._onUpdate.bind(this);
	}

	_onUpdate() {

		// ##
		// GROW UP
		let speed = 0.05;

		this.stemGeometry.verticesNeedUpdate = true;

		let circleVertices = this.radiusSegment - 1;

		let count = 0;

		for (var i = 0; i < (this.stemGeometry.vertices.length - (circleVertices * this.currentFloor)); i++) {
			this.stemGeometry.vertices[i].y += speed;
			count++;
		};

		if(this.currentFloor >= 0) {
			/*for ( let j = 0 ; j < circleVertices ; j++) {
				let position = j + ( circleVertices * (this.currentFloor));
				this.stemGeometry.vertices[position].y += speed;

			};*/
			this._a++;
			if(this._a == 10 && this.currentFloor <= this.heightSegment){
				this._a = 0;
				this.currentFloor++;
			}
		}

		
	}
}

module.exports = Stem;