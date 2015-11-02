import props from 'js/core/props';
import LoadingManager from 'js/core/LoadingManager';

class Petal extends THREE.Object3D {
	constructor(){
		super();

		// ##
		// INIT
		// -- material
		this.material = new THREE.MeshLambertMaterial( { color: 0xFB6AAB, shading: THREE.FlatShading } );		
		// -- objet/mesh
		this.petalObject = false;		

		
		// ##
		// SAVE BINDING
		this._binds = {};
		this._binds.onUpdate = this._onUpdate.bind(this);
	}

	init(callback) {
		// ##
		// LOAD PETAL
		LoadingManager._binds.load('3d_model/petale_dev.obj', '3d_model/petale_dev.mtl', (object) => {
			this.petalObject = object;
			this.petalObject.scale.set(0, 0, 0);
			this.petalObject.rotation.z = 1;
			this.petalObject.rotation.y = -1;

			/*this._traverseChilds( ( child ) => {
				child.geometry = new THREE.Geometry().fromBufferGeometry( child.geometry );
				child.material = this.material;
			});*/
			callback();
		});
	}

	_onUpdate() {
		let petalSize = ( 1 - this.petalObject.scale.x ) * 0.03;

		if( petalSize < 0.9 ) {
			this.petalObject.scale.x += petalSize;
			this.petalObject.scale.y += petalSize;
			this.petalObject.scale.z += petalSize;

			this.petalObject.rotation.z -= petalSize;
			this.petalObject.rotation.y += petalSize;
		}
	}

	_traverseChilds(fct){
		this.petalObject.traverse( (c) => {
			if ( c instanceof THREE.Mesh ) {
				fct(c);
			}
		});
	}
}

module.exports = Petal;