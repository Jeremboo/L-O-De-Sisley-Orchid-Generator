import props from 'js/core/props';

import pistilVert from 'shaders/pistil-vert';
import pistilFrag from 'shaders/pistil-frag';


class Pistil extends THREE.Object3D {
	constructor(orientation){
		super();

		// ##
		// INIT
		this.SCALE = new THREE.Vector3(0.03, 0.03, 0.03 );
		this.POZ = new THREE.Vector3(0, 0.03, -0.02 );
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
		this.pistilHeadMesh.position.set( this.pistilHeadPosition.x, this.pistilHeadPosition.y, this.pistilHeadPosition.z);

		// PISTIL (STEM + HEAD )
		this.pistilMesh = new THREE.Object3D();
		this.pistilMesh.add(this.pistilStemMesh);
		this.pistilMesh.add(this.pistilHeadObject);

		// ##
		// INIT POSITION & SIZE
		this.pistilMesh.position.set(this.POZ.x,this.POZ.y,this.POZ.z);
		this.pistilMesh.rotation.set(this.ROTATION.x, this.ROTATION.y, this.ROTATION.z);

		// ##
		// SAVE BINDING
		this._binds = {};
		this._binds.onUpdate = this._onUpdate.bind(this);
	}

	toSeed() {
		this.pistilMesh.scale.set(0,0,0);
		this.isSeed = true;
	}

	grow() {
		let scaleDist = this.SCALE.x - this.pistilMesh.scale.x;
		let mouv = this.pistilMesh.scale.x + scaleDist*0.02;
		this.pistilMesh.scale.set(mouv,mouv,mouv)
	}

	_onUpdate(matrixDistRotation, windForce, windForceMatrix) {
		if(this.growing){
			this.grow();
		}

		// update shader
		this.pistilStemMesh.material.uniforms.rotationForceMatrix.value = matrixDistRotation;
		this.pistilStemMesh.material.uniforms.windForceMatrix.value = windForceMatrix;

		// update rotation pistilHead
		this.pistilHeadObject.rotation.setFromVector3(windForce);
	}

	createCustomCurve(){
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

	getRandomFloat(min, max) {
        return Math.random() * (max - min) + min;
	}
}

module.exports = Pistil;
