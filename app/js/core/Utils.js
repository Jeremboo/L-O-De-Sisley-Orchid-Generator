
class Utils {
	constructor(){}

	traverseArr(arr, fct) {
		let i = 0,
			  l = arr.length;
		for ( i ; i < l ; i++) {
			fct(arr[i]);
		}
	}

	getRotationMatrix(vectRotation) {
		let m = new THREE.Matrix4();
		let m1 = new THREE.Matrix4();
		let m2 = new THREE.Matrix4();
		let m3 = new THREE.Matrix4();

		m1.makeRotationX( -vectRotation.x );
		m2.makeRotationY( -vectRotation.y );
		m3.makeRotationY( -vectRotation.z );

		m.multiplyMatrices( m1, m2 );
		m.multiply( m3 );

		return m;
	}

	easing(target, value, params){
		let vel = params.vel || 0.03;
		let f = ( target - value ) * vel;
		params.update(f);
		if(Math.abs(f) < 0.001){
			if(params.callback){
				params.callback();
			}
		}
	}

	getVec4Color(color){
    let r = color[0]/256;
    let g = color[1]/256;
    let b = color[2]/256;
		let v4 = new THREE.Vector4(r,g,b,1);
    return v4;
	}

	getXBetweenTwoNumbers(min, max, x){
    return min + ( x * ( (max - min)/10 ));
  }

	getRandomFloat(min, max) {
				return Math.random() * (max - min) + min;
	}
}

module.exports = new Utils();
