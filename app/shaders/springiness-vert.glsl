varying vec2 vUv;
uniform sampler2D springinessMap;
uniform mat4 rotationForceMatrix;

void main() {
	vUv = uv;

	vec4 flexTexture = texture2D( springinessMap, vUv );


	vec4 targetPos = vec4(position, 1.0) * rotationForceMatrix;
	vec4 oldPos = vec4(position, 1.0);

	vec4 pos = oldPos + ( (targetPos - oldPos) * flexTexture.x ) ;


	gl_Position = projectionMatrix *
                modelViewMatrix *
                pos;
}
