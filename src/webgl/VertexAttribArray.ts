import { Vao } from "./Vao";
import { Vbo } from "./buffer/Vbo";
import { VertexAttribPointer } from "./VertexAttribPointer";
import { Gl } from "./Gl";
import { Utility } from "../utility/Utility";
import { VertexAttribPointerTypeResolver } from "./enum/VertexAttribPointerType";

export class VertexAttribArray {

    private vao: Vao;
    private vbo: Vbo;
    private vap: VertexAttribPointer;
    private index: number;
    private enabled = false;

    public constructor(vao: Vao, index: number) {
        this.vao = vao;
        this.index = index;
    }

    public getVao(): Vao {
        return this.vao;
    }

    public getVbo(): Vbo {
        return Utility.isUsable(this.vbo) ? this.vbo : null;
    }

    public setVbo(vbo: Vbo, vap: VertexAttribPointer): void {
        this.vap = vap;
        this.vbo = vbo;
        this.vao.bind();
        this.vbo.bind();
        const glType = VertexAttribPointerTypeResolver.enumToGl(vap.type);
        Gl.gl.vertexAttribPointer(this.index, vap.size, glType, vap.normalized, vap.relativeOffset, vap.offset);
    }

    public getPointer(): VertexAttribPointer {
        return this.vap;
    }

    public enable(): void {
        Gl.gl.enableVertexAttribArray(this.index);
        this.enabled = true;
    }

    public disable(): void {
        Gl.gl.disableVertexAttribArray(this.index)
        this.enabled = false;
    }

    public isEnabled(): boolean {
        return this.enabled;
    }

    public getIndex(): number {
        return this.index;
    }

}
