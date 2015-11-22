uniform sampler2D map;
varying vec2 vUv;

void main() {
	// vec4 color = texture2D( map, vUv );
  // gl_FragColor = color;

	vec3 h_color_top = vec3(1.0, 1.0, 1.0);
  gl_FragColor = vec4(vUv.x, vUv.x, vUv.x, 1);
}
