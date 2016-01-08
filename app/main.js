import webgl from 'js/core/Webgl';
import loop from 'js/core/Loop';
import props from 'js/core/props';
import utils from 'js/core/Utils';
import eventDispatcher from 'js/core/EventDispatcher';

import Flower from 'js/components/Flower';

// ##
// INIT
webgl.init();
document.body.appendChild(webgl.dom);
// - Add object update to loop
loop.add(webgl._binds.onUpdate);

// ##
// FLOWER
const flower = new Flower();

// ##
// GUI
const gui = new dat.GUI();
const guiStress = gui.add(props, 'stress', 0, 10).listen();
const guiTiredness = gui.add(props, 'tiredness', 0, 10).listen();
const guiMood = gui.add(props, 'mood', 0, 10).listen();
const guiHackFolder = gui.addFolder('hack');
const guiCanvasShowed = guiHackFolder.add(props, 'showCanvasPetalPattern').listen();
const guiMouseCapture = guiHackFolder.add(props, 'mouseCapture').listen();
const guiZoom = guiHackFolder.add(props, 'zoom', 1.4, 10).listen();
const guiPetalColor = guiHackFolder.addColor(props, 'petalColor');
const guiPatternColor = guiHackFolder.addColor(props, 'patternColor');

guiStress.onChange(value => {
  flower.updateWindFrequency();
});
guiTiredness.onChange(value => {
  flower.updateAppearence();
});
guiMood.onChange(value => {
  props.petalColor = props.colors[Math.round(props.mood)];
  props.patternColor = props.patternColors[Math.round(props.mood)];
  flower.updateTexture();
});
guiCanvasShowed.onChange(value => {
  toggleCanvas();
});
guiMouseCapture.onChange(value => {
  if (!value) {
    props.rotation.set(0, 0, 0);
  }
});
guiZoom.onChange(value => {
  webgl.updateZoom(value);
});
guiPetalColor.onChange(() => {
  flower.updateTexture();
});
guiPatternColor.onChange(() => {
  flower.updateTexture();
});
// gui.close();


// ##
// EVENTS
// -- on flower Load
eventDispatcher.subscribe('flowerLoad', () => {
  if (!flower.alreadyOnScene) {
    flower.init(() => {
      webgl.add(flower);
      loop.add(flower._binds.onUpdate);
    });
  }
});

// - on flower Grow
eventDispatcher.subscribe('flowerGrow', (flowerData) => {
  // - stress
  props.stress = flowerData.stress;
  // - tiredness
  props.tiredness = flowerData.tiredness;
  // - mood
  props.mood = flowerData.mood;
  props.petalColor = props.colors[Math.round(props.mood)];
  props.patternColor = props.patternColors[Math.round(props.mood)];
  // UPDATE FLOWER
  flower.grow();
});

// - on flower to seed
eventDispatcher.subscribe('flowerToSeed', () => {
  flower.toSeed();
});
// - on flower progress
eventDispatcher.subscribe('flowerProgress', () => {
  flower.progress();
});
// - on resize
window.addEventListener('resize', onResize, false);


// ##
// START
onResize();
loop.start();
eventDispatcher.publish('flowerLoad');


// ##
// FCT
function onResize() {
  checkMobile();
  webgl.onResize();
}

function checkMobile() {
  const w = window.screen.availWidth || window.innerWidth;
  const h = window.screen.availWidth || window.innerHeight;

  if (w <= 800 && h <= 600) {
    props.onMobile = true;
  } else {
    props.onMobile = false;
  }
}

// ########################################################
// TEMPS
document.getElementById('to-grow').addEventListener('click', () => {
  eventDispatcher.publish('flowerGrow', {
    stress: Math.random() * 10,
    tiredness: Math.random() * 10,
    mood: Math.random() * 10,
  });
});
document.getElementById('to-seed').addEventListener('click', () => {
  eventDispatcher.publish('flowerToSeed');
});
// - loadFlower
document.addEventListener('keydown', (e) => {
  // ArrowUp || Space
  if (e.keyCode === 38 || e.keyCode === 32) {
    eventDispatcher.publish('flowerGrow', {
      stress: Math.random() * 10,
      tiredness: Math.random() * 10,
      mood: Math.random() * 10,
    });
  }
  // ArrowDonw
  if (e.keyCode === 40) {
    eventDispatcher.publish('flowerToSeed');
  }
  // - Shift
  if (e.keyCode === 16) {
    eventDispatcher.publish('flowerProgress');
  }
});
document.addEventListener('touchstart', (e) => {
  eventDispatcher.publish('flowerGrow', {
    stress: Math.random() * 10,
    tiredness: Math.random() * 10,
    mood: Math.random() * 10,
  });
});
// -- openFlowerAutomaticalally
eventDispatcher.subscribe('onFinishLoaded', () => {
  eventDispatcher.publish('flowerGrow', {
    stress: Math.random() * 10,
    tiredness: Math.random() * 10,
    mood: Math.random() * 10,
  });
});

function toggleCanvas() {
  let status = 'none';
  if (props.showCanvasPetalPattern) {
    status = 'block';
  }
  document.getElementById('params').style.display = status;
}
// TEMPS
// ########################################################
