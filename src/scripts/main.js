let state;

function setDefaultState() {
    state = {
        model: Cube(1, 0, 0),

        transform: {
            scale: [1, 1, 1],
        },

        view: {
            rotation: 60,
            radius: 0.1
        },

        enableShader: true,
        enableAnimation: true,
    }
}

function setListeners() {
    document.getElementById("reset").addEventListener("click", () => {
        setDefaultState();
    });

    document.getElementById("scalingX").addEventListener("input", (event) => {
        state.transform.scale[0] = event.target.value;
    });

    document.getElementById("scalingY").addEventListener("input", (event) => {
        state.transform.scale[1] = event.target.value;
    });

    document.getElementById("scalingZ").addEventListener("input", (event) => {
        state.transform.scale[2] = event.target.value;
    });

    document.getElementById("isShadingOn").addEventListener("change", (event) => {
        state.enableShader = event.target.checked;
    });
}

function setTransformMatrix() {
    let Tmatrix;

    Tmatrix = scaleMatrix(state.transform.scale[0], state.transform.scale[1], state.transform.scale[2]);

    return Tmatrix;
}

function setViewMatrix() {
    let Vmatrix;

    Vmatrix = rotateMatrix(0, state.view.rotation * Math.PI / 180, 0);
    Vmatrix = multiply(Vmatrix, translationMatrix(0, 0, state.view.radius));
    Vmatrix = inverse(Vmatrix);

    Vmatrix[14] = Vmatrix[14] - 2;
    return Vmatrix;
}

function main() {
    setListeners();
    document.getElementById("reset").click();

    let canvas = document.getElementById("canvas");
    let gl = canvas.getContext("webgl");
    if (!gl) {
        console.log("No rendering context for WebGL");
        return;
    } else {
        console.log("Rendering context for WebGL is obtained");
    }
    
    const flatShaderProgram = createProgram(gl, vertexShaderFlat, fragmentShaderFlat);
    const lightShaderProgram = createProgram(gl, vertexShaderLight, fragmentShaderLight);
    
    window.requestAnimationFrame(render);
    
    function render() {
        const vertexBuffer = createArrayBuffer(gl, state.model.exportVertexBuffer());
        const colorBuffer = createArrayBuffer(gl, state.model.exportColorBuffer());
        const indexBuffer = createElementBuffer(gl, state.model.exportIndexBuffer());
        
        let shaderProgram;
        if (state.enableShader) {
            shaderProgram = lightShaderProgram;
        } else {
            shaderProgram = flatShaderProgram;
        }

        let Pmatrix = gl.getUniformLocation(shaderProgram, "Pmatrix");
        let Tmatrix = gl.getUniformLocation(shaderProgram, "Tmatrix");

        bindAttribute(gl, shaderProgram, vertexBuffer, "position");
        bindAttribute(gl, shaderProgram, colorBuffer, "color");
        
        gl.useProgram(shaderProgram);
        enableDepth(gl);
        
        let proj_matrix = get_projection(45, canvas.width / canvas.height, 1, 100);
        let transform_matrix = setTransformMatrix();
        let view_matrix = setViewMatrix();
        proj_matrix = multiply(proj_matrix, view_matrix);
        
        gl.viewport(0.0, 0.0, canvas.width, canvas.height);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.uniformMatrix4fv(Pmatrix, false, proj_matrix);
        gl.uniformMatrix4fv(Tmatrix, false, transform_matrix);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
        gl.drawElements(gl.TRIANGLES, state.model.exportIndexBuffer().length, gl.UNSIGNED_SHORT, 0);
        
        window.requestAnimationFrame(render);
    }
}

main();