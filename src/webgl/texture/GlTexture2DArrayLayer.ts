import { IGlFboAttachment } from '../fbo/IGlFboAttachment';
import { vec2, ReadonlyVec2 } from 'gl-matrix';
import { GlInternalFormat } from '../enum/GlInternalFormat';
import { GlTexture2DArray } from './GlTexture2DArray';
import { GlWrap } from '../enum/GlWrap';
import { GlFormat, GlFormatResolver } from '../enum/GlFormat';
import { Gl } from '../Gl';
import { Utility } from '../../utility/Utility';

export class GlTexture2DArrayLayer implements IGlFboAttachment {

    private texture2DArray: GlTexture2DArray;
    private layer: number;

    public constructor(texture2DArray: GlTexture2DArray, layer: number) {
        this.texture2DArray = texture2DArray;
        this.layer = layer;
    }

    public getTexture2DArray(): GlTexture2DArray {
        return this.texture2DArray;
    }

    public getLayer(): number {
        return this.layer;
    }

    public store(data: TexImageSource, format: GlFormat, flipYAxis = false, mipmapLevel = 0, offset: ReadonlyVec2 = vec2.create()): void {
        const glFormat = GlFormatResolver.enumToGl(format);
        this.texture2DArray.bind();
        Gl.gl.pixelStorei(Gl.gl.UNPACK_FLIP_Y_WEBGL, flipYAxis);
        Gl.gl.texSubImage3D(Gl.gl.TEXTURE_2D_ARRAY, mipmapLevel, offset[0], offset[1], 0, data.width, data.height, this.layer, glFormat, Gl.gl.UNSIGNED_BYTE, data);
    }

    public storeFromBinary(data: ArrayBufferView, size: ReadonlyVec2, format: GlFormat, flipYAxis = false, mipmapLevel = 0, offset: ReadonlyVec2 = vec2.create()): void {
        const glFormat = GlFormatResolver.enumToGl(format);
        this.texture2DArray.bind();
        Gl.gl.pixelStorei(Gl.gl.UNPACK_FLIP_Y_WEBGL, flipYAxis);
        Gl.gl.texSubImage3D(Gl.gl.TEXTURE_2D_ARRAY, mipmapLevel, offset[0], offset[1], 0, size[0], size[1], this.layer, glFormat, Gl.gl.FLOAT, data);
    }

    public getSize(): ReadonlyVec2 {
        return this.texture2DArray.getSize();
    }

    public getInternalFormat(): GlInternalFormat {
        return this.texture2DArray.getInternalFormat();
    }

    public isAllocated(): boolean {
        return this.texture2DArray.isAllocated();
    }

    public isMultisampled(): boolean {
        return this.texture2DArray.isMultisampled();
    }

    public getSampleCount(): number {
        return this.texture2DArray.getSampleCount();
    }

    public isMipmapped(): boolean {
        return this.texture2DArray.isMipmapped();
    }

    public getMipmapLevelCount(): number {
        return this.texture2DArray.getMipmapLevelCount();
    }

    public getWrapU(): GlWrap {
        return this.texture2DArray.getWrapU();
    }

    public getWrapV(): GlWrap {
        return this.texture2DArray.getWrapU();
    }

    public isSRgb(): boolean {
        return this.texture2DArray.isSRgb();
    }

    public getDataSize(): number {
        return this.texture2DArray.getDataSize() / this.texture2DArray.getLayers();
    }

    public getAllDataSize(): number {
        return this.getDataSize();
    }

    public isUsable(): boolean {
        return Utility.isUsable(this.texture2DArray);
    }

}