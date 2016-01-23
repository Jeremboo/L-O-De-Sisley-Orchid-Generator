import props from 'js/core/props';

class SizeControl {
  constructor() {
    // TODO utiliser l'user agent pour détecter le mobile
    // navigator.userAgent;
    this._onMobile = false;

    this._width = null;
    this._height = null;
    this._action = null;

    window.addEventListener('resize', this._onResize.bind(this), false);
    window.addEventListener('orientationchange', this._onResize.bind(this), false);
  }

  _onResize() {
    this._checkSize();
    if (this._action) {
      this._action.apply(this, null);
    }
  }

  onResize(action) {
    this._action = () => {
      action(this._width, this._height);
    };
    this._onResize();
  }

  _checkSize() {
    if (!this._onMobile) {
      this._width = window.innerWidth;
      this._height = window.innerHeight;

      if (this._width <= 800) {
        props.onMobile = true;
      } else {
        props.onMobile = false;
      }
    } else {
      this._width = window.screen.availWidth;
      this._height = window.screen.availHeight;
    }
  }
}

module.exports = new SizeControl();
