import { GlBuffer } from "./GlBuffer";
import { Gl } from "../Gl";

export class Ebo extends GlBuffer {

    protected getTarget(): number {
        return Gl.gl.ELEMENT_ARRAY_BUFFER;
    }

}
