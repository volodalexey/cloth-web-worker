#version 300 es
precision mediump float;

in float fInfluenced;
out vec4 fragmentColor;

void main(void) {
  if (fInfluenced == 1.0) {
    fragmentColor = vec4(1.0, 0.0, 0.0, 1.0);
  } else {
    fragmentColor = vec4(0.333333333, 0.333333333, 0.333333333, 1.0);
  }
}