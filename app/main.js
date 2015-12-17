import webgl from 'js/core/Webgl';
import loop from 'js/core/Loop';
import props from 'js/core/props';
import rotationControl from "js/core/RotationControl";
import swiftEvent from "js/core/SwiftEventDispatcher";

import Flower from 'js/components/Flower';

// ##
// INIT
webgl.init();
document.body.appendChild( webgl.dom );
// - Add object update to loop
loop.add(webgl._binds.onUpdate);

// ##
// GUI
let gui = new dat.GUI();
let flowerController = gui.add(props, 'flowerToSeed').listen();
let canvasController = gui.add(props, 'showCanvasPetalPattern').listen();
gui.add(props, 'velSpringiness', 0, 0.5);
gui.add(props, 'stress', 0, 10).listen();
gui.add(props, 'tiredness', 0, 10).listen();
gui.add(props, 'mood', 0, 10).listen();
let backgroundColorController =  gui.addColor(props, 'textureBackgroundColor');


flowerController.onChange(value => {
	toggleFlower();
});
canvasController.onChange(value => {
	toggleCanvas();
});
backgroundColorController.onChange(() => {
	flower.changeTextureBackgroundColor();
});
gui.close();

// ##
// FLOWER
var flower = new Flower();
swiftEvent.subscribe("flowerLoad", () => {
	if (!flower.alreadyOnScene) {
		flower.init(() => {
			webgl.add(flower);
			loop.add(flower._binds.onUpdate);
			flower.alreadyOnScene = true;
			swiftEvent.publish("onFinishLoaded");
		});
	}
});

// ##
// RENDERER
loop.start();

// ##
// LOAD FLOWER
swiftEvent.publish("flowerLoad");



// ##
// TEMPS
document.addEventListener('keydown', (e) => {
  if(e.keyCode == 32){
		props.flowerToSeed = true;
		swiftEvent.publish("flowerGrow", {
			stress : Math.random()*10,
			tiredness : Math.random()*10,
			mood : Math.random()*10
		});
  }
});

function toggleFlower(){
	if(props.flowerToSeed){
		// close flower
		swiftEvent.publish("flowerToSeed");
	} else {
		// open flower
		swiftEvent.publish("flowerGrow", {
			stress : Math.random()*10,
			tiredness : Math.random()*10,
			mood : Math.random()*10
		});
	}
}

var canvas = document.getElementById('flower-pattern');
toggleCanvas();
function toggleCanvas(){
	if(props.showCanvasPetalPattern){
		canvas.style.display = 'block';
	} else {
		canvas.style.display = 'none';
	}
}
// TEMPS
// ##

// ##
// ON RESIZE
window.addEventListener( "resize", () => {
	webgl._binds.onResize();
}, false );
