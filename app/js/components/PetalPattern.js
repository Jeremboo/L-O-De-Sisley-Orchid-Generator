import props from 'js/core/props';
import utils from 'js/core/Utils';

const TEXTURE_WIDTH = 256;
const TEXTURE_HEIGHT = 256;


class PetalPattern {
  constructor() {
    this.color = utils.getRGBcanvasColor(props.patternColor);
    // ##
    // GENERATE PATTERN TEXTURE
    // - create canvas
    this.canvas = document.createElement('canvas');
    // TEMPS
    this.canvas.className = 'texture';
    // TEMPS
    this.canvas.width = TEXTURE_WIDTH;
    this.canvas.height = TEXTURE_HEIGHT;
    this.ctx = this.canvas.getContext('2d');
    // -- use canvas to texture
    this.texture = new THREE.Texture(this.canvas);
    // - create texture with imgs
    this._drawTexture();
  }

  // ##########
  // UPDATING PARAMETERS
  // ##########
  updateTexture() {
    this.color = utils.getRGBcanvasColor(props.patternColor);
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this._drawTexture();
  }

  clone(newPattern) {
    // COPY THE CONTENT OF OVER PETAL PATTERN
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.drawImage(newPattern.canvas, 0, 0);

    // UPDATE TEXTURE
    this.texture.needsUpdate = true;
  }

  // ##########
  // TEXTURE DRAWING
  // ##########
  _drawTexture() {
    // - Add base
    // -- update base height
    this.ctx.drawImage(props.imgs.petalBase, 0, 0, TEXTURE_WIDTH, TEXTURE_HEIGHT * utils.getRandomFloat(0.6, 1));
    this.ctx.globalCompositeOperation = 'source-in';
    this.ctx.fillStyle = this.color;
    this.ctx.rect(0, 0, TEXTURE_WIDTH, TEXTURE_HEIGHT);
    this.ctx.fill();
    this.ctx.globalCompositeOperation = 'source-over';

    // - Add points
    this.ctx.globalAlpha = utils.getXBetweenTwoNumbers(0.5, 1, props.mood);
    // -- First Texture points
    // --- Random position
    this.ctx.drawImage(props.imgs.petalPoints, utils.getRandomFloat(-100, 100), utils.getRandomFloat(-100, 100), TEXTURE_WIDTH, TEXTURE_HEIGHT);
    // -- Second Texture points
    // --- Random Rotation
    const rotation = utils.getRandomFloat(0, 360 * Math.PI);
    this.ctx.rotate(rotation);
    // --- Random position
    this.ctx.drawImage(props.imgs.petalPoints, utils.getRandomFloat(-100, 100), utils.getRandomFloat(-100, 100), TEXTURE_WIDTH, TEXTURE_HEIGHT);
    this.ctx.globalAlpha = 1;
    this.ctx.rotate(-rotation);

    // UPDATE TEXTURE
    this.texture.needsUpdate = true;
  }
}
module.exports = PetalPattern;
