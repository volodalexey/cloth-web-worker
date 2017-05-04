#version 300 es
precision mediump float;

in vec3 coordinates;
out float fInfluenced;

void main(void) {
  fInfluenced = coordinates.z;
  gl_Position = vec4(coordinates.x, coordinates.y, 0.0, 1.0);
}