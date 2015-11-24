uniform mat4 oldModelMatrix;



void main() {

  // Definition of modelMatrix
  mat4 distModelMatrix = ( modelMatrix - oldModelMatrix ) * (-2.0);

  gl_Position =  projectionMatrix *
                 viewMatrix * ( oldModelMatrix + distModelMatrix ) *
                 vec4( position ,1.0);
}
