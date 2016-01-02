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
	//TODO relancer l'animation
	flower.updateAppearence();
});
guiMood.onChange(value => {
	props.textureBackgroundColor = props.colors[Math.round(props.mood)];
	flower.updatePetalsTexture();
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
	flower.updateTextureBackgroundColor();
});
//gui.close();

// ##
// FLOWER
var flower = new Flower();


// ##
// EVENTS
// -- on flower Load
swiftEvent.subscribe("flowerLoad", () => {
	if (!flower.alreadyOnScene) {
		flower.init(() => {
			webgl.add(flower);
			loop.add(flower._binds.onUpdate);
		});
	}
});

// - on flower Grow
swiftEvent.subscribe("flowerGrow", (flowerData) => {
	// - stress
	props.stress = flowerData.stress;
	// - tiredness
	props.tiredness = flowerData.tiredness;
	// - mood
	props.mood = flowerData.mood;
	props.textureBackgroundColor = props.colors[Math.round(props.mood)];
	// UPDATE FLOWER
	flower.grow();
});

// - on flower to seed
swiftEvent.subscribe("flowerToSeed", () => {
	flower.toSeed();
});
// - on resize
window.addEventListener( "resize", onResize, false );


// ##
// START
onResize();
loop.start();
swiftEvent.publish("flowerLoad");




// ##
// FCT
function onResize(){
	checkMobile();
	webgl.onResize();
}

function checkMobile(){
	let w = window.screen.availWidth || window.innerWidth;
	let h = window.screen.availWidth || window.innerHeight;

	if( w <= 800 && h <= 600){
		props.onMobile = true;
	} else {
		props.onMobile = false;
	}
}

// ########################################################
// TEMPS
// - loadFlower
document.addEventListener('keydown', (e) => {
	//ArrowDown || Space
  if(e.keyCode == 38 || e.keyCode == 32){
			swiftEvent.publish("flowerGrow", {
				stress : Math.random()*10,
				tiredness : Math.random()*10,
				mood : Math.random()*10
			});
  }
	//ArrowUp
	if(e.keyCode == 40){
		swiftEvent.publish("flowerToSeed");
	}
});
// -- openFlowerAutomaticalally
swiftEvent.subscribe("onFinishLoaded", () => {
	swiftEvent.publish("flowerGrow", {
		stress : Math.random()*10,
		tiredness : Math.random()*10,
		mood : Math.random()*10
	});
});

function toggleCanvas(){
	let status = "none";
	if(props.showCanvasPetalPattern){
	 status = "block";
	}
	document.getElementById('params').style.display = status;
}
// TEMPS
// ########################################################
