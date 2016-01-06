import props from 'js/core/props';
import utils from 'js/core/Utils';
import eventDispatcher from 'js/core/EventDispatcher';
import rotationControl from 'js/core/RotationControl';
import LoadingManager from 'js/core/LoadingManager';

import Pistil from 'js/components/Pistil';
import Petal from 'js/components/Petal';

const GROWING = 1;
const TOSEED = 2;
const APPEAR = 3;
const PROGRESS = 4;


class Flower extends THREE.Object3D {
  constructor() {
    super();

    // ##
    // INIT
    this.numberOfPistil = 3;
    this.baseRotation = new THREE.Vector3(-2, 0, 0);
    this.progressStep = 0;
    this.transitionTimer = 0;
    this.time = 0;
    this.windFrequency = 0;
    this.windPhase = 0;
    // - openning
    this.flowerOpenning = {
      min: -2,
      max: 0,
    };
    // - scale
    this.flowerScale = {
      toSeed: 0.1,
      min: 0.5,
      max: 1,
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
      const petals = object;
      this.add(petals);

      // CREATE PETALS CLASS
      petals.traverse(child => {
        if (child instanceof THREE.Mesh) {
          const petal = new Petal(this.petals.length, child);
          this.petals.push(petal);
        }
      });

      // CREATE PISTIL CLASS
      this._createPistil(this.numberOfPistil - 1);

      // SHOW FLOWER
      this.scale.set(0.0001, 0.0001, 0.0001);
      this.animation = APPEAR;

      callback();
    });
  }

  grow() {
    if (this.alreadyOnScene) {
      this.openned = true;
      this.progressStep = 0;
      // - wind (stress)
      this.updateWindFrequency();
      // - appearence (tiredness)
      this.updateAppearence();
      // - texture (mood)
      this.updateTexture();
    } else {
      console.error('Flower is not initialized yet.');
    }
  }

  toSeed() {
    if (this.alreadyOnScene) {
      this.openned = false;
      this.animation = TOSEED;
    } else {
      console.error('Flower is not initialized yet.');
    }
  }

  progress() {
    if (this.alreadyOnScene) {
      if (!this.openned) {
        this.animation = PROGRESS;
        if (this.progressStep < 3) {
          this.progressStep++;
        }
      } else {
        console.error('Flower is not to seed. Use this.toSeed() method before');
      }
    } else {
      console.error('Flower is not initialized yet.');
    }
  }

  // ##########
  // ONUPDATE
  // ##########
  _onUpdate() {
    // ##
    // ANIMATION (TIREDNESS)
    switch (this.animation) {
      case GROWING :
        this._onGrow();
        break;
      case TOSEED :
        this._onToSeed();
        break;
      case APPEAR :
        this._onAppear();
        break;
      case PROGRESS :
        this._onProgress();
        break;
      default :
        break;
    }

    // ##
    // ROTATION ( ACCELEROMETER && TIREDNESS )
    // - dist between new rotation targeted and current rotation
    const distRotation = props.rotation.clone().sub(this.rotation.toVector3().add(this.baseRotation));
    const distRotationMatrix = utils.getRotationMatrix(distRotation);
    // - force to apply at flowerObject
    // const vel = 0.15 - (0.012 * props.tiredness);
    const vel = utils.getXBetweenTwoNumbers(0.07, 0.03, props.tiredness);
    const rotationForce = distRotation.multiplyScalar(vel);
    rotationForce.y *= 1.5; // minimise force in Y.

    // - update rotation with rotationForce
    this.rotation.setFromVector3(this.rotation.toVector3().add(rotationForce));

    // ##
    // WIND (STRESS)
    this.time = Date.now() / 3000;
    const windAmpl = 0.1 + props.stress / 50;
    const windStrength = Math.cos(this.time * this.windFrequency + this.windPhase) * windAmpl;
    const windForce = new THREE.Vector3(
      Math.sin(this.time * this.windFrequency + this.windPhase) * (props.stress / 8),
      Math.sin(this.time * 1.3) * Math.cos(this.time),
      0
    ).multiplyScalar(windStrength);
    const windForceMatrix = utils.getRotationMatrix(windForce);

    // ##
    // TRANSITIONTIMER (MOOD)
    if (this.transitionTimer >= 0) {
      this._onTransitionUpdating();
    }


    // ##
    // UPDATE CHILDREN
    // - update petals
    utils.traverseArr(this.petals, petal => {
      petal.onUpdate(distRotationMatrix, windForceMatrix);
    });
    // - update pistils
    utils.traverseArr(this.pistils, pistil => {
      pistil.onUpdate(distRotationMatrix, windForce, windForceMatrix);
    });
  }

  _onToSeed() {
    this._animRotationOnX(this.flowerOpenning.min);
    this._animScale(this.flowerScale.toSeed);
    eventDispatcher.publish('onToSeed');
  }

  _onGrow() {
    // rotation
    const rotationTargeted = utils.getXBetweenTwoNumbers(
      this.flowerOpenning.max,
      this.flowerOpenning.min,
      props.tiredness
    );
    this._animRotationOnX(rotationTargeted);
    // scale
    const scaleTargeted = utils.getXBetweenTwoNumbers(
      this.flowerScale.max,
      this.flowerScale.min,
      props.tiredness
    );
    this._animScale(scaleTargeted);
    eventDispatcher.publish('onGrow');
  }

  _onAppear() {
    this._animScale(this.flowerScale.toSeed, () => {
      this.alreadyOnScene = true;
      eventDispatcher.publish('onFinishLoaded');
    });
  }

  _onProgress() {
    const newScale = this.flowerScale.toSeed + (0.1 * this.progressStep);
    this._animScale(newScale);
  }

  _onTransitionUpdating() {
    // update transition
    this.transitionTimer -= 0.02;
    eventDispatcher.publish('onTransitionUpdating', this.transitionTimer);

    // test transition end
    if (this.transitionTimer <= 0) {
      utils.traverseArr(this.petals, petal => {
        petal.updateMaterialEnd();
      });
      utils.traverseArr(this.pistils, pistil => {
        pistil.updateMaterialEnd();
      });
    }
  }


  // ##########
  // ANIMATION
  // ##########
  _animRotationOnX(rotation, callback) {
    utils.easing(rotation, this.baseRotation.x, {
      update: (f) => {this.baseRotation.x += f;},
      callback: () => {this._animEnd(callback);},
    });
  }

  _animScale(scale, callback) {
    utils.easing(scale, this.scale.x, {
      update: (f) => {this.scale.addScalar(f);},
      callback: () => {this._animEnd(callback);},
    });
  }

  _animEnd(clbk) {

    // Send a swift event
    switch (this.animation) {
      case GROWING :
        eventDispatcher.emitToIOS('grow');
        break;
      case TOSEED :
        eventDispatcher.emitToIOS('toseed');
        break;
      case APPEAR :
        eventDispatcher.emitToIOS('appear');
        break;
      case PROGRESS :
        eventDispatcher.emitToIOS('progress');
        break;
      default :
        break;
    }
    // anim end
    this.animation = false;
    if (clbk) {
      clbk();
    }
  }


  // ##########
  // UPDATING PARAMETERS
  // ##########
  // - tiredness
  updateAppearence() {
    this.animation = GROWING;
  }
  // - stress
  updateWindFrequency() {
    const curr = (this.time * this.windFrequency + this.windPhase) % (2 * Math.PI);
    const next = (this.time * props.stress) % (2 * Math.PI);
    this.windPhase = curr - next;
    this.windFrequency = props.stress;
  }
  // - mood
  updateTexture() {
    this.transitionTimer = 1;
    utils.traverseArr(this.petals, petal => {
      petal.updateMaterial();
    });
    utils.traverseArr(this.pistils, pistil => {
      pistil.updateMaterial();
    });
  }

  // ##########
  // PISTILS
  // ##########
  _createPistil(or) {
    // - pistil
    const p = new Pistil(or);
    // - add to flower object
    this.add(p);
    this.pistils.push(p);

    if (or > 0) {
      this._createPistil(or - 1);
    }
  }
}

module.exports = Flower;
