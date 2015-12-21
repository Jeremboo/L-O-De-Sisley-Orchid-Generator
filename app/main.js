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
gui.add(props, 'stress', 0, 10).listen();
gui.add(props, 'tiredness', 0, 10).listen();
gui.add(props, 'mood', 0, 10).listen();
let guiHackFolder = gui.addFolder('hack');
let canvasController = guiHackFolder.add(props, 'showCanvasPetalPattern').listen();
let backgroundColorController =  guiHackFolder.addColor(props, 'textureBackgroundColor');

canvasController.onChange(value => {
	toggleCanvas();
});
backgroundColorController.onChange(() => {
	flower.changeTextureBackgroundColor();
});
//gui.close();

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

function toggleCanvas(){
	let status = "none";
	if(props.showCanvasPetalPattern){
	 status = "block";
	}
	document.getElementById('params').style.display = status;
}
// TEMPS
// ##

// ##
// ON RESIZE
window.addEventListener( "resize", () => {
	webgl._binds.onResize();
}, false );
