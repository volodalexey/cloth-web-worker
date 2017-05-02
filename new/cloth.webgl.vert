precision mediump float;

attribute vec3 coordinates;
varying float fInfluenced;

void main(void) {
  fInfluenced = coordinates.z;
  gl_Position = vec4(vec2(coordinates), 0.0, 1.0);
}