precision mediump float;

attribute vec3 coordinates;
varying float fCaptured;

void main(void) {
  fCaptured = coordinates.z;
  gl_Position = vec4(vec2(coordinates), 0.0, 1.0);
}