import webgl from 'js/core/Webgl';
import loop from 'js/core/Loop';
import props from 'js/core/props';
import utils from 'js/core/Utils';
import eventDispatcher from 'js/core/EventDispatcher';

import Flower from 'js/components/Flower';

import Slider from 'js/componentsUX/Slider';

// ##
// INIT
webgl.init();
document.body.appendChild(webgl.dom);
// - Add object update to loop
loop.add(webgl._binds.onUpdate);


// slider.noUiSlider.on('slide', function(){
//   addClassFor(lSlide, 'tShow', 450);
// });

// trueSlider.noUiSlider.set(60);
// falseSlider.noUiSlider.set(60);

// ##
// FLOWER
const flower = new Flower();

// ##
// EXPERIMENT DASHBOARD
// - sliders
const sliderStress = new Slider('slider-stress');
const sliderTiredness = new Slider('slider-tiredness');
const sliderMood = new Slider('slider-mood');

sliderStress.onSliding((value) => {
  props.stress = value;
  flower.updateWindFrequency();
});

sliderTiredness.onSliding((value) => {
  props.tiredness = value;
  flower.updateAppearence();
});

sliderMood.onSliding((value) => {
  props.mood = value;
  props.petalColor = props.colors[Math.round(props.mood)];
  props.patternColor = props.patternColors[Math.round(props.mood)];
  flower.updateTexture();
});
// - buttons
const flowerRandomizeBtn = document.getElementById('flower-randomize');

flowerRandomizeBtn.addEventListener('click', () => {
  const mStress = Math.random() * 10;
  const mTiredness = Math.random() * 10;
  const mMood = Math.random() * 10;

  sliderStress.set(mStress);
  sliderTiredness.set(mTiredness);
  sliderMood.set(mMood);

  eventDispatcher.publish('flowerGrow', {
    stress: mStress,
    tiredness: mTiredness,
    mood: mMood,
  });
});


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

// TEMPS
// ########################################################
