import props from 'js/core/props';

import pistilVert from 'shaders/pistil-vert';
import pistilFrag from 'shaders/pistil-frag';


class Pistil extends THREE.Object3D {
	constructor(orientation){
		super();

		// ##
		// INIT
		this.POZ = new THREE.Vector3(0, 0.03, -0.02 );
		this.ROTATION = new THREE.Euler(-this._getRandomFloat(0.5, 1), 0.5 - (orientation/2), 0 );
		// - var
		this.segments = 32;
		this.radiusSegment = 32;
		this.size = 0.1;
		this.length = this._getRandomFloat(5, 12);
		this.curve = this._getRandomFloat(1, 3);

		this.curve = this._createCustomCurve();
		this.pistilHeadPosition = this.curve.getPoints()[this.curve.getPoints().length-1];

		// - STEM
		// -- geometry
		this.pistilStemGeometry = new THREE.TubeGeometry( this.curve, this.segments, this.size, this.radiusSegment/2 );
		// -- material
		this.stemShaderMaterial = new THREE.ShaderMaterial({
			uniforms : {
				rotationForceMatrix : { type : 'm4', value : new THREE.Matrix4() },
				windForceMatrix : { type : 'm4', value : new THREE.Matrix4() }
			},
			vertexShader: pistilVert,
			fragmentShader: pistilFrag
		});
		// -- mesh
		this.pistilStemMesh = new THREE.Mesh( this.pistilStemGeometry, this.stemShaderMaterial );

		// - HEAD
		// -- pistilHead geometry/mesh
		this.pistilHeadGeometry = new THREE.SphereGeometry( this.size*5, this.radiusSegment, this.segment );
		// -- material
		this.headMaterial = new THREE.MeshBasicMaterial({color: 0x000000});
		// -- mesh
		this.pistilHeadMesh = new THREE.Mesh( this.pistilHeadGeometry, this.headMaterial );
		this.pistilHeadObject = new THREE.Object3D();
		this.pistilHeadObject.add(this.pistilHeadMesh);
		// -- position
		this.pistilHeadMesh.position.copy(this.pistilHeadPosition);

		// PISTIL (STEM + HEAD )
		this.pistilMesh = new THREE.Object3D();
		this.pistilMesh.add(this.pistilStemMesh);
		this.pistilMesh.add(this.pistilHeadObject);

		// ##
		// INIT POSITION & SIZE
		this.pistilMesh.scale.set(0,0,0);
		this.pistilMesh.position.copy(this.POZ);
		this.pistilMesh.rotation.copy(this.ROTATION);

		// ##
		// SAVE BINDING
		this._binds = {};
		this._binds.onUpdate = this._onUpdate.bind(this);
	}

	animatePistil(size) {
		let force = ( size - this.pistilMesh.scale.x ) * 0.03;
		this.pistilMesh.scale.addScalar(force);
	}

	_onUpdate(matrixDistRotation, windForce, windForceMatrix) {

		// update shader for Stem
		this.pistilStemMesh.material.uniforms.rotationForceMatrix.value = matrixDistRotation;
		this.pistilStemMesh.material.uniforms.windForceMatrix.value = windForceMatrix;

		// update rotation pistilHead
		this.pistilHeadObject.rotation.setFromVector3(windForce);
	}

	_createCustomCurve(){
		let CustomSinCurve = THREE.Curve.create(
		    function ( length, curve ) { //custom curve constructor
		        this.curve = (curve === undefined) ? 1 : curve;
		        this.length = (length === undefined) ? 1 : length;
		    },
		    function ( t ) { //getPoint: t is between 0-1
		        let tx = 0,
		            ty = Math.sin( t * this.curve ),
		            tz = t * this.length;

		        return new THREE.Vector3(tx, ty, tz);
		    }
		);
		return new CustomSinCurve(this.length, this.curve);
	}

	_getRandomFloat(min, max) {
        return Math.random() * (max - min) + min;
	}
}

module.exports = Pistil;
