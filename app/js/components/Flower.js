import props from 'js/core/props';
import utils from 'js/core/Utils';
import swiftEvent from "js/core/SwiftEventDispatcher";
import LoadingManager from 'js/core/LoadingManager';

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
		this.baseRotation = new THREE.Vector3( -2, 0, 0 );
		this.petalBackgroundColor = utils.getVec4Color(props.textureBackgroundColor);
		this.velAnimation = 0.03;
		// - openning
		this.flowerOpenning = {
			min : -2,
			max : 0
		};
		// - scale
		this.flowerScale = {
			toSeed : 0.2,
			min : 0.5,
			max : 1
		};
		// -- bool
		this.alreadyOnScene = false;
		this.openned = false;
		this.animation = false;
		// -- children
		this.petals = [];
		this.pistils = [];

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

	grow(){
		if (this.alreadyOnScene) {
			this.openned = true;
			// - appearence
			this.updateAppearence();
			// - texture
			this.updatePetalsTexture();
		} else {
			console.error("Flower is not initialized yet.");
		}
	}
	
	toSeed(){
		if (this.alreadyOnScene) {
			this.openned = false;
			this.animation = TOSEED;
		} else {
			console.error("Flower is not initialized yet.");
		}
	}

	// ##########
	// ONUPDATE
	// ##########
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
		let distRotation = props.rotation.clone().sub(this.rotation.toVector3().add(this.baseRotation));
		let distRotationMatrix = utils.getRotationMatrix(distRotation);
	  // - force to apply at flowerObject
		let rotationForce = distRotation.multiplyScalar(0.15 - (0.012 * props.tiredness));
		rotationForce.y *= 1.5; // minimise force in Y.

		// - update rotation with rotationForce
		this.rotation.setFromVector3(this.rotation.toVector3().add(rotationForce));

		// ##
		// WIND
		let time = Date.now()/2000;
		let windAmpl = 0.1 + props.stress / 80;
		let windStrength = Math.cos(time * (props.stress) ) * windAmpl;
		let windForce = new THREE.Vector3(
			Math.sin( time * (props.stress / 1.5) * 1.3 ),
			Math.sin( time ),
			0
		).multiplyScalar(windStrength);
		let windForceMatrix = utils.getRotationMatrix(windForce);

		// ##
		// UPDATE CHILDREN
		// - update petals
		utils.traverseArr(this.petals, petal => {
			petal.onUpdate(distRotationMatrix, windForceMatrix);
		});
		// - update pistils
		utils.traverseArr(this.pistils,  pistil => {
			pistil.onUpdate(distRotationMatrix, windForce, windForceMatrix);
		});
	}

	_onToSeed(){
		this._animRotationOnX(this.flowerOpenning.min);
		this._animScale(this.flowerScale.toSeed);
		mediator.publish("onToSeed");
	}

	_onGrow() {
		// rotation
		let rotationTargeted = utils.getXBetweenTwoNumbers(
			this.flowerOpenning.max,
			this.flowerOpenning.min,
			props.tiredness
		);
		this._animRotationOnX(rotationTargeted);
		// scale
    let scaleTargeted = utils.getXBetweenTwoNumbers(
      this.flowerScale.max,
			this.flowerScale.min,
      props.tiredness
    );
		this._animScale(scaleTargeted);
		mediator.publish("onGrow");
	}

	_onAppear() {
		this._animScale(this.flowerScale.toSeed, () => {
			this.alreadyOnScene = true;
			swiftEvent.publish("onFinishLoaded");
		});
	}


	// ##########
	// ANIMATION
	// ##########
	_animRotationOnX(rotation, callback) {
		let force = ( rotation - this.baseRotation.x ) * this.velAnimation;
		this.baseRotation.x += force;
		this._animTestEnd(force, callback);
	}

	_animScale(scale, callback){
		let force = ( scale - this.scale.x ) * this.velAnimation;
		this.scale.addScalar(force);
		this._animTestEnd(force, callback);
	}

	_animTestEnd(f, callback){
		if(Math.abs(f) < 0.001){
			this.animation = false;
			if(callback){
				callback();
			}
		}
	}


	// ##########
	// UPDATING PARAMETERS
	// ##########
	updateAppearence(){
		this.animation = GROWING;
	}

	updatePetalsTexture(){
		this.updateTextureBackgroundColor();
		this.updateTexturePattern();
	}

	updateTextureBackgroundColor(){
		this.petalBackgroundColor = utils.getVec4Color(props.textureBackgroundColor);
		utils.traverseArr(this.petals, petal  => {
			petal.updateColor(this.petalBackgroundColor);
			//petal.updateTexture();
		});
		utils.traverseArr(this.pistils, pistil => {
			pistil.updateColor(this.petalBackgroundColor);
		});
	}
	updateTexturePattern(){
		utils.traverseArr(this.petals, petal  => {
			petal.updateTexture();
		});
	}
	// TODO fusionner l'enssemble pour la version Sisley


	// ##########
	// PISTILS
	// ##########
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
}

module.exports = Flower;
