import { GlTexture2D } from '../../webgl/texture/GlTexture2D';
import { GlInternalFormat } from '../../webgl/enum/GlInternalFormat';
import { vec2 } from 'gl-matrix';
import { ITexture2D } from './ITexture2D';
import { TextureFiltering, TextureFilteringResolver } from './enum/TextureFiltering';
import { Utility } from '../../utility/Utility';
import { TextureType } from './enum/TextureType';
import { GlSampler } from '../../webgl/GlSampler';
import { TagContainer } from '../../core/TagContainer';

export class Texture2D implements ITexture2D {

    private texture: GlTexture2D;
    private sampler: GlSampler;

    private tagContainer = new TagContainer();

    public constructor(texture: GlTexture2D, sampler: GlSampler) {
        this.texture = texture;
        this.sampler = sampler;
    }

    public static async createNonHdr(path: string, hasAlphaChannel: boolean, type: TextureType, flipY = true): Promise<Texture2D> {
        const image = await Utility.loadImage(path);
        const sampler = new GlSampler();
        const internalFormat = this.computeInternalFormat(hasAlphaChannel, type);
        const texture = GlTexture2D.createTexture(image, internalFormat, true, flipY);
        return new Texture2D(texture, sampler);
    }

    public async createHdr(path: string, hasAlphaChannel: boolean, flipY = true): Promise<Texture2D> {
        const image = await Utility.loadHdrImage(path);
        const internalFormat = hasAlphaChannel ? GlInternalFormat.RGBA32F : GlInternalFormat.RGB32F;
        const size = vec2.fromValues(image.shape[0], image.shape[1]);
        const texture = GlTexture2D.createTextureFromBinary(image.data, size, internalFormat, true, flipY);
        return new Texture2D(texture, new GlSampler());
    }

    private static computeInternalFormat(hasAlphaChannel: boolean, type: TextureType): GlInternalFormat {
        if (type === TextureType.IMAGE) {
            return GlInternalFormat.SRGB8_A8;
        } else if (hasAlphaChannel && type === TextureType.DATA) {
            return GlInternalFormat.RGBA8;
        } else {
            return GlInternalFormat.RGB8;
        }
    }

    public setTextureFiltering(textureFiltering: TextureFiltering): void {
        this.sampler.setMinificationFilter(TextureFilteringResolver.enumToGlMinification(textureFiltering));
        this.sampler.setMagnificationFilter(TextureFilteringResolver.enumToGlMagnification(textureFiltering));
        this.sampler.setAnisotropicLevel(TextureFilteringResolver.enumToGlAnisotropicValue(textureFiltering));
    }

    public getNativeTexture(): GlTexture2D {
        return this.texture;
    }

    public getNativeSampler(): GlSampler {
        return this.sampler;
    }

    public getSize(): vec2 {
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