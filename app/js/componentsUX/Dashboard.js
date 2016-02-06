import props from 'js/core/props';
import eventDispatcher from 'js/core/EventDispatcher';

import Slider from 'js/componentsUX/Slider';

class Dashboard {
  constructor() {

    // ##
    // GET DOM ELEMENTS
    // POPUP
    this.popUp = document.getElementById('popup');
    // COMMAND
    this.commands = document.getElementById('commands');
    // BUTTONS
    this.randomizeBtn = document.getElementById('flower-randomize');
    // SLIDERS
    this.stressSlider = new Slider('slider-stress');
    this.tirednessSlider = new Slider('slider-tiredness');
    this.moodSlider = new Slider('slider-mood');
  }

  show() {
    let showDashBoardTimeline = new TimelineLite();
    showDashBoardTimeline.to(this.commands, 0.5, { bottom: '-15%', opacity: 1 })
      .to(this.popUp, 1, { right: '-50%', opacity: 1 }, '-=0.25');

    // ##
    // ADD LISTENERS FOR BUTTON
    this.randomizeBtn.addEventListener('click',
      this.setRandomValuesToFlower.bind(this)
    );
  }

  // PARAMS LISTENERS
  onStressChange(clbk) {
    this.stressSlider.onSliding((value) => {
      props.stress = value;
      clbk();
    });
  }

  onTirednessChange(clbk) {
    this.tirednessSlider.onSliding((value) => {
      props.tiredness = value;
      clbk();
    });
  }

  onMoodChange(clbk) {
    this.moodSlider.onSliding((value) => {
      props.mood = value;
      props.petalColor = props.colors[Math.round(props.mood)];
      props.patternColor = props.patternColors[Math.round(props.mood)];
      clbk();
    });
  }

  setRandomValuesToFlower() {
    const mStress = Math.random() * 10;
    const mTiredness = Math.random() * 10;
    const mMood = Math.random() * 10;

    this.stressSlider.set(mStress);
    this.tirednessSlider.set(mTiredness);
    this.moodSlider.set(mMood);

    eventDispatcher.publish('growsFlower', {
      stress: mStress,
      tiredness: mTiredness,
      mood: mMood,
    });
  }

  _showShareView() {
    console.log('TODO : show share view');
  }
}

module.exports = new Dashboard();
