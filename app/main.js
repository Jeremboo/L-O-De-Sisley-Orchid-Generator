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
gui.add(props, 'stress', 0, 1);
gui.add(props, 'tiredness', 0, 1);
gui.add(props, 'mood', 0, 1);

//gui.close();

// ##
// LIGHT
var ambient = new THREE.PointLight( 0xffffff, 1, 100 );
ambient.position.set(1,10,10);
webgl.add( ambient );


// ##
// FLOWER
var flower = new Flower();
swiftEvent.subscribe("flowerLoad", (flowerData) => {
	if (!flower.alreadyOnScene) {
		flower.init(() => {
			webgl.add(flower.flowerObject);
			loop.add(flower._binds.onUpdate);
			flower.alreadyOnScene = true;
			swiftEvent.publish("flowerGrow");
		});
	}
});

// ##
// RENDERER
loop.start();


// ##
// TEMPS
document.addEventListener('keydown', (e) => {
  if(e.keyCode == 32){
      swiftEvent.publish("flowerLoad",{});
  }
});
// TEMPS
// ##

// ##
// ON RESIZE
window.addEventListener( "resize", () => {
	webgl._binds.onResize();
}, false );
