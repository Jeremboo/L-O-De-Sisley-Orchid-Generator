import props from 'js/core/props';
import LoadingManager from 'js/core/LoadingManager';
import swiftEvent from "js/core/SwiftEventDispatcher";

import Pistil from 'js/components/Pistil';
import Petal from 'js/components/Petal';

const GROWING = 1;
const TOSEED = 2;
const APPEAR = 3;


class Flower extends THREE.Object3D {
	constructor(){
		super();

		// ##
		// INIT
		this.numberOfPistil = 3;
		this.oldRotation = new THREE.Vector3( 0, 0, 0 );
		this.petalBackgroundColor = this._getVec4Color(props.textureBackgroundColor);
		this.timer = 0;
		// -- bool
		this.alreadyOnScene = false;
		this.openned = false;
		this.animation = false;
		// -- children
		this.petals = [];
		this.pistils = [];
		// -- actions for children during animation
		this.childrenAnimationFct = ()=>{};

		// ##
		// EVENTS
		swiftEvent.subscribe("flowerGrow", (flowerData) => {
			if (this.alreadyOnScene) {
				this.openned = true;
				this.animation = GROWING;
				props.stress = flowerData.stress;
			  props.tiredness = flowerData.tiredness;
			  props.mood = flowerData.mood;
				// - update backgroundColor
				props.textureBackgroundColor = props.colors[Math.round(props.mood)];
				// - update flower
				this.changeTexturePattern();
				this.changeTextureBackgroundColor();
			} else {
				console.error("Flower is not in scene");
			}
		});
		swiftEvent.subscribe("flowerToSeed", () => {
			if (this.alreadyOnScene) {
				this.openned = false;
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

			// CREATE PETALS CLASS
			petals.traverse(child => {
				if ( child instanceof THREE.Mesh ) {
					let petal = new Petal(this.petals.length, child, this.petalBackgroundColor);
					this.petals.push(petal);
				}
			});

			// CREATE PISTIL CLASS
			this._createPistil(this.numberOfPistil);

			// SHOW FLOWER
			this.scale.set(0.0001, 0.0001, 0.0001);
			this.animation = APPEAR;

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
			case APPEAR :
				this._onAppear();
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
		let rotationForce = distRotation.multiplyScalar(0.15 - (0.012 * props.tiredness));
		rotationForce.y *= 1.5; // minimise force in Y.

		// - update rotation with rotationForce
		this.rotation.setFromVector3(this.rotation.toVector3().add(rotationForce));

		// ##
		// WIND
		this.timer += 0.01;
		let time = this.timer;
		let windAmpl = props.stress / 40;
		let windStrength = Math.cos(time * (props.stress / 2) ) * windAmpl;
		let windForce = new THREE.Vector3( Math.sin( time * (props.stress / 3) * 1.3 ), Math.sin( time ), 0 ).multiplyScalar(windStrength);
		let windForceMatrix = this._getRotationMatrix(windForce);

		// ##
		// UPDATE
		// - update petals
		this._traverse(this.petals, petal => {
			petal.onUpdate(distRotationMatrix, windForceMatrix, this.animation);
			this.childrenAnimationFct(petal);
		});
		// - update pistils
		this._traverse(this.pistils,  pistil => {
			pistil.onUpdate(distRotationMatrix, windForce, windForceMatrix);
			this.childrenAnimationFct(pistil);
		});
	}

	// ##
	// ## TEMP
	changeTextureBackgroundColor(){
		this.petalBackgroundColor = this._getVec4Color(props.textureBackgroundColor);
		this._traverse(this.petals, petal  => {
			petal.changeColor(this.petalBackgroundColor);
		});
		this._traverse(this.pistils, pistil => {
			pistil.changeColor(this.petalBackgroundColor);
		});
	}
	changeTexturePattern(){
		this._traverse(this.petals, petal  => {
			petal.changeTexture();
		});
	}
	// ## TEMP
	// ##

	_onToSeed(){
		this._rotateFlowerOnX(-1.5);
		this.childrenAnimationFct = (children)=>{
			children.onToSeed();
		};
	}

	_onGrow() {
		this._rotateFlowerOnX(0);
		this.childrenAnimationFct = (children)=>{
			children.onGrow();
		};
	}

	_onAppear() {
		let force = ( 1 - this.scale.x ) * 0.1;
		this.scale.addScalar(force);
		if(Math.abs(force) < 0.001){
			this.animation = false;
			this.alreadyOnScene = true;
			swiftEvent.publish("onFinishLoaded");
		}
	}

	_rotateFlowerOnX(rotation) {
		let force = ( rotation - this.rotation.x ) * 0.03;
		this.rotation.x += force;
		if(Math.abs(force) < 0.001){
			this.animation = false;
			this.childrenAnimationFct = ()=>{};
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
