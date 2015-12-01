varying vec2 vUv;
uniform sampler2D flexibilityMap;
uniform mat4 oldModelMatrix;

void main() {
	vUv = uv;

	vec4 flexTexture = texture2D( flexibilityMap, vUv );
	mat4 distModelMatrix = ( modelMatrix - oldModelMatrix ) * ( flexTexture.x * (3.0) );

  gl_Position = projectionMatrix *
                viewMatrix * ( oldModelMatrix + distModelMatrix ) *
                vec4(position,1.0);
}
