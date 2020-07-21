import { GlTexture } from '../../webgl/texture/GlTexture';
import { GlSampler } from '../../webgl/GlSampler';
import { TextureFiltering, TextureFilteringResolver } from './enum/TextureFiltering';
import { TextureWrap, TextureWrapResolver } from './enum/TextureWrap';
import { ReadonlyVec2 } from 'gl-matrix';
import { Utility } from '../../utility/Utility';
import { TextureConfigElement } from './config/TextureConfigElement';
import { HdrImageResult } from 'parse-hdr';

export abstract class AbstractTexture<T extends GlTexture> {

    protected texture: T;
    protected sampler: GlSampler;

    public constructor(texture: T, sampler: GlSampler) {
        this.texture = texture;
        this.sampler = sampler;
    }

    protected static async loadAllImages(elements: Array<TextureConfigElement>): Promise<Array<TexImageSource>> {
        return await Promise.all(elements.map(async element => {
            return Utility.loadImage(element.getPath());
        }));
    }

    protected static async loadAllHdrImages(elements: Array<TextureConfigElement>): Promise<Array<HdrImageResult>> {
        return await Promise.all(elements.map(async element => {
            return Utility.loadHdrImage(element.getPath());
        }));
    }

    public setTextureFiltering(textureFiltering: TextureFiltering): void {
        this.sampler.setMinificationFilter(TextureFilteringResolver.enumToGlMinification(textureFiltering));
        this.sampler.setMagnificationFilter(TextureFilteringResolver.enumToGlMagnification(textureFiltering));
        this.sampler.setAnisotropicLevel(TextureFilteringResolver.enumToGlAnisotropicValue(textureFiltering));
    }

    public setTextureWrapU(textureWrap: TextureWrap): void {
        this.sampler.setWrapU(TextureWrapResolver.enumToGl(textureWrap));
    }

    public setTextureWrapV(textureWrap: TextureWrap): void {
        this.sampler.setWrapV(TextureWrapResolver.enumToGl(textureWrap));
    }

    public getNativeTexture(): T {
        return this.texture;
    }

    public getNativeSampler(): GlSampler {
        return this.sampler;
    }

    public getSize(): ReadonlyVec2 {
        return this.texture.getSize();
    }

    public getDataSize(): number {
        return this.texture.getDataSize();
    }

    public getAllDataSize(): number {
        return this.getDataSize();
    }

    public isUsable(): boolean {
        return Utility.isUsable(this.sampler) && Utility.isUsable(this.texture);
    }

    public release(): void {
        if (this.isUsable()) {
            this.texture.release();
            this.texture = null;
            this.sampler.release();
            this.sampler = null;
        }
    }

}