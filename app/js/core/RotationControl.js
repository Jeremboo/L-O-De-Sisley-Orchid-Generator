import props from 'js/core/props';

class RotationControl {

  constructor() {
    this.ratio = 10;

    window.addEventListener('deviceorientation', this._onOrientationMove.bind(this), false);
    window.addEventListener('mousemove', this._onMouseMove.bind(this), false);
  }

  _onOrientationMove(event) {
    let beta = event.beta;
    if (beta > 90) { beta = 90; }
    if (beta < -90) { beta = -90; }

    const x = (beta - 55) * Math.PI / 180;
    const y = (event.gamma) * Math.PI / 180;
    const z = (event.omega) * Math.PI / 180;
    this.rotateElement(x, y, z);
  }

  _onMouseMove(event) {
    if (!props.onMobile) {
      const x = (45 * (event.y - window.innerHeight / 2)) / window.innerHeight / 2;
      const y = (45 * (event.x - window.innerWidth / 2)) / window.innerWidth / 2;
      this.rotateElement(x / this.ratio, y / this.ratio, 0);
    }
  }

  rotateElement(x, y, z) {
    if (props.mouseCapture && props.openned) {
      props.rotation.set(x, y, z);
    }
  }
}

module.exports = new RotationControl();
