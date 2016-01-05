uniform sampler2D petalMap;
uniform sampler2D transitionMap;
uniform float transitionValue;

uniform sampler2D petalPatternMap;
uniform vec4 backgroundColor;

uniform sampler2D newPetalPatternMap;
uniform vec4 newBackgroundColor;

varying vec2 vUv;


void main() {
  vec4 petalPatternTexture;
  vec4 petalColored;

  vec4 petalTexture = texture2D(petalMap, vUv);
  vec4 transitionTexture = texture2D(transitionMap, vUv);

  if (transitionTexture.r <= transitionValue) {
    petalPatternTexture = texture2D(petalPatternMap, vUv);
    petalColored = petalTexture * backgroundColor;
  } else {
    petalPatternTexture = texture2D(newPetalPatternMap, vUv);
    petalColored = petalTexture * newBackgroundColor;
  }

  gl_FragColor = vec4(mix(petalColored.rgb, petalPatternTexture.rgb, petalPatternTexture.a), 1.0);
}
