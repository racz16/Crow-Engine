import { VertexAttribArray } from './VertexAttribArray';
import { Ebo } from './buffer/Ebo';
import { Utility } from '../utility/Utility';
import { GlObject } from './GlObject';
import { GlConstants } from './GlConstants';
import { Gl } from './Gl';

export class Vao extends GlObject {

    private vertexAttribArrays = new Array<VertexAttribArray>();
    private ebo: Ebo;

    public constructor() {
        super();
        this.setId(this.createId());
        for (let i = 0; i < GlConstants.MAX_VERTEX_ATTRIBS; i++) {
            this.vertexAttribArrays.push(new VertexAttribArray(this, i));
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

    //
    //VAA-----------------------------------------------------------------------
    //
    public getVertexAttribArray(index: number): VertexAttribArray {
        return this.vertexAttribArrays[index];
    }

    public getVertexAttribArraysIterator(): IterableIterator<VertexAttribArray> {
        return this.vertexAttribArrays.values();
    }

    public static getMaxVertexAttribs(): number {
        return GlConstants.MAX_VERTEX_ATTRIBS;
    }

    public static getMaxVertexAttribsSafe(): number {
        return GlConstants.MAX_VERTEX_ATTRIBS_SAFE;
    }

    //
    //EBO---------------------------------------------------------------------------------------------------------------
    //
    public setEbo(ebo: Ebo): void {
        this.bind();
        ebo.bind();
        this.ebo = ebo;
    }

    public getEbo(): Ebo {
        return Utility.isUsable(this.ebo) ? this.ebo : null;
    }

    //
    //misc--------------------------------------------------------------------------------------------------------------
    //
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