uniform sampler2D petalMap;
uniform vec4 textureBackgroundColor;
varying vec2 vUv;

void main() {
	vec4 petalTexture = texture2D( petalMap, vUv );
  gl_FragColor = ( petalTexture * 2.0 ) * textureBackgroundColor;
}
