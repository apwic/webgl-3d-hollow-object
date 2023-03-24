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

    reset() {
        this.name = "";
        this.vertices = [];
        this.indices = [];
        this.color = [1, 1, 1];
        this.colors = [];
    }

    appendModel(model, verticesOffset) {
        let offset = this.vertices.length/3;
        for (let i = 0; i < model.vertices.length; i++) {
            this.vertices.push(model.vertices[i] + verticesOffset);
        }
        for (let i = 0; i < model.indices.length; i++) {
            this.indices.push(model.indices[i] + offset);
        }
        for (let i = 0; i < model.vertices.length/3; i++) {
            this.colors.push(model.color[0]);
            this.colors.push(model.color[1]);
            this.colors.push(model.color[2]);
        }
    }

    updateColor(color) {
        this.color = color;
        this.colors = [];
        for (let i = 0; i < this.vertices.length/3; i++) {
            this.colors.push(this.color[0]);
            this.colors.push(this.color[1]);
            this.colors.push(this.color[2]);
        }
    }
}