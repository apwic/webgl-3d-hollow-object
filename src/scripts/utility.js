export function createShaderProgram(glContext, vertexShaderSource, fragmentShaderSource) {
    const vertexShader = glContext.createShader(glContext.VERTEX_SHADER);
    glContext.shaderSource(vertexShader, vertexShaderSource);
    glContext.compileShader(vertexShader);

    const fragmentShader = glContext.createShader(glContext.FRAGMENT_SHADER);
    glContext.shaderSource(fragmentShader, fragmentShaderSource);
    glContext.compileShader(fragmentShader);

    const program = glContext.createProgram();
    glContext.attachShader(program, vertexShader);
    glContext.attachShader(program, fragmentShader);
    glContext.linkProgram(program);

    // Error handling
    if (!glContext.getShaderParameter(vertexShader, glContext.COMPILE_STATUS)) {
        console.error('ERROR compiling vertex shader!', glContext.getShaderInfoLog(vertexShader));
        return;
    }

    return program;
}