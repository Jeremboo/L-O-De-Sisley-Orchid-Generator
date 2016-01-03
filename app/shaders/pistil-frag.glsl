uniform float transitionValue;

uniform vec4 color;
uniform vec4 newColor;

varying vec2 vUv;

void main() {
  vec4 mColor;

  float vel = 1.0 - vUv.x;

  if(vel <= transitionValue){
    mColor = color;
	} else {
    mColor = newColor;
	}

	gl_FragColor = vec4(vel, vel, vel, 1.0) * mColor;
}
