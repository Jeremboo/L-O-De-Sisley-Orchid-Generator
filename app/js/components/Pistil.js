import props from 'js/core/props';

import pistilVert from 'shaders/pistil-vert';
import pistilFrag from 'shaders/pistil-frag';


class Pistil extends THREE.Object3D {
	constructor(orientation, color){
		super();

		// ##
		// INIT
		this.POZ = new THREE.Vector3(0, 0.03, -0.02 );
		this.ROTATION = new THREE.Euler(-this._getRandomFloat(0.5, 1), 0.5 - (orientation/2), 0 );
		// - var
		this.segments = 32;
		this.radiusSegment = 32;
		this.size = 0.1;
		this.color = color;
		this.scalePistilOpened = 0.035;

		this.length = this._getRandomFloat(5, 12);
		this.curve = this._createCustomCurve();
		this.pistilHeadPosition = this.curve.getPoints()[this.curve.getPoints().length-1];

		// - STEM
		// -- geometry
		this.pistilStemGeometry = new THREE.TubeGeometry( this.curve, this.segments, this.size, this.radiusSegment/2 );
		// -- material
		this.stemShaderMaterial = new THREE.ShaderMaterial({
			uniforms : {
				rotationForceMatrix : { type : 'm4', value : new THREE.Matrix4() },
				windForceMatrix : { type : 'm4', value : new THREE.Matrix4() },
				color : {type : "v4", value : this.color },
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
		this.add(this.pistilStemMesh);
		this.add(this.pistilHeadObject);

		// ##
		// INIT POSITION & SIZE
		this.scale.set(0.0001, 0.0001, 0.0001);
		this.position.copy(this.POZ);
		this.rotation.copy(this.ROTATION);

		// ##
    // MEDIATOR LISTENER
    mediator.subscribe("onGrow", () => {
      this._onGrow();
    });
    mediator.subscribe("onToSeed", () => {
      this._onToSeed();
    });
	}

	animatePistil(size) {
		let force = ( size - this.scale.x ) * 0.03;
		this.scale.addScalar(force);
	}

	updateColor(newColor){
		this.pistilStemMesh.material.uniforms.color.value = newColor;
	}

	onUpdate(matrixDistRotation, windForce, windForceMatrix) {

		// update shader for Stem
		this.pistilStemMesh.material.uniforms.rotationForceMatrix.value = matrixDistRotation;
		this.pistilStemMesh.material.uniforms.windForceMatrix.value = windForceMatrix;

		// update rotation pistilHead
		this.pistilHeadObject.rotation.setFromVector3(windForce);
	}

	_onGrow(){
		this.animatePistil(this.scalePistilOpened);
  }
  _onToSeed(){
		this.animatePistil(0);
  }

	// FCTS UTILS
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
