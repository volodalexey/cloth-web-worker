precision mediump float;

varying float fInfluenced;

void main(void) {
  if (fInfluenced == 1.0) {
    gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
  } else {
    gl_FragColor = vec4(0.333333333, 0.333333333, 0.333333333, 1.0);
  }
}