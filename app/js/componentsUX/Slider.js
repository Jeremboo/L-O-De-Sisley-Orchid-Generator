import eventDispatcher from 'js/core/EventDispatcher';

class Slider {
  constructor(id) {

    // ##
    // VAR
    this.value = 0;
    // ##
    // Generate Slider
    this.sliderDOM = document.getElementById(id);
    noUiSlider.create(this.sliderDOM, {
      start: [0],
      animate: true,
      range: {
        'min': 0,
        'max': 10,
      },
    });

    // ##
    // LISTENER
    // - create a event name
    this.eventName = this.sliderDOM.id + '-sliding';
    // - add listener
    this.sliderDOM.noUiSlider.on('slide', (e) => {
      this.value = e[0];
      eventDispatcher.emit(this.eventName);
    });
  }

  onSliding(clbk) {
    eventDispatcher.subscribe(this.eventName, () => {
      clbk(this.value);
    });
  }

  set(value) {
    this.sliderDOM.noUiSlider.set(value);
  }
}

module.exports = Slider;
