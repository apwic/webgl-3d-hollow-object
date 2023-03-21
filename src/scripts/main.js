let state;

function setDefaultState() {
    state = {
        model: Triangles(1, 1, 1),

        transform: {
            scale: {
                x: 1,
                y: 1,
                z: 1
            },
            rotation: {
                x: 0,
                y: 0,
                z: 0
            },
            translation: {
                x: 0,
                y: 0,
                z: 0
            }
        },

        view: {
            rotation: 180,
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

    document.getElementById("rotationX").addEventListener("input", (event) => {
        state.transform.rotation.x = Math.round(event.target.value);
    });

    document.getElementById("rotationY").addEventListener("input", (event) => {
        state.transform.rotation.y = Math.round(event.target.value);
    });

    document.getElementById("rotationZ").addEventListener("input", (event) => {
        state.transform.rotation.z = Math.round(event.target.value);
    });

    document.getElementById("translationX").addEventListener("input", (event) => {
        state.transform.translation.x = event.target.value;
    });

    document.getElementById("translationY").addEventListener("input", (event) => {
        state.transform.translation.y = event.target.value;
    });

    document.getElementById("translationZ").addEventListener("input", (event) => {
        state.transform.translation.z = event.target.value;
    });

    document.getElementById("scalingX").addEventListener("input", (event) => {
        state.transform.scale.x = event.target.value;
    });

    document.getElementById("scalingY").addEventListener("input", (event) => {
        state.transform.scale.y = event.target.value;
    });

    document.getElementById("scalingZ").addEventListener("input", (event) => {
        state.transform.scale.z = event.target.value;
    });

    document.getElementById("isShadingOn").addEventListener("change", (event) => {
        state.enableShader = event.target.checked;
    });

    document.getElementById("isAnimationOn").addEventListener("change", (event) => {
        state.enableAnimation = event.target.checked;
    });
}

function setTransformMatrix() {
    let Tmatrix;

    Tmatrix = scaleMatrix(
        state.transform.scale.x, 
        state.transform.scale.y, 
        state.transform.scale.z);
    Tmatrix = multiply(rotateMatrix(
        state.transform.rotation.x * Math.PI / 180, 
        state.transform.rotation.y * Math.PI / 180, 
        state.transform.rotation.z * Math.PI / 180),
        Tmatrix);
    Tmatrix = multiply(translationMatrix(
        state.transform.translation.x, 
        state.transform.translation.y, 
        state.transform.translation.z),
        Tmatrix);

    return Tmatrix;
}

function setViewMatrix() {
    let Vmatrix;

    Vmatrix = rotateMatrix(0, state.view.rotation * Math.PI / 180, 0);
    Vmatrix = multiply(Vmatrix, translationMatrix(0, 0, state.view.radius));

    // change the zoom level
    Vmatrix[14] = Vmatrix[14] - 2;
    return Vmatrix;
}

function startAnimation(time_difference, rot_x, rot_y, rot_z) {
    state.transform.rotation.x = state.transform.rotation.x > 180? -180 + time_difference * rot_x : state.transform.rotation.x + time_difference * rot_x;
    state.transform.rotation.y = state.transform.rotation.y > 180? -180 + time_difference * rot_y : state.transform.rotation.y + time_difference * rot_y;
    state.transform.rotation.z = state.transform.rotation.z > 180? -180 + time_difference * rot_z : state.transform.rotation.z + time_difference * rot_z;

    document.getElementById("rotationX").nextElementSibling.value = Math.round(state.transform.rotation.x);
    document.getElementById("rotationY").nextElementSibling.value = Math.round(state.transform.rotation.y);
    document.getElementById("rotationZ").nextElementSibling.value = Math.round(state.transform.rotation.z);

    document.getElementById("rotationX").value = Math.round(state.transform.rotation.x);
    document.getElementById("rotationY").value = Math.round(state.transform.rotation.y);
    document.getElementById("rotationZ").value = Math.round(state.transform.rotation.z);
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
    
    // window.requestAnimationFrame(render);
    let old_time = 0;
    function render(new_time) {
        let time_difference = new_time - old_time;

        if (state.enableAnimation) {
            startAnimation(time_difference, 0.05, 0.02, 0.03);
            old_time = new_time;
        }

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
    render(0);
}

main();