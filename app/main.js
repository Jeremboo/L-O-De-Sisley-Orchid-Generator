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
	guiStress = gui.add(props, 'stress', 0, 10).listen(),
	guiTiredness = gui.add(props, 'tiredness', 0, 10).listen(),
	guiMood = gui.add(props, 'mood', 0, 10).listen(),
	guiHackFolder = gui.addFolder('hack'),
	guiCanvasShowed = guiHackFolder.add(props, 'showCanvasPetalPattern').listen(),
	guiMouseCapture = guiHackFolder.add(props, 'mouseCapture').listen(),
	guiTextureBackgroundColor =  guiHackFolder.addColor(props, 'textureBackgroundColor')
;

guiTiredness.onChange(value => {
	flower.changeTexturePattern();
});
guiMood.onChange(value => {
	props.textureBackgroundColor = props.colors[Math.round(props.mood)];
	flower.changeTextureBackgroundColor();
});
guiCanvasShowed.onChange(value => {
	toggleCanvas();
});
guiMouseCapture.onChange(value => {
	if(!value){
		props.rotation.set(0, 0, 0);
	}
});
guiTextureBackgroundColor.onChange(() => {
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
// TEMPS
// - loadFlower
swiftEvent.publish("flowerLoad");
document.addEventListener('keydown', (e) => {
  if(e.keyCode == 32){
		if(flower.openned){
			swiftEvent.publish("flowerToSeed");
		} else {
			swiftEvent.publish("flowerGrow", {
				stress : Math.random()*10,
				tiredness : Math.random()*10,
				mood : Math.random()*10
			});
		}
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
