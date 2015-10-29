import props from 'js/core/props';

class Stem extends THREE.Object3D {
	constructor(){
		super();

		// ##
		// INIT
		// -- var
		this.heightSegment = 6;
		this.radiusSegment = 10;
		this.currentFloor = this.heightSegment;
		this._a = 0;
		// -- material
		this.material = new THREE.MeshLambertMaterial( { color: 0x1B010D, wireframe : true } );		
		// -- objet/mesh
		this.stemGeometry = new THREE.CylinderGeometry( 0.03, 0.08, 5, this.radiusSegmen, this.heightSegment );
		this.stemMesh = new THREE.Mesh( this.stemGeometry, this.material );		

		// ##
		// SAVE BINDING
		this._binds = {};
		this._binds.onUpdate = this._onUpdate.bind(this);
	}

	_onUpdate() {

		// ##
		// GROW UP
		let speed = 0.5;

		this.stemGeometry.verticesNeedUpdate = true;

		let circleVertices = this.radiusSegment -1;

		if(this.currentFloor >= 0) {
			for ( let j = 0 ; j < circleVertices ; j++) {
				let position = j + ( circleVertices * this.currentFloor);
				console.log(this.currentFloor)
				this.stemGeometry.vertices[position].x += speed;

			};
				this._a++;
				console.log(this._a)
				if(this._a == 10){
					console.log("kkk")
					this._a = 0;
					this.currentFloor--;
				}
		}

		
	}
}

module.exports = Stem;