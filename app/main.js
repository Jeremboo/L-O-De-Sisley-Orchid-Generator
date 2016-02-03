import webgl from 'js/core/Webgl';
import loop from 'js/core/Loop';
import sizeControl from 'js/core/SizeControl';
import props from 'js/core/props';
import utils from 'js/core/Utils';
import eventDispatcher from 'js/core/EventDispatcher';

import dashboard from 'js/componentsUX/Dashboard';

import Flower from 'js/components/Flower';

// ##
// INIT
// - DOM ELEMENTS
const header = document.getElementById('header');
const startExperimentBtn = document.getElementById('start-experiment');
// - WEBGL
header.appendChild(webgl.dom);
// - Add object update to loop
loop.add(webgl._binds.onUpdate);
// - Add actions on Resizing
sizeControl.onResize((width, height) => {
  webgl._binds.onResize(width, height);
});
// - FLOWER
const flower = new Flower();

// ##
// DASHBOARD LISTENER
startExperimentBtn.addEventListener('click', () => {

  // ##
  // HIDE START BUTTON AND CONTENT
  startExperimentBtn.classList.add('active');

  setTimeout(() => {
    // ##
    // SHOW FLOWER
    if (flower.alreadyOnScene) {
      dashboard.setRandomValuesToFlower();
    } else {
      eventDispatcher.subscribe('flowerLoaded', () => {
        dashboard.setRandomValuesToFlower();
      });
    }

    // ##
    // SHOW DASHBOARD
    dashboard.show();
    // - add listeners
    dashboard.onStressChange(() => {
      flower.updateWindFrequency();
    });
    dashboard.onTirednessChange(() => {
      flower.updateAppearence();
    });
    dashboard.onMoodChange(() => {
      flower.updateTexture();
    });

  }, 1000);
});


// ##
// EVENTS
// -- on we want to load the flower
eventDispatcher.subscribe('loadFlower', () => {
  flower.init(() => {
    webgl.add(flower);
    loop.add(flower._binds.onUpdate);
    console.log('loaded');
    eventDispatcher.emit('flowerLoaded');
  });
});


// - on we want to grows the flower
eventDispatcher.subscribe('growsFlower', (flowerData) => {
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

// ########################################################
// USELESS
// - on flower to seed
eventDispatcher.subscribe('reduceFlower', () => {
  flower.toSeed();
});
// - on flower progress
eventDispatcher.subscribe('progressFlower', () => {
  flower.progress();
});
// ########################################################


// ##
// START
loop.start();
eventDispatcher.publish('loadFlower');


// ##
// RESIZING
class Resizing {
  constructor() {
    window.addEventListener('resize', this.onResize.bind(this), false);
    this.onResize();
  }

  onResize() {
    this.checkMobile();
    webgl.onResize();
  }

  checkMobile() {
    const w = window.screen.availWidth || window.innerWidth;
    const h = window.screen.availWidth || window.innerHeight;

    if (w <= 800 && h <= 600) {
      props.onMobile = true;
    } else {
      props.onMobile = false;
    }
  }
}
