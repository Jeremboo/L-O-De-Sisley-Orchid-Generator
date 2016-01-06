const Mediator = require('js/vendors/mediator').Mediator;

class EventDispatcher extends Mediator {
  constructor() {
    super();
  }

  emitToIOS(type) {
    window.location = 'flower://index.html?function=transition&type=' + type +
    '&state=ended';
  }
}

window.mediator = new EventDispatcher();

module.exports = window.mediator;
