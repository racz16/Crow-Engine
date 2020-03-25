import { GlTexture } from './GlTexture';
import { TextureWrap, TextureWrapResolver } from '../enum/TextureWrap';
import { CubeMapSide, CubeMapSideResolver } from '../enum/CubeMapSide';
import { Gl } from '../Gl';
import { GlCubeMapTextureSide } from './GlCubeMapTextureSide';
import { ICubeMapTexture } from '../../resource/texture/ICubeMapTexture';
import { InternalFormat } from '../enum/InternalFormat';
import { vec2 } from 'gl-matrix';
import { GlConstants } from '../GlConstants';

export class GlCubeMapTexture extends GlTexture implements ICubeMapTexture {

    public static readonly SIDE_COUNT = 6;

    private sides: Map<CubeMapSide, GlCubeMapTextureSide>;
    private wrapW = TextureWrap.REPEAT;

    public constructor() {
        super();
        this.sides = new Map<CubeMapSide, GlCubeMapTextureSide>();
        for (let i = 0; i < GlCubeMapTexture.SIDE_COUNT; i++) {
            const side = CubeMapSideResolver.indexToEnum(i);
            this.sides.set(side, new GlCubeMapTextureSide(this, side));
        }
    }

    public getNativeTexture(): GlCubeMapTexture {
        return this;
    }

    protected getTarget(): number {
        return Gl.gl.TEXTURE_CUBE_MAP;
    }

    public allocate(internalFormat: InternalFormat, size: vec2, mipmaps: boolean): void {
        this.allocate2D(internalFormat, size, GlCubeMapTexture.SIDE_COUNT, mipmaps);
    }

    //
    //wrap--------------------------------------------------------------------------------------------------------------
    //
    public getWrapW(): TextureWrap {
        return this.wrapW;
    }

    public setWrapW(wrap: TextureWrap): void {
        this.wrapW = wrap;
        this.bind();
        Gl.gl.texParameteri(this.getTarget(), Gl.gl.TEXTURE_WRAP_R, TextureWrapResolver.enumToGl(wrap));
    }

    public getSide(side: CubeMapSide): GlCubeMapTextureSide {
        return this.sides.get(side);
    }

    public getSidesIterator(): IterableIterator<GlCubeMapTextureSide> {
        return this.sides.values();
    }

    public static getMaxSize(): number {
        return GlConstants.MAX_CUBE_MAP_TEXTURE_SIZE;
    }

    public static getMaxSizeSafe(): number {
        return GlConstants.MAX_CUBE_MAP_TEXTURE_SIZE_SAFE;
    }

}
