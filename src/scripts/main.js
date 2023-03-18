let vertexShader = 'attribute vec3 position;' +
    'uniform mat4 Pmatrix;' +
    'uniform mat4 Vmatrix;' +
    'uniform mat4 Mmatrix;' +
    'attribute vec3 color;' +
    'varying vec3 vColor;' +

    'void main(void) { ' + 
    'gl_Position = Pmatrix*Vmatrix*Mmatrix*vec4(position, 1.);' +
    'vColor = color;' +
    '}';

let fragmentShader = 'precision mediump float;' +
    'varying vec3 vColor;' +
    'void main(void) {' +
    'gl_FragColor = vec4(vColor, 1.);' +
    '}';

function main() {
    let canvas = document.getElementById("canvas");
    let gl = canvas.getContext("webgl");
    if (!gl) {
        console.log("No rendering context for WebGL");
        return;
    } else {
        console.log("Rendering context for WebGL is obtained");
    }
    
    const cube = Cube(1, 0, 0);
    const shaderProgram = createProgram(gl, vertexShader, fragmentShader);

    const vertexBuffer = createArrayBuffer(gl, cube.exportVertexBuffer());
    const colorBuffer = createArrayBuffer(gl, cube.exportColorBuffer());
    const indexBuffer = createElementBuffer(gl, cube.exportIndexBuffer());

    bindAttribute(gl, shaderProgram, vertexBuffer, "position");
    bindAttribute(gl, shaderProgram, colorBuffer, "color");

    gl.useProgram(shaderProgram);
    enableDepth(gl);

    let Pmatrix = gl.getUniformLocation(shaderProgram, "Pmatrix");
    let Vmatrix = gl.getUniformLocation(shaderProgram, "Vmatrix");
    let Mmatrix = gl.getUniformLocation(shaderProgram, "Mmatrix");

    let proj_matrix = get_projection(45, canvas.width / canvas.height, 1, 100);
    let movement_matrix = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
    let view_matrix = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
    view_matrix[14] = view_matrix[14] - 2;

    gl.viewport(0.0, 0.0, canvas.width, canvas.height);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.uniformMatrix4fv(Pmatrix, false, proj_matrix);
    gl.uniformMatrix4fv(Vmatrix, false, view_matrix);
    gl.uniformMatrix4fv(Mmatrix, false, movement_matrix);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.drawElements(gl.TRIANGLES, cube.exportIndexBuffer().length, gl.UNSIGNED_SHORT, 0);

    let old_time = 0;
    let animate = function(new_time) {
        // The base for the rotation is the current time because time has a constant speed
        let time_difference = new_time - old_time;
        rotateZ(movement_matrix, time_difference * 0.0005);
        rotateY(movement_matrix, time_difference * 0.0002);
        rotateX(movement_matrix, time_difference * 0.0003);
        old_time = new_time;

        enableDepth(gl);

        // Setting the viewport and the projection matrix. Then the objects are drawn and animated
        gl.viewport(0.0, 0.0, canvas.width, canvas.height);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.uniformMatrix4fv(Pmatrix, false, proj_matrix);
        gl.uniformMatrix4fv(Vmatrix, false, view_matrix);
        gl.uniformMatrix4fv(Mmatrix, false, movement_matrix);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
        gl.drawElements(gl.TRIANGLES, cube.exportIndexBuffer().length, gl.UNSIGNED_SHORT, 0);

        window.requestAnimationFrame(animate);
    }
    animate(0);
}

main();