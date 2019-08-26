import { GlBuffer } from './GlBuffer';
import { Gl } from '../Gl';

export class Vbo extends GlBuffer {

    public getTarget(): number {
        return Gl.gl.ARRAY_BUFFER;
    }

}
