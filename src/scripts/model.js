export class Model {
    constructor(name, outerVertices, innerVertices, outerIndices, innerIndices) {
        this.name = name;
        this.outerVertices = outerVertices;
        this.innerVertices = innerVertices;
        this.outerIndices = outerIndices;
        this.innerIndices = innerIndices;
    }

    static exportVertexBuffer() {
        return new Float32Array([...this.outerVertices, ...this.innerVertices]);
    }

    static exportIndexBuffer() {
        return new Uint16Array([...this.outerIndices, ...this.innerIndices]);
    }
}