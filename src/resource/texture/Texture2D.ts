import { GlTexture2D } from '../../webgl/texture/GlTexture2D';
import { GlInternalFormat } from '../../webgl/enum/GlInternalFormat';
import { vec2 } from 'gl-matrix';
import { ITexture2D } from './ITexture2D';
import { GlSampler } from '../../webgl/GlSampler';
import { GlFormat } from '../../webgl/enum/GlFormat';
import { GlTextureDataType } from '../../webgl/enum/GlTextureDataType';
import { AbstractTexture } from './AbstractTexture';
import { Texture2DConfig } from './config/Texture2DConfig';
import { TextureConfigElement } from './config/TextureConfigElement';
import { HdrImageResult } from 'parse-hdr';

export class Texture2D extends AbstractTexture<GlTexture2D> implements ITexture2D {

    public static async createTexture(path: string, alphaChannel = true, generateMipmaps = true, flipY = true): Promise<Texture2D> {
        const element = new TextureConfigElement(path, flipY);
        const config = new Texture2DConfig([element], alphaChannel, generateMipmaps);
        return await this.createTextureFromConfig(config);
    }

    public static async createTextureFromConfig(config: Texture2DConfig): Promise<Texture2D> {
        const sampler = new GlSampler();
        const texture = new GlTexture2D();
        this.loadTexture(texture, config);
        return new Texture2D(texture, sampler);
    }

    public static async createHdrTextureFromConfig(config: Texture2DConfig): Promise<Texture2D> {
        const sampler = new GlSampler();
        const texture = new GlTexture2D();
        this.loadHdrTexture(texture, config);
        return new Texture2D(texture, sampler);
    }

    private static async loadTexture(texture: GlTexture2D, config: Texture2DConfig): Promise<void> {
        const images = await this.loadAllImages(config.getElements());
        this.allocateAndStore(texture, config, images);
        if (config.isGenerateMipmaps()) {
            texture.generateMipmaps();
        }
    }

    private static allocateAndStore(texture: GlTexture2D, config: Texture2DConfig, images: Array<TexImageSource>): void {
        const mipmaps = config.isGenerateMipmaps() || config.getElements().some(e => e.getMipmapLevel() > 0);
        const internalFormat = config.hasAlphaChannel ? GlInternalFormat.RGBA8 : GlInternalFormat.RGB8;
        const format = internalFormat === GlInternalFormat.RGB8 ? GlFormat.RGB : GlFormat.RGBA;
        texture.allocate(internalFormat, vec2.fromValues(images[0].width, images[0].height), mipmaps);
        for (let i = 0; i < config.getElements().length; i++) {
            const image = images[i];
            const element = config.getElements()[i];
            texture.store(image, format, element.isFlipY(), element.getMipmapLevel());
        }
    }

    private static async loadHdrTexture(texture: GlTexture2D, config: Texture2DConfig): Promise<void> {
        const images = await this.loadAllHdrImages(config.getElements());
        this.allocateAndStoreHdr(texture, config, images);
        if (config.isGenerateMipmaps()) {
            texture.generateMipmaps();
        }
    }

    private static allocateAndStoreHdr(texture: GlTexture2D, config: Texture2DConfig, images: Array<HdrImageResult>): void {
        const mipmaps = config.isGenerateMipmaps() || config.getElements().some(e => e.getMipmapLevel() > 0);
        const internalFormat = config.hasAlphaChannel() ? GlInternalFormat.RGBA32F : GlInternalFormat.RGB32F;
        const format = internalFormat === GlInternalFormat.RGB32F ? GlFormat.RGB : GlFormat.RGBA;
        texture.allocate(internalFormat, vec2.fromValues(images[0].shape[0], images[0].shape[1]), mipmaps);
        for (let i = 0; i < config.getElements().length; i++) {
            const image = images[i];
            const element = config.getElements()[i];
            texture.storeFromBinary(image.data, vec2.fromValues(images[i].shape[0], images[i].shape[1]), format, GlTextureDataType.FLOAT, element.isFlipY());
        }
    }

}