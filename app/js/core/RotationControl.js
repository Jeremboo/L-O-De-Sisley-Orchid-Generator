'use strict';

import props from 'js/core/props';

class RotationControl {

  constructor() {
    this.posMouse = document.getElementById("pos-mouse");
    this.posOrientation = document.getElementById("pos-orientation");
    this.ratio = 10;

    window.addEventListener('deviceorientation', (event) => {
      this._onOrientationMove(event);
    });

    window.addEventListener('mousemove', (event) => {
      this._onMouseMove(event);
    });
  }

  _onOrientationMove(event){
    this.posOrientation.innerHTML = "X : "+event.beta+", Y : "+event.gamma+", Z : "+event.alpha;
    this.rotateElement((55-event.beta)/this.ratio,(event.gamma)/this.ratio);
  }

  _onMouseMove(event) {
    let x = (45 * (event.y - window.innerHeight/2)) / window.innerHeight/2,
        y = (45 * (event.x - window.innerWidth/2)) / window.innerWidth/2;
    this.posMouse.innerHTML = "X : "+x+", Y : "+y;
    this.rotateElement(x/this.ratio,y/this.ratio);
  }

  rotateElement(x, y){
    props.rotation.set( x, y, 0);
  }
}

module.exports = new RotationControl();
