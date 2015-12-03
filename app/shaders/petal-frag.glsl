uniform sampler2D petalMap;
varying vec2 vUv;

void main() {
	vec4 petalTexture = texture2D( petalMap, vUv );
  gl_FragColor = petalTexture;
}
