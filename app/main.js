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
let gui = new dat.GUI(),
	guiWind = gui.add(props, 'wind', 0, 10).listen(),
	guiVel = gui.add(props, 'vel', 0, 10).listen(),
	guiCanvasShowed = gui.add(props, 'showCanvasPetalPattern').listen(),
	guiMouseCapture = gui.add(props, 'mouseCapture').listen(),
	guiTextureBackgroundColor =  gui.addColor(props, 'textureBackgroundColor').listen()
;

guiVel.onChange(value => {
	flower.changeTexturePattern();
});
guiCanvasShowed.onChange(value => {
	toggleCanvas();
});
guiTextureBackgroundColor.onChange(() => {
	flower.changeTextureBackgroundColor();
});
guiMouseCapture.onChange(value => {
	if(!value){
		props.rotation.set(0, 0, 0);
	}
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
			swiftEvent.publish("flowerGrow", {
				stress : Math.random()*10,
				tiredness : Math.random()*10,
				mood : Math.random()*10
			});
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
// ON RESIZE
window.addEventListener( "resize", () => {
	webgl._binds.onResize();
}, false );


// ##
// ON CLICK TO RANDOMIZE
document.getElementById('randomize').addEventListener('click', () => {
	if (flower.alreadyOnScene) {
		props.textureBackgroundColor = [random(0,255), random(0,255), random(0,255)];
		swiftEvent.publish("flowerGrow", {
			stress : Math.random()*10,
			tiredness : Math.random()*10,
			mood : Math.random()*10
		});
	}
});


// ##
// FCT
function toggleCanvas(){
	let status = "none";
	if(props.showCanvasPetalPattern){
	 status = "block";
	}
	document.getElementById('params').style.display = status;
}

function random(min, max) {
			return Math.random() * (max - min) + min;
}
