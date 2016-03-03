import webgl from 'js/core/Webgl';
import loop from 'js/core/Loop';
import sizeControl from 'js/core/SizeControl';
import props from 'js/core/props';
import utils from 'js/core/Utils';
import eventDispatcher from 'js/core/EventDispatcher';

import dashboard from 'js/componentsUX/Dashboard';
import TextAnimation from 'js/componentsUX/TextAnimation';

import Flower from 'js/components/Flower';

// ##
// INIT
// - DOM ELEMENTS
const header = document.getElementById('header');
const titleWrapper = document.getElementById('title-wrapper');
const shareButtons = document.querySelectorAll('.HeaderFooter-shares .Button');
const startExperimentBtn = document.getElementById('start-experiment');
const startExperimentBtnText = document.getElementById('start-experiment-text');

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
  const startExperimentBtnTextAnimation = new TextAnimation(
    startExperimentBtnText,
    { 'line-height': '100px',
      opacity: 0,
      transform: 'rotateX(-90deg)',
    }
  );

  let i;
  let j;
  // Title Animation
  for (i = 0; i < titleChildrenLenght; i++) {
    showHeaderTimeline.to(titleWrapper.children[i], 0.5, { 'line-height': '1em', opacity: 1 }, '-=0.2');
  }
  // Shares button animation
  for (j = 0; j < sharedButtonLength; j++) {
    showHeaderTimeline.to(shareButtons[j], 0.4, { ease: Power2.easeOut, top: 0, opacity: 1 }, '-=0.25');
  }
  // Btn Start Animation
  showHeaderTimeline.to(startExperimentBtn, 1.5, { ease: Power2.easeOut, margin: 0, opacity: 1, onStart: () => {
    startExperimentBtn.classList.add('active');
    startExperimentBtnTextAnimation.showTextStartingFromMiddle(0.5, { 'line-height': '50px', opacity: 1, transform: 'rotateX(0deg)' });
    startExperimentBtn.addEventListener('mouseover', () => {
      startExperimentBtnTextAnimation.showTextStartingFromMiddle(0.3, { 'line-height': '30px', color: '#5B5F89' });
    });
    startExperimentBtn.addEventListener('mouseout', () => {
      startExperimentBtnTextAnimation.showTextStartingFromMiddle(0.3, { 'line-height': '50px', color: '#808AAD' });
    });
  }, onComplete: () => {
    startExperimentBtn.classList.add('anim_end');
  } });

  // ##
  // DASHBOARD LISTENER
  startExperimentBtn.addEventListener('click', () => {
    // HIDE START BUTTON AND CONTENT
    startExperimentBtn.classList.remove('active');
    startExperimentBtnTextAnimation.showTextStartingFromMiddle(0.8, { 'line-height': '60px', opacity: 0, transform: 'rotateX(-90deg)' });
    TweenLite.to(startExperimentBtn, 0.8, { 'margin-top': '30px', opacity: 0, onComplete: showFlower });
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
