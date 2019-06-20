import { VertexAttribArray } from "./VertexAttribArray";
import { Ebo } from "./buffer/Ebo";
import { Utility } from "../utility/Utility";
import { GlObject } from "./GlObject";
import { GlConstants } from "./GlConstants";
import { Gl } from "./Gl";

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

    //
    //VAA-----------------------------------------------------------------------
    //
    public getVertexAttribArray(index: number): VertexAttribArray {
        return this.vertexAttribArrays[index];
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
        return Utility.isReleased(this.ebo) ? null : this.ebo;
    }

    //
    //misc--------------------------------------------------------------------------------------------------------------
    //
    public release(): void {
        Gl.gl.deleteVertexArray(this.getId());
        this.setId(-1);
    }
}