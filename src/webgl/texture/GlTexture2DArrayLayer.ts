import { IFboAttachment } from "../fbo/IFboAttachment";
import { vec2 } from "gl-matrix";
import { InternalFormat } from "../enum/InternalFormat";
import { GlTexture2DArray } from "./GlTexture2DArray";
import { TextureWrap } from "../enum/TextureWrap";
import { Format, FormatResolver } from "../enum/Format";
import { Gl } from "../Gl";
import { Utility } from "../../utility/Utility";

export class GlTexture2DArrayLayer implements IFboAttachment {

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

    public store(data: HTMLImageElement, format: Format, flipYAxis = false, mipmapLevel = 0, offset = vec2.create()): void {
        const glFormat = FormatResolver.enumToGl(format);
        this.texture2DArray.bind();
        Gl.gl.pixelStorei(Gl.gl.UNPACK_FLIP_Y_WEBGL, flipYAxis);
        Gl.gl.texSubImage3D(Gl.gl.TEXTURE_2D_ARRAY, mipmapLevel, offset[0], offset[1], 0, data.naturalWidth, data.naturalHeight, this.layer, glFormat, Gl.gl.UNSIGNED_BYTE, data);
    }

    public storeHdr(data: ArrayBufferView, size: vec2, format: Format, flipYAxis = false, mipmapLevel = 0, offset = vec2.create()): void {
        const glFormat = FormatResolver.enumToGl(format);
        this.texture2DArray.bind();
        Gl.gl.pixelStorei(Gl.gl.UNPACK_FLIP_Y_WEBGL, flipYAxis);
        Gl.gl.texSubImage3D(Gl.gl.TEXTURE_2D_ARRAY, mipmapLevel, offset[0], offset[1], 0, size[0], size[1], this.layer, glFormat, Gl.gl.FLOAT, data);
    }

    public getSize(): vec2 {
        return this.texture2DArray.getSize();
    }

    public getInternalFormat(): InternalFormat {
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

    public getWrapU(): TextureWrap {
        return this.texture2DArray.getWrapU();
    }

    public getWrapV(): TextureWrap {
        return this.texture2DArray.getWrapU();
    }

    public isSRgb(): boolean {
        return this.texture2DArray.isSRgb();
    }

    public isUsable(): boolean {
        return Utility.isUsable(this.texture2DArray);
    }

}