let state;

function updateUI() {
    document.getElementById("hollow-cube").checked = true;
    document.getElementById("cube").checked = false;
    document.getElementById("triangles").checked = false;
    document.getElementById("orth").checked = true;

    document.getElementById("rotationX").value = state.transform.rotation.x;
    document.getElementById("rotationY").value = state.transform.rotation.y;
    document.getElementById("rotationZ").value = state.transform.rotation.z;

    document.getElementById("translationX").value = state.transform.translation.x;
    document.getElementById("translationY").value = state.transform.translation.y;
    document.getElementById("translationZ").value = state.transform.translation.z;

    document.getElementById("scalingX").value = state.transform.scale.x;
    document.getElementById("scalingY").value = state.transform.scale.y;
    document.getElementById("scalingZ").value = state.transform.scale.z;

    document.getElementById("cameraRadius").value = state.view.radius;
    document.getElementById("cameraRadius").nextElementSibling.innerHTML = state.view.radius.toFixed(3);

    document.getElementById("cameraAngle").value = state.view.rotation;
    document.getElementById("cameraAngle").nextElementSibling.innerHTML = state.view.rotation.toFixed(3);

    document.getElementById("isShadingOn").checked = state.enableShader;
    document.getElementById("isAnimationOn").checked = state.enableAnimation;
}

function setDefaultState() {
    state = {
        mousedown: false,
        model: HollowCube(1, 1, 1),
        models: [true, false, false],

        projection: "orth",

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
            radius: 0.5
        },

        enableShader: true,
        enableAnimation: true,
    }

    updateUI();
}

function updateModel() {
    console.log("update model");
    console.log(state.models);
    state.model.reset();
    if (state.models[1]) {
        console.log("append cube");
        state.model.appendModel(Cube(1, 1, 1), 0.3);
    }
    if (state.models[0]) {
        console.log("append hollow cube");
        state.model.appendModel(HollowCube(1, 1, 1), 0);
    } 
    if (state.models[2]) {
        console.log("append triangles");
        state.model.appendModel(Triangles(1, 1, 1), -0.3);
    }
    console.log(state.model);
}

function setListeners() {
    document.getElementById("reset").addEventListener("click", () => {
        setDefaultState();
    });

    document.getElementById("hollow-cube").oninput = () => {
        state.models[0] = document.getElementById("hollow-cube").checked;
        if (!state.models.includes(true)) {
            state.models[0] = true;
            document.getElementById("hollow-cube").checked = true;
        }
        updateModel();
    };

    document.getElementById("cube").oninput = () => {
        state.models[1] = document.getElementById("cube").checked;
        if (!state.models.includes(true)) {
            state.models[0] = true;
            document.getElementById("hollow-cube").checked = true;
        }
        updateModel();
    };

    document.getElementById("triangles").oninput = () => {
        state.models[2] = document.getElementById("triangles").checked;
        if (!state.models.includes(true)) {
            state.models[0] = true;
            document.getElementById("hollow-cube").checked = true;
        }
        updateModel();
    };

    document.getElementById("orth").onclick = () => {
        state.projection = "orth";
    };

    document.getElementById("obliq").onclick = () => {
        state.projection = "obliq";
    };

    document.getElementById("persp").onclick = () => {
        state.projection = "persp";
    };

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

    document.getElementById("cameraRadius").addEventListener("input", (event) => {
        state.view.radius = Number(event.target.value);
    });

    document.getElementById("cameraAngle").addEventListener("input", (event) => {
        state.view.rotation = Number(event.target.value);
    });

    document.getElementById("isShadingOn").addEventListener("change", (event) => {
        state.enableShader = event.target.checked;
    });

    document.getElementById("isAnimationOn").addEventListener("change", (event) => {
        state.enableAnimation = event.target.checked;
    });

    document.getElementById("canvas").addEventListener("wheel", (event) => {
        state.view.radius = Math.max(0, Math.min(1, state.view.radius + event.deltaY / 1000));
        document.getElementById("cameraRadius").value = state.view.radius;
        document.getElementById("cameraRadius").nextElementSibling.innerHTML = state.view.radius.toFixed(3);
    });

    document.getElementById("canvas").addEventListener("mousedown", (event) => {
        state.mousedown = true;
    });

    document.getElementById("canvas").addEventListener("mouseup", (event) => {
        state.mousedown = false;
    });

    document.getElementById("canvas").addEventListener("mousemove", (event) => {
        if (state.mousedown) {
            state.transform.rotation.x = Math.round(state.transform.rotation.x - event.movementY);
            state.transform.rotation.y = Math.round(state.transform.rotation.y - event.movementX);
        }
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