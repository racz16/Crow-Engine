import { GlTexture } from "./GlTexture";
import { vec2 } from "gl-matrix";
import { IFboAttachment } from "../fbo/IFboAttachment";
import { Gl } from "../Gl";
import { ITexture2D } from "../../resource/texture/ITexture2D";

export class GlTexture2D extends GlTexture implements ITexture2D, IFboAttachment {

    protected getTarget(): number {
        return Gl.gl.TEXTURE_2D;
    }

    getNativeTexture(): GlTexture2D {
        return this;
    }

    //
    //store-------------------------------------------------------------------------------------------------------------
    //
    public store(data: HTMLImageElement): void {
        this.storeWithOffset(vec2.create(), data);
    }

    public storeWithOffset(offset: vec2, data: HTMLImageElement): void {
        this.bind();
        Gl.gl.texSubImage2D(this.getTarget(), 0, offset[0], offset[1], Gl.gl.RGBA, Gl.gl.UNSIGNED_BYTE, data);
    }

    public isMultisampled(): boolean {
        return false;
    }

    getSampleCount(): number {
        return 1;
    }

}
