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
const titleWrapper = document.getElementById('title-wrapper');
const shareButtons = document.querySelectorAll('.HeaderFooter-shares .Button');
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

function showFlower() {
  // SHOW FLOWER
  if (flower.alreadyOnScene) {
    dashboard.setRandomValuesToFlower();
  } else {
    eventDispatcher.subscribe('flowerLoaded', () => {
      dashboard.setRandomValuesToFlower();
    });
  }
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
}

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

// ##
// STARTER
document.addEventListener('DOMContentLoaded', (event) => {
  // ##
  // ANIMATIONS
  const showHeaderTimeline = new TimelineLite();
  const titleChildrenLenght = titleWrapper.children.length;
  const sharedButtonLength = shareButtons.length;
  let i, j;
  // Title Animation
  for (i = 0; i < titleChildrenLenght; i++) {
    showHeaderTimeline.to(titleWrapper.children[i], 0.5, { 'line-height': '100%', opacity: 1 }, '-=0.2');
  }
  // Btn Start Animation
  showHeaderTimeline.to(startExperimentBtn, 0.8, { margin: 0, opacity: 1 });
  // Shares button animation
  for (j = 0; j < sharedButtonLength; j++) {
    showHeaderTimeline.to(shareButtons[j], 0.4, { top: 0, opacity: 1 }, '-=0.25');
  }

  // ##
  // DASHBOARD LISTENER
  startExperimentBtn.addEventListener('click', () => {
    // HIDE START BUTTON AND CONTENT
    TweenLite.to(startExperimentBtn, 0.5, {'margin-top': '30px', opacity: 0, onComplete: showFlower });
  });

  // ##
  // START
  loop.start();
  eventDispatcher.publish('loadFlower');
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
