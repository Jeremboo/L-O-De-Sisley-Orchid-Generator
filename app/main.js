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

// ##
// START
loop.start();
eventDispatcher.publish('flowerLoad');


// ########################################################
// BACK DOOR FOR DEVELOPENT
// - loadFlower
document.addEventListener('keydown', (e) => {
  // Space
  if (e.keyCode === 32) {
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
// ########################################################
