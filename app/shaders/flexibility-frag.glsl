varying vec2 vUv;

void main() {
  gl_FragColor = vec4(vUv.x, vUv.x, vUv.x, 1.0);
}
