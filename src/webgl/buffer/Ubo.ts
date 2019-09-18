import { GlBuffer } from './GlBuffer';
import { GlConstants } from '../GlConstants';
import { Gl } from '../Gl';
import { BindingPoint } from '../BindingPoint';

export class Ubo extends GlBuffer {

    public static readonly MAT4_SIZE = 16 * 4;
    public static readonly VEC3_SIZE = 3 * 4 + 4;
    public static readonly VEC4_SIZE = 4 * 4;

    public bindTo(bindingPoint: number): void {
        Gl.gl.bindBufferBase(this.getTarget(), bindingPoint, this.getId());
    }

    public bindToBindingPoint(bindingPoint: BindingPoint): void {
        this.bindTo(bindingPoint.bindingPoint);
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
