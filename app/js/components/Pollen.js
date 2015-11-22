import props from 'js/core/props';

import flexibilityVert from 'shaders/flexibility-vert';
import flexibilityFrag from 'shaders/flexibility-frag';

class Pollen extends THREE.Object3D {
	constructor(orientation){
		super();

		// ##
		// INIT
		this.SCALE = new THREE.Vector3(0.03, 0.03, 0.03 );
		this.POZ = new THREE.Vector3(-0.09, -0.15, 0.275 );
		this.ROTATION = new THREE.Vector3(-this.getRandomFloat(0.5, 1), 0.5 - (orientation/2), 0 );
		// - bool
		this.isSeed = false;
		this.growing = false;
		// - var
		this.segments = 32;
		this.radiusSegment = 32;
		this.size = 0.1;
		this.length = this.getRandomFloat(5, 12);
		this.curve = this.getRandomFloat(1, 3);

		this.curve = this.createCustomCurve();
		this.pollenHeadPosition = this.curve.getPoints()[this.curve.getPoints().length-1];

		// - pollenStem geometry/mesh
		this.materialStem = new THREE.MeshLambertMaterial( { color: 0x72b662 } );
		this.materialStemShader = new THREE.ShaderMaterial({
    	vertexShader: flexibilityVert,
    	fragmentShader: flexibilityFrag
    });

		this.pollenStemGeometry = new THREE.TubeGeometry( this.curve, this.segments, this.size, this.radiusSegment/2 );
		this.pollenStemMesh = new THREE.Mesh( this.pollenStemGeometry, this.materialStemShader );
		// - pollenHead geometry/mesh
		this.materialHead = new THREE.MeshLambertMaterial( { color: 0x413a31 } );
		this.pollenHeadGeometry = new THREE.SphereGeometry( this.size*5, this.radiusSegment, this.segment );
		this.pollenHeadMesh = new THREE.Mesh( this.pollenHeadGeometry, this.materialHead );
		this.pollenHeadMesh.position.set(this.pollenHeadPosition.x, this.pollenHeadPosition.y, this.pollenHeadPosition.z)
		// -- pollen
		this.pollenMesh = new THREE.Object3D();
		this.pollenMesh.add(this.pollenHeadMesh);
		this.pollenMesh.add(this.pollenStemMesh);

		// ##
		// INIT POSITION & SIZE
		this.pollenMesh.position.set(this.POZ.x,this.POZ.y,this.POZ.z);
		this.pollenMesh.rotation.set(this.ROTATION.x, this.ROTATION.y, this.ROTATION.z);

		// ##
		// SAVE BINDING
		this._binds = {};
		this._binds.onUpdate = this._onUpdate.bind(this);
	}

	toSeed() {
		this.pollenMesh.scale.set(0,0,0);
		this.isSeed = true;
	}

	grow() {
		let scaleDist = this.SCALE.x - this.pollenMesh.scale.x;
		let mouv = this.pollenMesh.scale.x + scaleDist*0.02;
		this.pollenMesh.scale.set(mouv,mouv,mouv)
	}

	_onUpdate() {
		if(this.growing){
			this.grow();
		}
	}

	createCustomCurve(){
		let CustomSinCurve = THREE.Curve.create(
		    function ( length, curve ) { //custom curve constructor
		        this.curve = (curve === undefined) ? 1 : curve;
		        this.length = (length === undefined) ? 1 : length;
		    },
		    function ( t ) { //getPoint: t is between 0-1
		        var tx = 0,
		            ty = Math.sin( t * this.curve ),
		            tz = t * this.length;

		        return new THREE.Vector3(tx, ty, tz);
		    }
		);
		return new CustomSinCurve(this.length, this.curve);
	}

	getRandomFloat(min, max) {
        return Math.random() * (max - min) + min;
	}
}

module.exports = Pollen;
