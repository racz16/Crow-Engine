import { GlVao } from './GlVao';
import { GlVbo } from './buffer/GlVbo';
import { GlVertexAttribPointer } from './GlVertexAttribPointer';
import { Gl } from './Gl';
import { Utility } from '../utility/Utility';
import { GlVertexAttribPointerTypeResolver } from './enum/GlVertexAttribPointerType';

export class GlVertexAttribArray {

    private vao: GlVao;
    private vbo: GlVbo;
    private vap: GlVertexAttribPointer;
    private readonly index: number;
    private enabled = false;

    public constructor(vao: GlVao, index: number) {
        this.vao = vao;
        this.index = index;
    }

    public getVao(): GlVao {
        return this.vao;
    }

    public getVbo(): GlVbo {
        return Utility.isUsable(this.vbo) ? this.vbo : null;
    }

    public setVbo(vbo: GlVbo, vap: GlVertexAttribPointer): void {
        this.vap = vap;
        this.vbo = vbo;
        this.vao.bind();
        this.vbo.bind();
        const glType = GlVertexAttribPointerTypeResolver.enumToGl(vap.getType());
        Gl.gl.vertexAttribPointer(this.index, vap.getSize(), glType, vap.isNormalized(), vap.getStride(), vap.getOffset());
    }

    public getPointer(): GlVertexAttribPointer {
        return this.vap;
    }

    public isEnabled(): boolean {
        return this.enabled;
    }

    public setEnabled(enabled: boolean): void {
        this.vao.bind();
        if (enabled) {
            Gl.gl.enableVertexAttribArray(this.index);
        } else {
            Gl.gl.disableVertexAttribArray(this.index)
        }
        this.enabled = enabled;
    }

    public getIndex(): number {
        return this.index;
    }

}
