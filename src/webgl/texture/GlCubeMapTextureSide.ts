import { GlCubeMapTexture } from './GlCubeMapTexture';
import { GlCubeMapSide, GlCubeMapSideResolver } from '../enum/GlCubeMapSide';
import { GlInternalFormat } from '../enum/GlInternalFormat';
import { vec2, ReadonlyVec2 } from 'gl-matrix';
import { IGlFboAttachment } from '../fbo/IGlFboAttachment';
import { GlWrap } from '../enum/GlWrap';
import { Gl } from '../Gl';
import { GlFormat, GlFormatResolver } from '../enum/GlFormat';
import { Utility } from '../../utility/Utility';

export class GlCubeMapTextureSide implements IGlFboAttachment {

    private cubeMapTexture: GlCubeMapTexture;
    private side: GlCubeMapSide;

    public constructor(cubeMapTexture: GlCubeMapTexture, side: GlCubeMapSide) {
        this.cubeMapTexture = cubeMapTexture;
        this.side = side;
    }

    public getCubeMapTexture(): GlCubeMapTexture {
        return this.cubeMapTexture;
    }

    public getSide(): GlCubeMapSide {
        return this.side;
    }

    public store(data: TexImageSource, format: GlFormat, flipYAxis = false, mipmapLevel = 0, offset: ReadonlyVec2 = vec2.create()): void {
        const glFormat = GlFormatResolver.enumToGl(format);
        this.cubeMapTexture.bind();
        Gl.gl.pixelStorei(Gl.gl.UNPACK_FLIP_Y_WEBGL, flipYAxis);
        Gl.gl.texSubImage2D(GlCubeMapSideResolver.enumToGl(this.side), mipmapLevel, offset[0], offset[1], glFormat, Gl.gl.UNSIGNED_BYTE, data);
    }

    public storeFromBinary(data: ArrayBufferView, size: ReadonlyVec2, format: GlFormat, flipYAxis = false, mipmapLevel = 0, offset: ReadonlyVec2 = vec2.create()): void {
        const glFormat = GlFormatResolver.enumToGl(format);
        this.cubeMapTexture.bind();
        Gl.gl.pixelStorei(Gl.gl.UNPACK_FLIP_Y_WEBGL, flipYAxis);
        Gl.gl.texSubImage2D(GlCubeMapSideResolver.enumToGl(this.side), mipmapLevel, offset[0], offset[1], size[0], size[1], glFormat, Gl.gl.FLOAT, data);
    }

    public getSize(): ReadonlyVec2 {
        return this.cubeMapTexture.getSize();
    }

    public getInternalFormat(): GlInternalFormat {
        return this.cubeMapTexture.getInternalFormat();
    }

    public isAllocated(): boolean {
        return this.cubeMapTexture.isAllocated();
    }

    public isMultisampled(): boolean {
        return this.cubeMapTexture.isMultisampled();
    }

    public getSampleCount(): number {
        return this.cubeMapTexture.getSampleCount();
    }

    public isMipmapped(): boolean {
        return this.cubeMapTexture.isMipmapped();
    }

    public getMipmapLevelCount(): number {
        return this.cubeMapTexture.getMipmapLevelCount();
    }

    public getWrapU(): GlWrap {
        return this.cubeMapTexture.getWrapU();
    }

    public getWrapV(): GlWrap {
        return this.cubeMapTexture.getWrapU();
    }

    public getWrapW(): GlWrap {
        return this.cubeMapTexture.getWrapW();
    }

    public isSRgb(): boolean {
        return this.cubeMapTexture.isSRgb();
    }

    public getDataSize(): number {
        return this.cubeMapTexture.getDataSize() / 6;
    }

    public getAllDataSize(): number {
        return this.getDataSize();
    }

    public isUsable(): boolean {
        return Utility.isUsable(this.cubeMapTexture);
    }

}
