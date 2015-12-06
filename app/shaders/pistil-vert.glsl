varying vec2 vUv;
uniform mat4 rotationForceMatrix;
uniform mat4 windForceMatrix;

void main() {
	vUv = uv;

	float vel = 1.0 - vUv.x;

	vec4 oldPos = vec4(position, 1.0);

	vec4 targetPos = vec4(position, 1.0) * rotationForceMatrix;
	vec4 pos = oldPos + ( (targetPos - oldPos) * vel );

	vec4 targetPos2 = pos * windForceMatrix;
	vec4 pos2 = pos + ( ( targetPos2 - pos ) * vUv.x );

	gl_Position = projectionMatrix *
	              modelViewMatrix *
	              pos2;
}
