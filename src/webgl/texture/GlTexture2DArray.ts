import { Gl } from '../Gl';
import { GlTexture } from './GlTexture';
import { ReadonlyVec2 } from 'gl-matrix';
import { GlInternalFormat } from '../enum/GlInternalFormat';
import { GlTexture2DArrayLayer } from './GlTexture2DArrayLayer';
import { ITexture2DArray } from '../../resource/texture/ITexture2DArray';

export class GlTexture2DArray extends GlTexture implements ITexture2DArray {

    private readonly textureLayers = new Map<number, GlTexture2DArrayLayer>();

    protected getTarget(): number {
        return Gl.gl.TEXTURE_2D_ARRAY;
    }

    public getNativeTexture(): GlTexture2DArray {
        return this;
    }

    public allocate(internalFormat: GlInternalFormat, size: ReadonlyVec2, layers: number, mipmaps: boolean): void {
        this.allocate3D(internalFormat, size, layers, mipmaps);
        for (let i = 0; i < layers; i++) {
            this.textureLayers.set(i, new GlTexture2DArrayLayer(this, i));
        }
    }

    public getLayer(layer: number): GlTexture2DArrayLayer {
        return this.textureLayers.get(layer);
    }

    public getLayersIterator(): IterableIterator<GlTexture2DArrayLayer> {
        return this.textureLayers.values();
    }

}