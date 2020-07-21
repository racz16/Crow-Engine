import { ITexture2DArray } from './ITexture2DArray';
import { GlTexture2DArray } from '../../webgl/texture/GlTexture2DArray';
import { AbstractTexture } from './AbstractTexture';
import { Texture2DArrayConfig } from './config/Texture2DArrayConfig';
import { GlSampler } from '../../webgl/GlSampler';
import { HdrImageResult } from 'parse-hdr';
import { vec2 } from 'gl-matrix';
import { GlInternalFormat } from '../../webgl/enum/GlInternalFormat';
import { GlFormat } from '../../webgl/enum/GlFormat';

export class Texture2DArray extends AbstractTexture<GlTexture2DArray> implements ITexture2DArray {

    public getLayers(): number {
        return this.texture.getLayers();
    }

    public static async createTextureFromConfig(config: Texture2DArrayConfig): Promise<Texture2DArray> {
        const sampler = new GlSampler();
        const texture = new GlTexture2DArray();
        this.loadTexture(texture, config);
        return new Texture2DArray(texture, sampler);
    }

    public static async createHdrTextureFromConfig(config: Texture2DArrayConfig): Promise<Texture2DArray> {
        const sampler = new GlSampler();
        const texture = new GlTexture2DArray();
        this.loadHdrTexture(texture, config);
        return new Texture2DArray(texture, sampler);
    }

    private static async loadTexture(texture: GlTexture2DArray, config: Texture2DArrayConfig): Promise<void> {
        const images = await this.loadAllImages(config.getElements());
        this.allocateAndStore(texture, config, images);
        if (config.isGenerateMipmaps()) {
            texture.generateMipmaps();
        }
    }

    private static allocateAndStore(texture: GlTexture2DArray, config: Texture2DArrayConfig, images: Array<TexImageSource>): void {
        const mipmaps = config.isGenerateMipmaps() || config.getElements().some(e => e.getMipmapLevel() > 0);
        const internalFormat = config.hasAlphaChannel ? GlInternalFormat.RGBA8 : GlInternalFormat.RGB8;
        const format = internalFormat === GlInternalFormat.RGB8 ? GlFormat.RGB : GlFormat.RGBA;
        texture.allocate(internalFormat, vec2.fromValues(images[0].width, images[0].height), config.getLayerCount(), mipmaps);
        for (let i = 0; i < config.getElements().length; i++) {
            const image = images[i];
            const element = config.getElements()[i];
            texture.getLayer(element.getLayer()).store(image, format, element.isFlipY(), element.getMipmapLevel());
        }
    }

    private static async loadHdrTexture(texture: GlTexture2DArray, config: Texture2DArrayConfig): Promise<void> {
        const images = await this.loadAllHdrImages(config.getElements());
        this.allocateAndStoreHdr(texture, config, images);
        if (config.isGenerateMipmaps()) {
            texture.generateMipmaps();
        }
    }

    private static allocateAndStoreHdr(texture: GlTexture2DArray, config: Texture2DArrayConfig, images: Array<HdrImageResult>): void {
        const mipmaps = config.isGenerateMipmaps() || config.getElements().some(e => e.getMipmapLevel() > 0);
        const internalFormat = config.hasAlphaChannel() ? GlInternalFormat.RGBA32F : GlInternalFormat.RGB32F;
        const format = internalFormat === GlInternalFormat.RGB32F ? GlFormat.RGB : GlFormat.RGBA;
        texture.allocate(internalFormat, vec2.fromValues(images[0].shape[0], images[0].shape[1]), config.getLayerCount(), mipmaps);
        for (let i = 0; i < config.getElements().length; i++) {
            const image = images[i];
            const element = config.getElements()[i];
            texture.getLayer(element.getLayer()).storeFromBinary(image.data, vec2.fromValues(images[i].shape[0], images[i].shape[1]), format, element.isFlipY(), element.getMipmapLevel());
        }
    }

}