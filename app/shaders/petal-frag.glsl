uniform sampler2D petalMap;
uniform sampler2D petalPatternMap;
uniform vec4 backgroundColor;
varying vec2 vUv;

void main() {
	vec4 petalTexture = texture2D( petalMap, vUv );
	vec4 petalPatternTexture = texture2D( petalPatternMap, vUv );

	vec4 petalColored = ( petalTexture * 2.0 ) * backgroundColor;

	gl_FragColor = vec4( mix( petalColored.rgb, petalPatternTexture.rgb, petalPatternTexture.a ), 1.0 );
}
