import { GlBuffer } from './GlBuffer';
import { Gl } from '../Gl';

export class GlEbo extends GlBuffer {

    protected getTarget(): number {
        return Gl.gl.ELEMENT_ARRAY_BUFFER;
    }

}
