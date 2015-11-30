
/**
 * Set the colour to a lovely pink.
 * Note that the color is a 4D Float
 * Vector, R,G,B and A and each part
 * runs from 0.0 to 1.0
 */

uniform sampler2D petalMap;
varying vec2 vUv;

void main() {
	vec4 petalTexture = texture2D( petalMap, vUv );
  gl_FragColor = petalTexture;
}
