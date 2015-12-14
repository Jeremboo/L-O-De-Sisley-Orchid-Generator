import props from 'js/core/props';
import LoadingManager from 'js/core/LoadingManager';
import swiftEvent from "js/core/SwiftEventDispatcher";

import Pistil from 'js/components/Pistil';

import petalVert from 'shaders/petal-vert';
import petalFrag from 'shaders/petal-frag';

const GROWING = 1;
const TOSEED = 2;


class Flower extends THREE.Object3D {
	constructor(){
		super();

		// ##
		// INIT
		this.numberOfPistil = 3;
		this.oldRotation = new THREE.Vector3( 0, 0, 0 );
		this.petalBackgroundColor = this._getVec4Color(props.textureBackgroundColor);
		// -- bool
		this.alreadyOnScene = false;
		this.animation = false;
		// -- textures
		this.petalTexture = THREE.ImageUtils.loadTexture('tex/petal_background.jpg');
		this.petalRacineTexture = THREE.ImageUtils.loadTexture('tex/petal_base.png');
		this.springinessTexture = THREE.ImageUtils.loadTexture('tex/petal_springiness.jpg');
		// -- material
		this.flowerShaderMaterial = new THREE.ShaderMaterial( {
		  uniforms: {
		    petalMap: { type: "t", value: this.petalTexture },
				petalRacineMap : { type: "t", value: this.petalRacineTexture },
		    springinessMap: { type: "t", value: this.springinessTexture },
				backgroundColor : {type : "v4", value : this.petalBackgroundColor },
				rotationForceMatrix : { type : 'm4', value : new THREE.Matrix4() },
				windForceMatrix : { type : 'm4', value : new THREE.Matrix4() },
		  },
		  vertexShader: petalVert,
		  fragmentShader: petalFrag,
			side: THREE.DoubleSide
		});

		// -- objet/mesh
		this.petalsObject = false;
		this.flowerObject = new THREE.Object3D();

		// -- polen
		this.pistil = [];

		// ##
		// EVENTS
		swiftEvent.subscribe("flowerGrow", (flowerData) => {
			if (this.alreadyOnScene) {
				this.animation = GROWING;
				props.stress = flowerData.stress;
			  props.tiredness = flowerData.tiredness;
			  props.mood = flowerData.mood
			}
		});
		swiftEvent.subscribe("flowerToSeed", () => {
			if (this.alreadyOnScene) {
				this.animation = TOSEED;
			}
		});

		// ##
		// SAVE BINDING
		this._binds = {};
		this._binds.onUpdate = this._onUpdate.bind(this);
	}

	init(callback) {
		// ##
		// LOAD flower
		LoadingManager._binds.load(props.objURL, (object) => {
			this.petalsObject = object;
			this.flowerObject.add(this.petalsObject);

			this.flowerObject.scale.set(0.0001, 0.0001, 0.0001) ;
			this.flowerObject.rotation.x = -1;

			this._traversePetalsChilds( ( child ) => {
				child.material = this.flowerShaderMaterial;
			});

			// CREATE PISTIL
			this._createPistil(this.numberOfPistil);
			callback(this.flowerObject);
		});
	}

	_onUpdate() {
		// ##
		// Animation
		switch(this.animation){
			case GROWING :
				this._onGrow();
				break;
			case TOSEED :
				this._onToSeed();
				break;
			default :
				break;
		}

		// ##
		// ROTATION
		// - dist between new rotation targeted and current rotation
		let distRotation = props.rotation.clone().sub(this.flowerObject.rotation.toVector3());
		let distRotationMatrix = this._getRotationMatrix(distRotation);
	  // - force to apply at flowerObject
		let rotationForce = distRotation.multiplyScalar(props.velSpringiness);
		// rotationForce.y *= 3; // minimise force in Y.

		// - update rotation with rotationForce
		this.flowerObject.rotation.setFromVector3(this.flowerObject.rotation.toVector3().add(rotationForce));

		// ##
		// WIND
		// 0 - haut / milieu  ( 1, 0, 0 )
		// 1 - milieu / gauche ( 0, -1, 0 )
		// 2 - bas / gauche ( -1, -1, 0 )
		// 3 - bas / milieu ( -1, 0, 0 )
		// 4 - bas / droit ( -1, 1, 0 )
		// 5 - milieu / droit ( 0, -1, 0 )
		// 6 - haut / milieu ( 1, 0, 0 )

		let time = Date.now();
		// let windFreq = Math.sin(time / ( 6000 / (props.stress)) ) // * Math.sin(time / 200);
		let windAmpl = 20 - props.stress;
		let windStrength = (Math.cos(time / ( 2000 / props.stress )) / windAmpl ) // * windFreq;
		let windForce = new THREE.Vector3( Math.sin( time / 2000 ), Math.sin( time / 3000 ), 0 ).multiplyScalar(windStrength);
		let windForceMatrix = this._getRotationMatrix(windForce);

		// ##
		// UPDATE
		// - update shader
		this._traversePetalsChilds( ( child ) => {
			// -- rotation force
			child.material.uniforms.rotationForceMatrix.value = distRotationMatrix;
			// -- wind force
			child.material.uniforms.windForceMatrix.value = windForceMatrix;
		});
		// - update pistil
		this._traversePistil((pistil) => {
			pistil._binds.onUpdate(distRotationMatrix, windForce, windForceMatrix);
		});
	}

	// ## TEMP
	changeTextureBackgroundColor(){
		this.petalBackgroundColor = this._getVec4Color(props.textureBackgroundColor);
		this._traversePetalsChilds( ( child ) => {
			child.material.uniforms.backgroundColor.value = this.petalBackgroundColor;
		});
		this._traversePistil((pistil) => {
			pistil.changeColor(this.petalBackgroundColor);
		});
	}
	// ## TEMP

	_onToSeed(){
		this._animateFlower(0.001, -1);
		this._traversePistil((pistil) => {
			pistil.animatePistil(0);
		});
	}

	_onGrow() {
		this._animateFlower(10, 0);
		this._traversePistil((pistil) => {
			pistil.animatePistil(0.035);
		});
	}

	_animateFlower(size, rotation) {
		let vel = 0.03;
		let force = ( size - this.flowerObject.scale.x ) * vel;
		this.flowerObject.scale.addScalar(force);

		let forceRotation = ( rotation - this.flowerObject.rotation.x ) * vel;
		this.flowerObject.rotation.x += forceRotation;
		if(Math.abs(force) < 0.001){
			this.animation = false;
		}
	}

	_createPistil(or) {
		or = or-1;
		// - pistil
		let p = new Pistil(or, this.petalBackgroundColor);
		// - add to flower object
		this.flowerObject.add(p.pistilMesh);
		this.pistil.push(p);

		if(or > 0){
			this._createPistil(or);
		}
	}

	_traversePistil(fct) {
		let i = 0,
			l = this.pistil.length;
		for ( i ; i < l ; i++) {
			fct(this.pistil[i]);
		}
	}

	_traversePetalsChilds(fct){
		this.petalsObject.traverse( (c) => {
			if ( c instanceof THREE.Mesh ) {
				fct(c);
			}
		});
	}

	_getRotationMatrix(vectRotation) {
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

	_getVec4Color(color){
    let r = color[0]/256;
    let g = color[1]/256;
    let b = color[2]/256;
		let v4 = new THREE.Vector4(r,g,b,1);
    return v4;
	}

}

module.exports = Flower;
