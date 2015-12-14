uniform sampler2D petalMap;
uniform sampler2D petalRacineMap;
uniform vec4 backgroundColor;
varying vec2 vUv;

void main() {
	vec4 petalTexture = texture2D( petalMap, vUv );
	vec4 petalRacineTexture = texture2D( petalRacineMap, vUv );

	vec4 petalColored = ( petalTexture * 2.0 ) * backgroundColor;

	gl_FragColor = vec4( mix( petalColored.rgb, petalRacineTexture.rgb, petalRacineTexture.a ), 1.0 );
}
