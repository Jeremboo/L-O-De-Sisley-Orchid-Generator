import props from 'js/core/props';
import LoadingManager from 'js/core/LoadingManager';
import Pollen from 'js/components/Pollen';


class Flower extends THREE.Object3D {
	constructor(){
		super();

		// ##
		// INIT
		this.numberOfPollen = 3;
		// -- material
		this.material = new THREE.MeshLambertMaterial( { color: 0xFB6AAB, shading: THREE.FlatShading } );		
		// -- objet/mesh
		this.flowerObject = false;

		// -- polen
		this.pollens = [];		
		
		// ##
		// SAVE BINDING
		this._binds = {};
		this._binds.onUpdate = this._onUpdate.bind(this);
	}

	init(callback) {
		// ##
		// LOAD flower
		LoadingManager._binds.load('3d_model/flower.obj', (object) => {
			this.flowerObject = object.children[0];
			this.flowerObject.scale.set(0,0,0);
			this.flowerObject.rotation.x = -1;


			this._traverseChilds( ( child ) => {
				child.geometry = new THREE.Geometry().fromBufferGeometry( child.geometry );
				child.material = this.material;
			});
			this._createPollen(this.numberOfPollen);
			callback();
		});
	}

	_onUpdate() {
		let flowerSize = ( 10 - this.flowerObject.scale.x ) * 0.03;
		if( flowerSize < 0.9 ) {
			this.flowerObject.scale.x += flowerSize;
			this.flowerObject.scale.y += flowerSize;
			this.flowerObject.scale.z += flowerSize;
		}

		let flowerRotation = -this.flowerObject.rotation.x * 0.03;
		if( flowerRotation < 0.9 ) {
			this.flowerObject.rotation.x += flowerRotation;

		}

		// ##
		// UPDATE POLLENS
		for (var i = 0; i < this.pollens.length; i++) {
			this.pollens[i]._binds.onUpdate();
		};
	}

	_createPollen(or) {
		or = or-1;
		// - pollen
		var pollen = new Pollen();
		pollen.orientation(or);
		this.flowerObject.add(pollen.pollenMesh);
		this.pollens.push(pollen);
		if(or > 0){
			setTimeout(() => {
				this._createPollen(or);
			}, 200);
		}


		// webgl.add(pollen.pollenMesh);
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