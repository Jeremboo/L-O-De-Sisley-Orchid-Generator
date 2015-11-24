varying vec2 vUv;
 uniform mat4 oldModelMatrix;



void main() {
	vUv = uv;

  // Definition of modelMatrix
  //vec4 distModelMatrix = ( oldModelMatrix * modelMatrix );

  vec4 oldPosition = projectionMatrix *
                viewMatrix * oldModelMatrix *
                vec4( position ,1.0);

  vec4 newPosition = projectionMatrix *
                     modelViewMatrix *
                    vec4( position , 1.0 );

  //vec4 render = ( newPosition - oldPosition ) * vec4(uv.x, uv.x, uv.x, uv.x );

  gl_Position = oldPosition;
  //gl_Position = render;
}
