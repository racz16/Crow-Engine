import { GlVertexAttribArray } from './GlVertexAttribArray';
import { GlEbo } from './buffer/GlEbo';
import { Utility } from '../utility/Utility';
import { GlObject } from './GlObject';
import { GlConstants } from './GlConstants';
import { Gl } from './Gl';

export class GlVao extends GlObject {

    private vertexAttribArrays = new Array<GlVertexAttribArray>();
    private ebo: GlEbo;

    public constructor() {
        super();
        this.setId(this.createId());
        for (let i = 0; i < GlConstants.MAX_VERTEX_ATTRIBS; i++) {
            this.vertexAttribArrays.push(new GlVertexAttribArray(this, i));
        }
    }

    protected createId(): number {
        return Gl.gl.createVertexArray() as number;
    }

    public bind(): void {
        Gl.gl.bindVertexArray(this.getId());
    }

    public getAllDataSize(): number {
        let size = this.ebo?.getDataSize() ?? 0;
        for (const vaa of this.vertexAttribArrays) {
            size += vaa.getVbo()?.getDataSize() ?? 0;
        }
        return size;
    }

    //VAA
    public getVertexAttribArray(index: number): GlVertexAttribArray {
        return this.vertexAttribArrays[index];
    }

    public getVertexAttribArraysIterator(): IterableIterator<GlVertexAttribArray> {
        return this.vertexAttribArrays.values();
    }

    //EBO
    public setEbo(ebo: GlEbo): void {
        this.bind();
        ebo.bind();
        this.ebo = ebo;
    }

    public getEbo(): GlEbo {
        return Utility.isUsable(this.ebo) ? this.ebo : null;
    }

    //misc
    public release(): void {
        Gl.gl.deleteVertexArray(this.getId());
        this.setId(GlObject.INVALID_ID);
    }

    public releaseAll(): void {
        this.ebo.release();
        this.ebo = null;
        for (const vaa of this.vertexAttribArrays) {
            vaa.getVbo().release();
        }
        this.vertexAttribArrays = null;
        this.release();
    }

}