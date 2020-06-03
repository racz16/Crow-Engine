import { GlTexture } from './GlTexture';
import { vec2 } from 'gl-matrix';
import { IFboAttachment } from '../fbo/IFboAttachment';
import { Gl } from '../Gl';
import { ITexture2D } from '../../resource/texture/ITexture2D';
import { Format, FormatResolver } from '../enum/Format';
import { InternalFormat } from '../enum/InternalFormat';
import { GlConstants } from '../GlConstants';
import { HdrImageResult } from 'parse-hdr';
import { TextureDataType, TextureDataTypeResolver } from '../enum/TextureDataType';

export class GlTexture2D extends GlTexture implements ITexture2D, IFboAttachment {

    protected getTarget(): number {
        return Gl.gl.TEXTURE_2D;
    }

    public getNativeTexture(): GlTexture2D {
        return this;
    }

    public allocate(internalFormat: InternalFormat, size: vec2, mipmaps: boolean): void {
        this.allocate2D(internalFormat, size, 1, mipmaps);
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

    public storeFromBinary(data: ArrayBufferView, size: vec2, format: Format, type: TextureDataType, flipYAxis = true, mipmapLevel = 0, offset = vec2.create()): void {
        const glFormat = FormatResolver.enumToGl(format);
        const glType = TextureDataTypeResolver.enumToGl(type);
        this.bind();
        Gl.gl.pixelStorei(Gl.gl.UNPACK_FLIP_Y_WEBGL, flipYAxis);
        Gl.gl.texSubImage2D(this.getTarget(), mipmapLevel, offset[0], offset[1], size[0], size[1], glFormat, glType, data);
    }

    public static getMaxSize(): number {
        return GlConstants.MAX_TEXTURE_SIZE;
    }

    public static getMaxSizeSafe(): number {
        return GlConstants.MAX_TEXTURE_SIZE_SAFE;
    }

    public static createTexture(image: HTMLImageElement, internalFormat: InternalFormat, mipmaps = true, flipY = true): GlTexture2D {
        const format = internalFormat === InternalFormat.RGB8 ? Format.RGB : Format.RGBA;
        const texture = new GlTexture2D();
        texture.allocate(internalFormat, vec2.fromValues(image.width, image.height), mipmaps);
        texture.store(image, format, flipY);
        if (mipmaps) {
            texture.generateMipmaps();
        }
        return texture;
    }

    public static createHdrTexture(image: HdrImageResult, internalFormat: InternalFormat, mipmaps = true, flipY = true): GlTexture2D {
        const format = internalFormat === InternalFormat.RGB32F ? Format.RGB : Format.RGBA;
        const texture = new GlTexture2D();
        texture.allocate(internalFormat, vec2.fromValues(image.shape[0], image.shape[1]), mipmaps);
        texture.storeFromBinary(image.data, vec2.fromValues(image.shape[0], image.shape[1]), format, TextureDataType.FLOAT, flipY);
        if (mipmaps) {
            texture.generateMipmaps();
        }
        return texture;
    }

}
