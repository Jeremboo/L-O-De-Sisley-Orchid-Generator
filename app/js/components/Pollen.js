import props from 'js/core/props';

import pollenVert from 'shaders/pollen-vert';
import pollenFrag from 'shaders/pollen-frag';

class Pollen extends THREE.Object3D {
	constructor(){
		super();

		// ##
		// INIT
		this.SCALE = {
			x : 0.03,
			y : 0.03,
			z : 0.03
		};
		this.POZ = {
			x : -0.09,
			y : -0.15,
			z : 0.275
		};
		// - var
		this.segments = 32;
		this.radiusSegment = 32;
		this.size = 0.1;
		this.length = this.getRandomFloat(5, 12);
		this.curve = this.getRandomFloat(1, 3);

		this.curve = this.createCustomCurve(); 
		this.pollenHeadPosition = this.curve.getPoints()[this.curve.getPoints().length-1];

		// - pollenStem geometry/mesh
		// this.materialStem = new THREE.MeshLambertMaterial( { color: 0x72b662 } );
		this.materialStem = new THREE.ShaderMaterial( { vertexShader : pollenVert , fragmentShader : pollenFrag } );

		this.pollenStemGeometry = new THREE.TubeGeometry( this.curve, this.segments, this.size, this.radiusSegment/2 );
		this.pollenStemMesh = new THREE.Mesh( this.pollenStemGeometry, this.materialStem );	
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
		this.pollenMesh.scale.set(0,0,0);
		this.pollenMesh.position.set(this.POZ.x,this.POZ.y,this.POZ.z);
		this.pollenMesh.rotation.x = -this.getRandomFloat(0.5, 1);


		// ##
		// SAVE BINDING
		this._binds = {};
		this._binds.onUpdate = this._onUpdate.bind(this);
	}

	orientation(or) {
		this.pollenMesh.rotation.y = 0.5-(or/2);
	}

	_onUpdate() {
		let scaleDist = this.SCALE.x - this.pollenMesh.scale.x;
		if(scaleDist > 0.001) {
			let mouv = this.pollenMesh.scale.x + scaleDist*0.02;
			this.pollenMesh.scale.set(mouv,mouv,mouv)
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