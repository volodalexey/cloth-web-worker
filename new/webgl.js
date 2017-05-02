class WebGL {

  static initShader(gl, type, source) {
    let shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    let compiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (!compiled) {
      let error = gl.getShaderInfoLog(shader);
      gl.deleteShader(shader);
      throw error;
    }
    return shader
  }

  static initWebGL(gl, vertexShaderText, fragmentShaderText) {
    let
      vertexShader = WebGL.initShader(gl, gl.VERTEX_SHADER, vertexShaderText),
      fragmentShader = WebGL.initShader(gl, gl.FRAGMENT_SHADER, fragmentShaderText),
      shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);
    gl.useProgram(shaderProgram);
    return shaderProgram
  }

  static getAttribute(gl, program, attribute) {
    let a_attribute = gl.getAttribLocation(program, attribute);
    if (a_attribute < 0) {
      throw new Error();
    }
    return a_attribute
  }

  static getUniform(gl, program, attribute) {
    let u_uniform = gl.getUniformLocation(program, attribute);
    if (u_uniform < 0) {
      throw new Error();
    }
    return u_uniform
  }

  static initArrayBuffer(gl, program, attribute, data, type, num) {
    let buffer = gl.createBuffer();
    if (!buffer) {
      throw new Error();
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);

    let a_attribute = WebGL.getAttribute(gl, program, attribute);

    gl.vertexAttribPointer(a_attribute, num, type, false, 0, 0);
    gl.enableVertexAttribArray(a_attribute);
  }

  static initElementArrayBuffer(gl, data) {
    let buffer = gl.createBuffer();
    if (!buffer) {
      throw new Error();
    }
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, data, gl.STATIC_DRAW);
  }

  static drawFrame(gl, canvas, length) {
    gl.clearColor(1, 1, 1, 1);
    gl.enable(gl.DEPTH_TEST);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.viewport(0, 0, canvas.canvas_width, canvas.canvas_height);
    // gl.drawElements(gl.LINES, length, gl.UNSIGNED_SHORT, 0);
    // gl.drawElements(gl.LINE_STRIP, length, gl.UNSIGNED_SHORT, 0);
    // gl.drawElements(gl.TRIANGLES, length, gl.UNSIGNED_SHORT, 0);
    gl.drawArrays(gl.TRIANGLES, 0, length/3);
  }

  static initMatrices(gl, program) {
    return [
      WebGL.getUniform(gl, program, 'u_ModelMatrix'),
      WebGL.getUniform(gl, program, 'u_MvpMatrix'),
      WebGL.getUniform(gl, program, 'u_NormalMatrix'),
      WebGL.getUniform(gl, program, 'u_LightColor'),
      WebGL.getUniform(gl, program, 'u_LightPosition'),
      WebGL.getUniform(gl, program, 'u_AmbientLight'),
    ]
  }

  static translateCoord(coordinate, half) {
    return (coordinate - half) / half;
  }
}