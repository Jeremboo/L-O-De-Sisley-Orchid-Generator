import props from 'js/core/props';
import LoadingManager from 'js/core/LoadingManager';
import swiftEvent from "js/core/SwiftEventDispatcher";

import Pollen from 'js/components/Pollen';


class Flower extends THREE.Object3D {
	constructor(){
		super();

		// ##
		// INIT
		this.numberOfPollen = 3;
		// -- bool
		this.alreadyOnScene = false;
		this.isSeed = false;
		this.growing = false;
		// -- material
		this.material = new THREE.MeshLambertMaterial( { color: 0xFB6AAB, shading: THREE.FlatShading } );
		// -- objet/mesh
		this.flowerObject = false;

		// -- polen
		this.pollens = [];

		// ##
		// EVENTS
		swiftEvent.subscribe("flowerGrow", (flowerData) => {
			this._binds.growing(flowerData);
		});

		// ##
		// SAVE BINDING
		this._binds = {};
		this._binds.onUpdate = this._onUpdate.bind(this);
		this._binds.growing = this._growing.bind(this);
	}

	init(callback) {
		// ##
		// LOAD flower
		LoadingManager._binds.load('3d_model/flower.obj', (object) => {
			this.flowerObject = object.children[0];

			this._traverseChilds( ( child ) => {
				child.geometry = new THREE.Geometry().fromBufferGeometry( child.geometry );
				child.material = this.material;
			});
			this._createPollen(this.numberOfPollen);
			this.toSeed();
			callback();
		});
	}

	toSeed(){
		this.flowerObject.scale.set(0,0,0);
		this.flowerObject.rotation.x = -1;
		this.isSeed = true;
		//TODO mettre la graine
	}

	_growing(flowerData) {
		if(this.isSeed){
			this.growing = true;
			this._traversePollens((pollen) => {
				pollen.growing = true;
			});
			setTimeout(() => {
				this.growing = false;
				this.isSeed = false;
				console.log("Growing ended");
				this._traversePollens((pollen) => {
					pollen.growing = false;
					pollen.isSeed = false;
				});
			},2000);
		} else {
			console.error("Can not growing. Flower is not on seed.");
		}
	}

	grow() {
		let flowerSize = ( 10 - this.flowerObject.scale.x ) * 0.03;
		this.flowerObject.scale.x += flowerSize;
		this.flowerObject.scale.y += flowerSize;
		this.flowerObject.scale.z += flowerSize;

		let flowerRotation = -this.flowerObject.rotation.x * 0.03;
		this.flowerObject.rotation.x += flowerRotation;
	}

	_onUpdate() {
		if(this.growing){
			this.grow();
		} else {
			this.flowerObject.rotation.set(props.rotation.x, props.rotation.y, props.rotation.z)
		}

		// ##
		// UPDATE POLLENS
		this._traversePollens((pollen) => {
			pollen._binds.onUpdate();
		});
	}

	_createPollen(or) {
		or = or-1;
		// - pollen
		var p = new Pollen(or);
		p.toSeed();
		// - add to flower object
		this.flowerObject.add(p.pollenMesh);
		this.pollens.push(p);

		if(or > 0){
			this._createPollen(or);
		}
	}

	_traversePollens(fct) {
		let i = 0,
			l = this.pollens.length;
		for ( i ; i < l ; i++) {
			fct(this.pollens[i]);
		}
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
