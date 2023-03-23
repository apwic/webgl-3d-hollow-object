// Info: Differentiate orthographic, oblique, and perspective projection shaders

let vertexShaderAll = 
    `attribute vec3 position;
    uniform mat4 Pmatrix;
    uniform mat4 Vmatrix;
    uniform mat4 Mmatrix;
    uniform mat4 Tmatrix;
    attribute vec3 color;
    varying vec3 vColor;
    varying float lighting;

    #define ORTH_PROJECTION 1
    #define OBLIQ_PROJECTION 2
    #define PERS_PROJECTION 3

    #define SHADER_OFF 0
    #define SHADER_ON 1

    // default projection type is orthographic with shader on
    #define PROJECTION_TYPE ORTH_PROJECTION
    #define SHADER_STATE SHADER_ON

    void main(void) {
        vec4 transformedPosition;

        #if PROJECTION_TYPE == ORTH_PROJECTION
            transformedPosition = Pmatrix * Vmatrix * Mmatrix * vec4(position, 1.0);
        #endif

        #if PROJECTION_TYPE == OBLIQ_PROJECTION
            float angle = radians(45.0);
            mat4 obliqueMatrix = mat4(
                1.0, 0.0, cos(angle), 0.0,
                0.0, 1.0, sin(angle), 0.0,
                0.0, 0.0, 1.0, 0.0,
                0.0, 0.0, 0.0, 1.0);
            transformedPosition = Pmatrix * Vmatrix * Mmatrix * obliqueMatrix * Tmatrix * vec4(position, 1.0);
        #endif

        #if PROJECTION_TYPE == PERS_PROJECTION
            transformedPosition = Pmatrix * Vmatrix * Mmatrix * vec4(position, 1.0);
        #endif

        gl_Position = transformedPosition;
        vColor = color;
        
        #if SHADER_STATE == SHADER_ON
            lighting = min(max((1.0 - transformedPosition.z) / 2.0, 0.0), 1.0);
        #endif

        #if SHADER_STATE == SHADER_OFF
            lighting = 1.0;
        #endif
    };
`;

let fragmentShader = `
    precision mediump float;
    varying vec3 vColor;
    varying float lighting;

    void main(void) {
        gl_FragColor = vec4(vColor * lighting, 1.);
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
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
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

    console.log("Failed to create shader. Reason: ", gl.getShaderInfoLog(shader));
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

    console.log("Failed to create program. Reason: ", gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
}