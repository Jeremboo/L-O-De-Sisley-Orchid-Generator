import props from 'js/core/props';
import LoadingManager from 'js/core/LoadingManager';
import swiftEvent from "js/core/SwiftEventDispatcher";

import Pollen from 'js/components/Pollen';

import springinessVert from 'shaders/springiness-vert';
import petalFrag from 'shaders/petal-frag';


class Flower extends THREE.Object3D {
	constructor(){
		super();

		// ##
		// INIT
		this.numberOfPollen = 3;
		this.oldRotation = new THREE.Vector3( 0, 0, 0 );
		// -- bool
		this.alreadyOnScene = false;
		this.isSeed = false;
		this.growing = false;
		// -- material
		this.petalTexture = THREE.ImageUtils.loadTexture('tex/texture_03.jpg');
		this.springinessTexture = THREE.ImageUtils.loadTexture('tex/texture_springiness.jpg');
		this.textureMaterial = new THREE.ShaderMaterial( {
		  uniforms: {
		    petalMap: { type: "t", value: this.petalTexture },
		    springinessMap: { type: "t", value: this.springinessTexture },
				rotationForceMatrix : { type : 'm4', value : new THREE.Matrix4() },
		  },
		  vertexShader: springinessVert,
		  fragmentShader: petalFrag,
			side: THREE.DoubleSide
		});

		// -- objet/mesh
		this.petalsObject = false;
		this.flowerObject = new THREE.Object3D();

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
		LoadingManager._binds.load(props.objURL, (object) => {
			this.petalsObject = object;
			this.flowerObject.add(this.petalsObject);

			this._traversePetalsChilds( ( child ) => {
				child.geometry = new THREE.Geometry().fromBufferGeometry( child.geometry );
				child.material = this.textureMaterial;
			});

			// CREATE POLLEN
			//this._createPollen(this.numberOfPollen);
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
		}

		// ##
		// ROTATION
		// - dist between new rotation targeted and current rotation
		let distRotation = props.rotation.clone().sub(this.flowerObject.rotation.toVector3());
		let matrixDistRotation = this._createRotationMatrix(distRotation);
	  // - force to apply at flowerObject
		let forceRotation = distRotation.multiplyScalar(props.velRotation);
		forceRotation.y *= 5; // minimise force in Y.

		// - update rotation with forceRotation
		this.flowerObject.rotation.setFromVector3(this.flowerObject.rotation.toVector3().add(forceRotation));

		// - update shader rotationForceMatrix in springiness-vert
		this._traversePetalsChilds( ( child ) => {
			 child.material.uniforms.rotationForceMatrix.value = matrixDistRotation;
		});

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

	_createRotationMatrix(vectRotation) {
		let m = new THREE.Matrix4();
		let m1 = new THREE.Matrix4();
		let m2 = new THREE.Matrix4();
		let m3 = new THREE.Matrix4();


		m1.makeRotationX( -vectRotation.x );
		m2.makeRotationY( -vectRotation.y );
		m3.makeRotationY( -vectRotation.z );

		m.multiplyMatrices( m1, m2 );
		m.multiply( m3 );

		return m;
	}

	_traversePollens(fct) {
		let i = 0,
			l = this.pollens.length;
		for ( i ; i < l ; i++) {
			fct(this.pollens[i]);
		}
	}

	_traversePetalsChilds(fct){
		this.petalsObject.traverse( (c) => {
			if ( c instanceof THREE.Mesh ) {
				fct(c);
			}
		});
	}
}

module.exports = Flower;
