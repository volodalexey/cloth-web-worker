precision mediump float;

varying float fCaptured;

void main(void) {
  if (fCaptured == 1.0) {
    gl_FragColor = vec4(0.0, 0.0, 1.0, 1.0);
  } else {
    gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
  }
}