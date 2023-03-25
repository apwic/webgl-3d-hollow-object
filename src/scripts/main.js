let state;

function updateRotationUI() {
    document.getElementById("rotationX").value = Math.round(state.transform.rotation.x);
    document.getElementById("rotationX").nextElementSibling.value = Math.round(state.transform.rotation.x);
    document.getElementById("rotationY").value = Math.round(state.transform.rotation.y);
    document.getElementById("rotationY").nextElementSibling.value = Math.round(state.transform.rotation.y);
    document.getElementById("rotationZ").value = Math.round(state.transform.rotation.z);
    document.getElementById("rotationZ").nextElementSibling.value = Math.round(state.transform.rotation.z);
}

function updateUI() {
    document.getElementById("cylinder").checked = state.models[0];
    document.getElementById("cube").checked = state.models[1];
    document.getElementById("triangles").checked = state.models[2];

    document.getElementById("color").value = rgbToHexColor(state.color);

    if (state.projection == "orth") document.getElementById("orth").checked = true;
    if (state.projection == "obliq") document.getElementById("obliq").checked = true;
    if (state.projection == "persp") document.getElementById("persp").checked = true;

    updateRotationUI();

    document.getElementById("translationX").value = state.transform.translation.x;
    document.getElementById("translationX").nextElementSibling.value = state.transform.translation.x;
    document.getElementById("translationY").value = state.transform.translation.y;
    document.getElementById("translationY").nextElementSibling.value = state.transform.translation.y;
    document.getElementById("translationZ").value = state.transform.translation.z;
    document.getElementById("translationZ").nextElementSibling.value = state.transform.translation.z;

    document.getElementById("scalingX").value = state.transform.scale.x;
    document.getElementById("scalingX").nextElementSibling.value = state.transform.scale.x;
    document.getElementById("scalingY").value = state.transform.scale.y;
    document.getElementById("scalingY").nextElementSibling.value = state.transform.scale.y;
    document.getElementById("scalingZ").value = state.transform.scale.z;
    document.getElementById("scalingZ").nextElementSibling.value = state.transform.scale.z;

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
        model: Cylinder(1, 1, 1),
        models: [true, false, false],

        color: [1, 1, 1],

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
        state.model.appendModel(Cube(state.color[0], state.color[1], state.color[2]), 0.3);
    }
    if (state.models[0]) {
        console.log("append cylinder");
        state.model.appendModel(Cylinder(state.color[0], state.color[1], state.color[2]), 0);
    } 
    if (state.models[2]) {
        console.log("append triangles");
        state.model.appendModel(Triangles(state.color[0], state.color[1], state.color[2]), -0.3);
    }
    console.log(state.model);
}

function setListeners() {
    document.getElementById("reset").addEventListener("click", () => {
        setDefaultState();
    });

    document.getElementById("cylinder").oninput = () => {
        state.models[0] = document.getElementById("cylinder").checked;
        if (!state.models.includes(true)) {
            state.models[0] = true;
            document.getElementById("cylinder").checked = true;
        }
        updateModel();
    };

    document.getElementById("cube").oninput = () => {
        state.models[1] = document.getElementById("cube").checked;
        if (!state.models.includes(true)) {
            state.models[0] = true;
            document.getElementById("cylinder").checked = true;
        }
        updateModel();
    };

    document.getElementById("triangles").oninput = () => {
        state.models[2] = document.getElementById("triangles").checked;
        if (!state.models.includes(true)) {
            state.models[0] = true;
            document.getElementById("cylinder").checked = true;
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
            updateRotationUI();
        }
    });

    document.getElementById("save").addEventListener("click", () => {
        save();
    });

    document.getElementById("load").oninput = (event) => {
        load(event.target.files[0]);
    };

    document.getElementById("color").oninput = (event) => {
        state.color = hexToRGBColor(event.target.value);
        state.model.updateColor(state.color);
    };
}

function load(file) {
    console.log("load");
    const reader = new FileReader();
    reader.readAsText(file,'UTF-8');
    reader.onload = readerEvent => {
        const content = readerEvent.target.result;
        const save = JSON.parse(content);
        state = save;
        state.model = new Model(state.model.name, state.model.vertices, state.model.indices, state.model.colors);
        updateUI();
    }
}

function save() {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(state));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "save.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
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
    if (state.projection == "orth") {
        Vmatrix[14] = Vmatrix[14];
    } else {
        Vmatrix[14] = Vmatrix[14] - 3;
    }
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
        
        let proj_matrix;
        if (state.projection == "persp") {
            proj_matrix = getPerspectiveProjection(45, canvas.width / canvas.height, 1, 100);
        } else if (state.projection == "orth") {
            proj_matrix = getOrthographicProjection(canvas.width / canvas.height);
        } else { // use oblique projection
            proj_matrix = getObliqueProjection(canvas.width / canvas.height);
        }
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