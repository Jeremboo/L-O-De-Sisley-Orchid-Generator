import webgl from 'js/core/Webgl';
import loop from 'js/core/Loop';
import props from 'js/core/props';
import utils from 'js/core/Utils';
import eventDispatcher from 'js/core/EventDispatcher';

import dashboard from 'js/componentsUX/Dashboard';

import Flower from 'js/components/Flower';

// ##
// INIT
// - DOM ELEMENTS
const header = document.getElementById('header');
const content = document.getElementById('content');
const startExperimentBtn = document.getElementById('start-experiment');
// - WEBGL
webgl.init();
header.appendChild(webgl.dom);
// - Add object update to loop
loop.add(webgl._binds.onUpdate);
// - FLOWER
const flower = new Flower();

// ##
// DASHBOARD LISTENER
startExperimentBtn.addEventListener('click', () => {
  // ##
  // HIDE START BUTTON AND CONTENT
  startExperimentBtn.classList.add('active');
  content.classList.add('hidden');

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
    console.log("loaded");
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

// - on resize
window.addEventListener('resize', onResize, false);


// ##
// START
onResize();
loop.start();
eventDispatcher.publish('loadFlower');


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
