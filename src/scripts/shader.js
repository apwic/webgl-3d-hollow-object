// Vertex-Shader-Script + Flat + Light
const vertexShaderScript = `
    attribute vec3 coordinates;
    uniform float depthFudgeX;

    uniform mat4 transformationMatrix;
    uniform mat4 projectionMatrix;
    varying float vColor;

    void main(void) {
        vec4 transformedPostion = transformationMatrix * vec4(coordinates.xy, coordinates.z * -1.0, 1.0);
        vec4 projectedPosition = projectionMatrix * transformedPostion;
        if (depthFudgeX < 0.01) {
            gl_Position = projectedPosition;
        } else {
            float zDivider = 2.0 + (projectedPosition.z * depthFudgeX);
            gl_Position = vec4(projectedPosition.xy / zDivider, projectedPosition.zw);
        }
        vColor = min(max((1.0 - transformedPosition.z) / 2.0, 0.0), 1.0);
    };
`;

const fragmentShaderLight = `
    precision mediump float;
    uniform vec3 vColor;
    varying float colorFactor;

    void main(void) {
        gl_FragColor = vec4(vColor * colorFactor, 1.0);
    };
`;

const fragmentShaderFlat = `
    precision mediump float;
    uniform vec3 vColor;
    varying float colorFactor;

    void main(void) {
        gl_FragColor = vec4(vColor, 1.0);
    };
`;

function createArrayBuffer(gl, array) {
    let arrayBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, arrayBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, array, gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    return arrayBuffer;
}

function createElementBuffer(gl, element) {
    let elementBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, elementBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, element, gl.STATIC_DRAW);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

    return elementBuffer;
}

function bindAttribute(gl, program, buffer, attr) {
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    let attribute = gl.getAttribLocation(program, attr);
    gl.vertexAttribPointer(attribute, 3, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gl.enableVertexAttribArray(attribute);
}

function enableDepth(gl) {
    gl.clearColor(0.5, 0.5, 0.5, 0.9);
    gl.clearDepth(1.0);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
}

function createShader(gl, type, source) {
    let shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    let success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (success) {
        return shader;
    }

    alert("Failed to create shader. Reason: ", gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
}

function createProgram(gl, vertexSource, fragmentSource) {
    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexSource);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentSource);
    let program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    let success = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (success) {
        return program;
    }

    alert("Failed to create program. Reason: ", gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
}