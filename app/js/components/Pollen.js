import props from 'js/core/props';

class Stem extends THREE.Object3D {
	constructor(){
		super();

		// ##
		// INIT
		// - var
		this.segments = 32;
		this.radiusSegment = 32;
		this.size = 0.1;
		this.length = this.getRandomFloat(1, 8);
		this.curve = this.getRandomFloat(1, 3);

		this.curve = this.createCustomCurve(); 
		this.pollenHeadPosition = this.curve.getPoints()[this.curve.getPoints().length-1];

		// - pollenStem geometry/mesh
		this.materialStem = new THREE.MeshPhongMaterial( { color: 0x72b662, specular: 0x009900, shininess: 30, shading: THREE.FlatShading } );
		this.pollenStemGeometry = new THREE.TubeGeometry( this.curve, this.segments, this.size, this.radiusSegment/2 );
		this.pollenStemMesh = new THREE.Mesh( this.pollenStemGeometry, this.materialStem );	
		// - pollenHead geometry/mesh
		this.materialHead = new THREE.MeshPhongMaterial( { color: 0x413a31, specular: 0x996842, shininess: 30, shading: THREE.FlatShading } );
		this.pollenHeadGeometry = new THREE.SphereGeometry( this.size*5, this.radiusSegment, this.segment );
		this.pollenHeadMesh = new THREE.Mesh( this.pollenHeadGeometry, this.materialHead );	
		this.pollenHeadMesh.position.set(this.pollenHeadPosition.x, this.pollenHeadPosition.y, this.pollenHeadPosition.z)	
		// -- pollen
		this.pollenMesh = new THREE.Object3D();
		this.pollenMesh.add(this.pollenHeadMesh);
		this.pollenMesh.add(this.pollenStemMesh);
		this.pollenMesh.rotation.x = -this.getRandomFloat(0.5, 1.3);


		// ##
		// SAVE BINDING
		this._binds = {};
		this._binds.onUpdate = this._onUpdate.bind(this);
	}

	_onUpdate() {

			
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

module.exports = Stem;