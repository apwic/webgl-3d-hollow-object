function main() {
    // Get the canvas element from the HTML document
    let canvas = document.getElementById("canvas");
    let gl = canvas.getContext("webgl");
    if (!gl) {
        console.log("No rendering context for WebGL");
        return;
    } else {
        console.log("Rendering context for WebGL is obtained");
    }
    // Set the clear color to black
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clearDepth(1.0);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // Vertex-Shader-Script + Flat + Light
    let vertexShaderScript = `
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

    let fragmentShaderLight = `
        precision mediump float;
        uniform vec3 vColor;
        varying float colorFactor;

        void main(void) {
            gl_FragColor = vec4(vColor * colorFactor, 1.0);
        };
    `;

    let fragmentShaderFlat = `
        precision mediump float;
        uniform vec3 vColor;
        varying float colorFactor;

        void main(void) {
            gl_FragColor = vec4(vColor, 1.0);
        };
    `;

    
}

main();