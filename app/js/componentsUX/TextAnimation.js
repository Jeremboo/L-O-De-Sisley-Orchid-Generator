class TextAnimation {
  constructor(element, style) {
    this.element = element;
    this.text = this.element.innerText;
    this.element.innerText = '';
    this.letters = [];

    let i;
    let key;
    for (i = 0; i < this.text.length; i++) {
      const letter = document.createElement('span');
      letter.className = 'TextAnimation-letter';
      letter.innerHTML = this.text[i];

      for (key in style) {
        if (style.hasOwnProperty(key)) {
          letter.style[key] = style[key];
        }
      }
      this.element.appendChild(letter);
      this.letters.push(letter);
    }
  }

  showTextStartingFromMiddle(duration, tweenData) {
    const tl = new TimelineLite();
    const lead = '-=' + (duration * 0.95);
    // http://stackoverflow.com/questions/21386645/javascript-how-to-parse-an-array-from-beginning-and-end-to-center
    let reverseIndex;
    for (let i = (Math.ceil(this.letters.length / 2) - 1); i >= 0; i--) {
      reverseIndex = this.letters.length - (i + 1);
      tl.to(this.letters[i], duration, tweenData, lead);
      if (i !== reverseIndex) {
        tl.to(this.letters[reverseIndex], duration, tweenData, lead);
      }
    }
    tl.play();
  }
}

module.exports = TextAnimation;
