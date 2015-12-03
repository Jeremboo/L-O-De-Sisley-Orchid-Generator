varying vec2 vUv;

void main() {
  float vel = 1.0 - vUv.x;
  
	 gl_FragColor = vec4(vel, vel, vel, 1.0);
}
