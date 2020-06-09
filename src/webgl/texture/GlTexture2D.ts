import { GlTexture } from './GlTexture';
import { vec2 } from 'gl-matrix';
import { IGlFboAttachment } from '../fbo/IGlFboAttachment';
import { Gl } from '../Gl';
import { ITexture2D } from '../../resource/texture/ITexture2D';
import { GlFormat, GlFormatResolver } from '../enum/GlFormat';
import { GlInternalFormat } from '../enum/GlInternalFormat';
import { HdrImageResult } from 'parse-hdr';
import { GlTextureDataType, GlTextureDataTypeResolver } from '../enum/GlTextureDataType';

export class GlTexture2D extends GlTexture implements ITexture2D, IGlFboAttachment {

    protected getTarget(): number {
        return Gl.gl.TEXTURE_2D;
    }

    public getNativeTexture(): GlTexture2D {
        return this;
    }

    public allocate(internalFormat: GlInternalFormat, size: vec2, mipmaps: boolean): void {
        this.allocate2D(internalFormat, size, 1, mipmaps);
    }

    //store
    public store(data: TexImageSource, format: GlFormat, flipYAxis = true, mipmapLevel = 0, offset = vec2.create()): void {
        const glFormat = GlFormatResolver.enumToGl(format);
        this.bind();
        Gl.gl.pixelStorei(Gl.gl.UNPACK_FLIP_Y_WEBGL, flipYAxis)
        Gl.gl.texSubImage2D(this.getTarget(), mipmapLevel, offset[0], offset[1], glFormat, Gl.gl.UNSIGNED_BYTE, data);
    }

    public storeFromBinary(data: ArrayBufferView, size: vec2, format: GlFormat, type: GlTextureDataType, flipYAxis = true, mipmapLevel = 0, offset = vec2.create()): void {
        const glFormat = GlFormatResolver.enumToGl(format);
        const glType = GlTextureDataTypeResolver.enumToGl(type);
        this.bind();
        Gl.gl.pixelStorei(Gl.gl.UNPACK_FLIP_Y_WEBGL, flipYAxis);
        Gl.gl.texSubImage2D(this.getTarget(), mipmapLevel, offset[0], offset[1], size[0], size[1], glFormat, glType, data);
    }

    public static createTexture(data: TexImageSource, internalFormat: GlInternalFormat, mipmaps = true, flipY = true): GlTexture2D {
        const format = internalFormat === GlInternalFormat.RGB8 ? GlFormat.RGB : GlFormat.RGBA;
        const texture = new GlTexture2D();
        texture.allocate(internalFormat, vec2.fromValues(data.width, data.height), mipmaps);
        texture.store(data, format, flipY);
        if (mipmaps) {
            texture.generateMipmaps();
        }
        return texture;
    }

    public static createTextureFromBinary(data: ArrayBufferView, size: vec2, internalFormat: GlInternalFormat, mipmaps = true, flipY = true): GlTexture2D {
        const format = internalFormat === GlInternalFormat.RGB32F ? GlFormat.RGB : GlFormat.RGBA;
        const texture = new GlTexture2D();
        texture.allocate(internalFormat, size, mipmaps);
        texture.storeFromBinary(data, size, format, GlTextureDataType.FLOAT, flipY);
        if (mipmaps) {
            texture.generateMipmaps();
        }
        return texture;
    }

}
