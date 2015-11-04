import props from 'js/core/props';
import LoadingManager from 'js/core/LoadingManager';

class Flower extends THREE.Object3D {
	constructor(){
		super();

		// ##
		// INIT
		// -- material
		this.material = new THREE.MeshLambertMaterial( { color: 0xFB6AAB, shading: THREE.FlatShading } );		
		// -- objet/mesh
		this.flowerObject = false;		
		
		// ##
		// SAVE BINDING
		this._binds = {};
		this._binds.onUpdate = this._onUpdate.bind(this);
	}

	init(callback) {
		// ##
		// LOAD flower
		LoadingManager._binds.load('3d_model/flower.obj', (object) => {
			this.flowerObject = object;
			this.flowerObject.scale.set(10, 10, 10);

			this._traverseChilds( ( child ) => {
				child.geometry = new THREE.Geometry().fromBufferGeometry( child.geometry );
				child.material = this.material;
			});
			callback();
		});
	}

	_onUpdate() {
		/*let flowerSize = ( 8 - this.flowerObject.scale.x ) * 0.03;

		if( flowerSize < 0.9 ) {
			this.flowerObject.scale.x += flowerSize;
			this.flowerObject.scale.y += flowerSize;
			this.flowerObject.scale.z += flowerSize;

			this.flowerObject.rotation.z -= flowerSize;
			this.flowerObject.rotation.y += flowerSize;
		}*/
	}

	_traverseChilds(fct){
		this.flowerObject.traverse( (c) => {
			if ( c instanceof THREE.Mesh ) {
				fct(c);
			}
		});
	}
}

module.exports = Flower;