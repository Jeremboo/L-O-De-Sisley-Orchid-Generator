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
let guiController = gui.add(props, 'flowerToSeed').listen();
gui.add(props, 'velSpringiness', 0, 0.5);
gui.add(props, 'stress', 0, 10);
gui.add(props, 'tiredness', 0, 10);
gui.add(props, 'mood', 0, 10);

guiController.onChange(function(value) {
	toggleFlower();
});
//gui.close();

// ##
// LIGHT
var ambient = new THREE.PointLight( 0xffffff, 1, 100 );
ambient.position.set(1,10,10);
webgl.add( ambient );


// ##
// FLOWER
var flower = new Flower();
swiftEvent.subscribe("flowerLoad", () => {
	if (!flower.alreadyOnScene) {
		flower.init((flowerObject) => {
			webgl.add(flowerObject);
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
		swiftEvent.publish("flowerGrow");
  }
});

function toggleFlower(){
	if(props.flowerToSeed){
		// close flower
		swiftEvent.publish("flowerToSeed");
	} else {
		// open flower
		swiftEvent.publish("flowerGrow");
	}
}
// TEMPS
// ##

// ##
// ON RESIZE
window.addEventListener( "resize", () => {
	webgl._binds.onResize();
}, false );
