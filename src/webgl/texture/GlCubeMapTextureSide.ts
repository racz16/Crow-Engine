import { GlCubeMapTexture } from './GlCubeMapTexture';
import { CubeMapSide, CubeMapSideResolver } from '../enum/CubeMapSide';
import { InternalFormat } from '../enum/InternalFormat';
import { vec2 } from 'gl-matrix';
import { IFboAttachment } from '../fbo/IFboAttachment';
import { TextureWrap } from '../enum/TextureWrap';
import { Gl } from '../Gl';

export class GlCubeMapTextureSide implements IFboAttachment {

    private cubeMapTexture: GlCubeMapTexture;
    private side: CubeMapSide;

    public constructor(cubeMapTexture: GlCubeMapTexture, side: CubeMapSide) {
        this.cubeMapTexture = cubeMapTexture;
        this.side = side;
    }

    public getCubeMapTexture(): GlCubeMapTexture {
        return this.cubeMapTexture;
    }

    public getSide(): CubeMapSide {
        return this.side;
    }

    public store(data: HTMLImageElement): void {
        this.storeWithOffset(vec2.create(), data);
    }

    public storeWithOffset(offset: vec2, data: HTMLImageElement): void {
        this.cubeMapTexture.bind();
        Gl.gl.texSubImage2D(CubeMapSideResolver.enumToGl(this.side), 0, offset[0], offset[1], Gl.gl.RGBA, Gl.gl.UNSIGNED_BYTE, data);
    }

    public getSize(): vec2 {
        return this.cubeMapTexture.getSize();
    }

    public getInternalFormat(): InternalFormat {
        return this.cubeMapTexture.getInternalFormat();
    }

    public isAllocated(): boolean {
        return this.cubeMapTexture.isAllocated();
    }

    public isMultisampled(): boolean {
        return false;
    }

    public getSampleCount(): number {
        return 1;
    }

    public isMipmapped(): boolean {
        return this.cubeMapTexture.isMipmapped();
    }

    public getMipmapLevelCount(): number {
        return this.cubeMapTexture.getMipmapLevelCount();
    }

    public getWrapU(): TextureWrap {
        return this.cubeMapTexture.getWrapU();
    }

    public getWrapV(): TextureWrap {
        return this.cubeMapTexture.getWrapU();
    }

    public getWrapW(): TextureWrap {
        return this.cubeMapTexture.getWrapW();
    }

    public issRgb(): boolean {
        return this.cubeMapTexture.issRgb();
    }

    public isUsable(): boolean {
        return this.cubeMapTexture.isUsable();
    }

}
