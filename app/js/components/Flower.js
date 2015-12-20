import props from 'js/core/props';
import LoadingManager from 'js/core/LoadingManager';
import swiftEvent from "js/core/SwiftEventDispatcher";

import Pistil from 'js/components/Pistil';
import Petal from 'js/components/Petal';

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

		// -- children
		this.petals = [];
		this.pistils = [];

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
		LoadingManager.loadObj(props.objURL, (object) => {
			let petals = object;
			this.add(petals);

			this.scale.set(0.0001, 0.0001, 0.0001) ;
			this.rotation.x = -1;

			petals.traverse(child => {
				if ( child instanceof THREE.Mesh ) {
					let petal = new Petal(child, this.petalBackgroundColor);
					this.petals.push(petal);
				}
			});

			// CREATE PISTIL
			this._createPistil(this.numberOfPistil);
			callback();
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
		let distRotation = props.rotation.clone().sub(this.rotation.toVector3());
		let distRotationMatrix = this._getRotationMatrix(distRotation);
	  // - force to apply at flowerObject
		let rotationForce = distRotation.multiplyScalar(props.velSpringiness);
		// rotationForce.y *= 3; // minimise force in Y.

		// - update rotation with rotationForce
		this.rotation.setFromVector3(this.rotation.toVector3().add(rotationForce));

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
		// - update petals
		this._traverse(this.petals, petal => {
			petal.onUpdate(distRotationMatrix, windForceMatrix);
		});
		// - update pistils
		this._traverse(this.pistils,  pistil => {
			pistil._binds.onUpdate(distRotationMatrix, windForce, windForceMatrix);
		});
	}

	// ## TEMP
	changeTextureBackgroundColor(){
		this.petalBackgroundColor = this._getVec4Color(props.textureBackgroundColor);
		this._traverse(this.petals, petal  => {
			petal.updateColor(this.petalBackgroundColor);
		});
		this._traverse(this.pistils, pistil => {
			pistil.changeColor(this.petalBackgroundColor);
		});
	}
	// ## TEMP

	_onToSeed(){
		this._animateFlower(0.001, -1);
		this._traverse(this.pistils, pistil => {
			pistil.animatePistil(0);
		});
	}

	_onGrow() {
		this._animateFlower(10, 0);
		this._traverse(this.pistils, pistil => {
			pistil.animatePistil(0.035);
		});
	}

	_animateFlower(size, rotation) {
		let vel = 0.03;
		let force = ( size - this.scale.x ) * vel;
		this.scale.addScalar(force);

		let forceRotation = ( rotation - this.rotation.x ) * vel;
		this.rotation.x += forceRotation;
		if(Math.abs(force) < 0.001){
			this.animation = false;
		}
	}

	_createPistil(or) {
		or = or-1;
		// - pistil
		let p = new Pistil(or, this.petalBackgroundColor);
		// - add to flower object
		this.add(p);
		this.pistils.push(p);

		if(or > 0){
			this._createPistil(or);
		}
	}

	_traverse(arr, fct) {
		let i = 0,
			l = arr.length;
		for ( i ; i < l ; i++) {
			fct(arr[i]);
		}
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
