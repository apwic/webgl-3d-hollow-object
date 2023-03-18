class Model {
    constructor(name, outerVertices, innerVertices, outerIndices, innerIndices, colors) {
        this.name = name;
        this.outerVertices = outerVertices;
        this.innerVertices = innerVertices;
        this.outerIndices = outerIndices;
        this.innerIndices = innerIndices;
        this.colors = colors;
    }

    exportVertexBuffer() {
        return new Float32Array([...this.outerVertices, ...this.innerVertices]);
    }

    exportIndexBuffer() {
        return new Uint16Array([...this.outerIndices, ...this.innerIndices]);
    }

    exportColorBuffer() {
        return new Float32Array(this.colors);
    }
}