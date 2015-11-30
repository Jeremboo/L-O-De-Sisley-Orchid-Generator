varying vec2 vUv;
uniform mat4 oldModelMatrix;

void main() {
	vUv = uv;

  // Definition of modelMatrix
  mat4 distModelMatrix = ( modelMatrix - oldModelMatrix )*(1.0 - (uv.x * 2.0));

  gl_Position =  projectionMatrix *
                 viewMatrix * ( oldModelMatrix + distModelMatrix ) *
                 vec4( position ,1.0);
}
