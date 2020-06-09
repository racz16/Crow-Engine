import { GlBuffer } from './GlBuffer';
import { Gl } from '../Gl';
import { GlBindingPoint } from '../GlBindingPoint';

export class GlUbo extends GlBuffer {

    public static readonly MAT4_SIZE = 16 * 4;
    public static readonly VEC3_SIZE = 3 * 4 + 4;
    public static readonly VEC4_SIZE = 4 * 4;

    public bindToBindingPoint(bindingPoint: GlBindingPoint): void {
        Gl.gl.bindBufferBase(this.getTarget(), bindingPoint.getBindingPoint(), this.getId());
    }

    public getTarget(): number {
        return Gl.gl.UNIFORM_BUFFER;
    }

}
