import { GlBuffer } from "./GlBuffer";
import { GlConstants } from "../GlConstants";
import { Gl } from "../Gl";

export class Ubo extends GlBuffer {

    private static bindingPoints = new Map<number, Ubo>();
    public static readonly MAT4_SIZE = 16 * 4;
    public static readonly VEC3_SIZE = 3 * 4 + 4;
    public static readonly VEC4_SIZE = 4 * 4;

    public bindToBindingPoint(bindingPoint: number): void {
        Ubo.bindingPoints.set(bindingPoint, this);
        Gl.gl.bindBufferBase(this.getTarget(), bindingPoint, this.getId());
    }

    public getBindingPoints(): Array<number> {
        let ret = new Array<number>();
        for (const bp of Ubo.bindingPoints.keys()) {
            ret.push(bp);
        }
        return ret;
    }

    public getTarget(): number {
        return Gl.gl.UNIFORM_BUFFER;
    }

    public static getMaxDataSize(): number {
        return GlConstants.MAX_UNIFORM_BLOCK_SIZE;
    }

    public static getMaxDataSizeSafe(): number {
        return GlConstants.MAX_UNIFORM_BLOCK_SIZE_SAFE;
    }

    protected getHighestValidBindingPoint(): number {
        return Ubo.getMaxBindingPointCount() - 1;
    }

    public static getMaxBindingPointCount(): number {
        return GlConstants.MAX_UNIFORM_BUFFER_BINDINGS;
    }

    public static getMaxBindingPointCountSafe(): number {
        return GlConstants.MAX_UNIFORM_BUFFER_BINDINGS_SAFE;
    }

}
