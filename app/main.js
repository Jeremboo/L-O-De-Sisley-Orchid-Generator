import webgl from 'js/core/Webgl';
import loop from 'js/core/Loop';
import props from 'js/core/props';
import Petal from 'js/components/Petal';
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
gui.add(props, 'zoom', 1, 100);
gui.close();

// ##
// EXEMPLE LIGHT
let light = new THREE.DirectionalLight( 0xffffff, 0.5 );
light.position.set(1, 0, 1);
webgl.add(light);

let ambient = new THREE.AmbientLight( 0x444444 );
webgl.add( ambient );

let directionalLight = new THREE.DirectionalLight( 0xffeedd );
directionalLight.position.set( 1, 0, 1 ).normalize();
webgl.add( directionalLight );

// ##
// FLOWER
let petal = new Petal();
petal.init(() => {
	webgl.add(petal.petalObject);
	loop.add(petal._binds.onUpdate);
});
// let stem = new Stem();
// webgl.add(stem.stemMesh);
// loop.add(stem._binds.onUpdate);

// ##
// RENDERER
loop.start();


// ##
// ON RESIZE
window.addEventListener( "resize", () => {
	webgl._binds.onResize();
}, false );