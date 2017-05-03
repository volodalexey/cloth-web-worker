#version 300 es
precision mediump float;

in vec4 aPos;

void main(void) {
   gl_PointSize = 20.;
   gl_Position = vec4(-aPos.x, aPos.yzw);
}