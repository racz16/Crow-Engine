import { ICubeMapTexture } from './ICubeMapTexture';
import { GlCubeMapTexture } from '../../webgl/texture/GlCubeMapTexture';
import { GlInternalFormat } from '../../webgl/enum/GlInternalFormat';
import { vec2 } from 'gl-matrix';
import { GlFormat } from '../../webgl/enum/GlFormat';
import { HdrImageResult } from 'parse-hdr';
import { GlSampler } from '../../webgl/GlSampler';
import { TextureWrap, TextureWrapResolver } from './enum/TextureWrap';
import { AbstractTexture } from './AbstractTexture';
import { CubeMapTextureConfig } from './config/CubeMapTextureConfig';
import { CubeMapTextureSideResolver } from './enum/CubeMapTextureSide';

export class CubeMapTexture extends AbstractTexture<GlCubeMapTexture> implements ICubeMapTexture {

    public static async createTextureFromConfig(config: CubeMapTextureConfig): Promise<CubeMapTexture> {
        const sampler = new GlSampler();
        const texture = new GlCubeMapTexture();
        this.loadTexture(texture, config);
        return new CubeMapTexture(texture, sampler);
    }

    public static async createHdrTextureFromConfig(config: CubeMapTextureConfig): Promise<CubeMapTexture> {
        const sampler = new GlSampler();
        const texture = new GlCubeMapTexture();
        this.loadHdrTexture(texture, config);
        return new CubeMapTexture(texture, sampler);
    }

    private static async loadTexture(texture: GlCubeMapTexture, config: CubeMapTextureConfig): Promise<void> {
        const images = await this.loadAllImages(config.getElements());
        this.allocateAndStore(texture, config, images);
        if (config.isGenerateMipmaps()) {
            texture.generateMipmaps();
        }
    }

    private static allocateAndStore(texture: GlCubeMapTexture, config: CubeMapTextureConfig, images: Array<TexImageSource>): void {
        const mipmaps = config.isGenerateMipmaps() || config.getElements().some(e => e.getMipmapLevel() > 0);
        const internalFormat = config.hasAlphaChannel ? GlInternalFormat.RGBA8 : GlInternalFormat.RGB8;
        const format = internalFormat === GlInternalFormat.RGB8 ? GlFormat.RGB : GlFormat.RGBA;
        texture.allocate(internalFormat, vec2.fromValues(images[0].width, images[0].height), mipmaps);
        for (let i = 0; i < config.getElements().length; i++) {
            const image = images[i];
            const element = config.getElements()[i];
            const side = CubeMapTextureSideResolver.enumToGl(element.getSide());
            texture.getSide(side).store(image, format, element.isFlipY(), element.getMipmapLevel());
        }
    }

    private static async loadHdrTexture(texture: GlCubeMapTexture, config: CubeMapTextureConfig): Promise<void> {
        const images = await this.loadAllHdrImages(config.getElements());
        this.allocateAndStoreHdr(texture, config, images);
        if (config.isGenerateMipmaps()) {
            texture.generateMipmaps();
        }
    }

    private static allocateAndStoreHdr(texture: GlCubeMapTexture, config: CubeMapTextureConfig, images: Array<HdrImageResult>): void {
        const mipmaps = config.isGenerateMipmaps() || config.getElements().some(e => e.getMipmapLevel() > 0);
        const internalFormat = config.hasAlphaChannel() ? GlInternalFormat.RGBA32F : GlInternalFormat.RGB32F;
        const format = internalFormat === GlInternalFormat.RGB32F ? GlFormat.RGB : GlFormat.RGBA;
        texture.allocate(internalFormat, vec2.fromValues(images[0].shape[0], images[0].shape[1]), mipmaps);
        for (let i = 0; i < config.getElements().length; i++) {
            const image = images[i];
            const element = config.getElements()[i];
            const side = CubeMapTextureSideResolver.enumToGl(element.getSide());
            texture.getSide(side).storeFromBinary(image.data, vec2.fromValues(images[i].shape[0], images[i].shape[1]), format, element.isFlipY(), element.getMipmapLevel());
        }
    }

    public setTextureWrapW(textureWrap: TextureWrap): void {
        this.sampler.setWrapW(TextureWrapResolver.enumToGl(textureWrap));
    }

}