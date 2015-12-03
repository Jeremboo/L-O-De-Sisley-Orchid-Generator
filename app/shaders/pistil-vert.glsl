varying vec2 vUv;
uniform mat4 rotationForceMatrix;

void main() {
	vUv = uv;

	float vel = 1.0 - vUv.x;

	vec4 targetPos = vec4(position, 1.0) * rotationForceMatrix;
	vec4 oldPos = vec4(position, 1.0);

	vec4 pos = oldPos + ( (targetPos - oldPos) * vel ) ;

	gl_Position = projectionMatrix *
	                modelViewMatrix *
	                pos;
}
