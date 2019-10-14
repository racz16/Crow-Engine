import { GlTexture } from './GlTexture';
import { vec2 } from 'gl-matrix';
import { IFboAttachment } from '../fbo/IFboAttachment';
import { Gl } from '../Gl';
import { ITexture2D } from '../../resource/texture/ITexture2D';
import { Format, FormatResolver } from '../enum/Format';

export class GlTexture2D extends GlTexture implements ITexture2D, IFboAttachment {

    protected getTarget(): number {
        return Gl.gl.TEXTURE_2D;
    }

    public getNativeTexture(): GlTexture2D {
        return this;
    }

    //
    //store-------------------------------------------------------------------------------------------------------------
    //
    public store(data: HTMLImageElement, format: Format, flipYAxis = true, mipmapLevel = 0, offset = vec2.create()): void {
        const glFormat = FormatResolver.enumToGl(format);
        this.bind();
        Gl.gl.pixelStorei(Gl.gl.UNPACK_FLIP_Y_WEBGL, flipYAxis)
        Gl.gl.texSubImage2D(this.getTarget(), mipmapLevel, offset[0], offset[1], glFormat, Gl.gl.UNSIGNED_BYTE, data);
    }

    public storeHdr(data: ArrayBufferView, size: vec2, format: Format, flipYAxis = true, mipmapLevel = 0, offset = vec2.create()): void {
        const glFormat = FormatResolver.enumToGl(format);
        this.bind();
        Gl.gl.pixelStorei(Gl.gl.UNPACK_FLIP_Y_WEBGL, flipYAxis);
        Gl.gl.texSubImage2D(this.getTarget(), mipmapLevel, offset[0], offset[1], size[0], size[1], glFormat, Gl.gl.FLOAT, data);
    }

    public isMultisampled(): boolean {
        return false;
    }

    public getSampleCount(): number {
        return 1;
    }

}
