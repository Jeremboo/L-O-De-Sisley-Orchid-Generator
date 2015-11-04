import webgl from 'js/core/Webgl';
import loop from 'js/core/Loop';
import props from 'js/core/props';
import Flower from 'js/components/Flower';
import Pollen from 'js/components/Pollen';
import Stem from 'js/components/Stem';


// ##
// INIT
webgl.init();
document.body.appendChild( webgl.dom );
// - Add object update to loop
loop.add(webgl._binds.onUpdate);

// ##
// GUI
let gui = new dat.GUI();
gui.close();

// ##
// LIGHT
let ambient = new THREE.PointLight( 0xffffff, 1, 100 );
ambient.position.set(1,10,10);
webgl.add( ambient );

// ##
// FLOWER
let flower = new Flower();
flower.init(() => {
	webgl.add(flower.flowerObject);
	loop.add(flower._binds.onUpdate);
});

// - pollen
// let pollen = new Pollen();
// webgl.add(pollen.pollenMesh);
// loop.add(pollen._binds.onUpdate);

// ##
// RENDERER
loop.start();


// ##
// ON RESIZE
window.addEventListener( "resize", () => {
	webgl._binds.onResize();
}, false );