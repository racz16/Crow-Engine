import { GlTexture } from './GlTexture';
import { GlWrap, GlWrapResolver } from '../enum/GlWrap';
import { GlCubeMapSide, GlCubeMapSideResolver } from '../enum/GlCubeMapSide';
import { Gl } from '../Gl';
import { GlCubeMapTextureSide } from './GlCubeMapTextureSide';
import { ICubeMapTexture } from '../../resource/texture/ICubeMapTexture';
import { GlInternalFormat } from '../enum/GlInternalFormat';
import { vec2 } from 'gl-matrix';

export class GlCubeMapTexture extends GlTexture implements ICubeMapTexture {

    public static readonly SIDE_COUNT = 6;

    private readonly sides = new Map<GlCubeMapSide, GlCubeMapTextureSide>();
    private wrapW = GlWrap.REPEAT;

    public getNativeTexture(): GlCubeMapTexture {
        return this;
    }

    protected getTarget(): number {
        return Gl.gl.TEXTURE_CUBE_MAP;
    }

    public allocate(internalFormat: GlInternalFormat, size: vec2, mipmaps: boolean): void {
        this.allocate2D(internalFormat, size, GlCubeMapTexture.SIDE_COUNT, mipmaps);
        for (let i = 0; i < GlCubeMapTexture.SIDE_COUNT; i++) {
            const side = GlCubeMapSideResolver.indexToEnum(i);
            this.sides.set(side, new GlCubeMapTextureSide(this, side));
        }
    }

    //wrap
    public getWrapW(): GlWrap {
        return this.wrapW;
    }

    public setWrapW(wrap: GlWrap): void {
        this.wrapW = wrap;
        this.bind();
        Gl.gl.texParameteri(this.getTarget(), Gl.gl.TEXTURE_WRAP_R, GlWrapResolver.enumToGl(wrap));
    }

    public getSide(side: GlCubeMapSide): GlCubeMapTextureSide {
        return this.sides.get(side);
    }

    public getSidesIterator(): IterableIterator<GlCubeMapTextureSide> {
        return this.sides.values();
    }

}
