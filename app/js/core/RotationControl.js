'use strict';

import props from 'js/core/props';

class RotationControl {

  constructor() {
    this.ratio = 10;

    window.addEventListener('deviceorientation',this._onOrientationMove.bind(this), false);
    window.addEventListener('mousemove', this._onMouseMove.bind(this), false);
  }

  _onOrientationMove(event){
    if(props.onMobile){
      this.rotateElement(event.beta/this.ratio,event.gamma/this.ratio);
    }
  }

  _onMouseMove(event) {
    if(!props.onMobile){
      let x = (45 * (event.y - window.innerHeight/2)) / window.innerHeight/2,
          y = (45 * (event.x - window.innerWidth/2)) / window.innerWidth/2;
      this.rotateElement(x/this.ratio, y/this.ratio);
    }
  }

  rotateElement(x, y){
    if(props.mouseCapture){
      props.rotation.set( x, y, 0);
    }
  }
}

module.exports = new RotationControl();
