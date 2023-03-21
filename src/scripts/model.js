class Model {
    constructor(name, vertices, indices, color) {
        this.name = name;
        this.vertices = vertices;
        this.indices = indices;
        this.color = color;
        this.colors = [];

        for (let i = 0; i < this.vertices.length/3; i++) {
            this.colors.push(this.color[0]);
            this.colors.push(this.color[1]);
            this.colors.push(this.color[2]);
        }
    }

    exportVertexBuffer() {
        return new Float32Array(this.vertices);
    }

    exportIndexBuffer() {
        return new Uint16Array(this.indices);
    }

    exportColorBuffer() {
        return new Float32Array(this.colors);
    }
}