import { Gl } from "../Gl";
import { GlTexture } from "./GlTexture";
import { vec2 } from "gl-matrix";
import { InternalFormat } from "../enum/InternalFormat";
import { GlTexture2DArrayLayer } from "./GlTexture2DArrayLayer";
import { ITexture2DArray } from "../../resource/texture/ITexture2DArray";
import { GlConstants } from "../GlConstants";

export class GlTexture2DArray extends GlTexture implements ITexture2DArray {

    private readonly textureLayers = new Map<number, GlTexture2DArrayLayer>();

    protected getTarget(): number {
        return Gl.gl.TEXTURE_2D_ARRAY;
    }

    public getNativeTexture(): GlTexture2DArray {
        return this;
    }

    public allocate(internalFormat: InternalFormat, size: vec2, layers: number, mipmaps: boolean): void {
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

    public static getMaxSize(): number {
        return GlConstants.MAX_TEXTURE_SIZE;
    }

    public static getMaxSizeSafe(): number {
        return GlConstants.MAX_TEXTURE_SIZE_SAFE;
    }

    public static getMaxLayersCount(): number {
        return GlConstants.MAX_ARRAY_TEXTURE_LAYERS;
    }

    public static getMaxLayersCountSafe(): number {
        return GlConstants.MAX_ARRAY_TEXTURE_LAYERS_SAFE;
    }

}