import { GlTexture2D } from '../../webgl/texture/GlTexture2D';
import { InternalFormat } from '../../webgl/enum/InternalFormat';
import { vec2 } from 'gl-matrix';
import { ITexture2D } from './ITexture2D';
import { TextureFiltering, TextureFilteringResolver } from './enum/TextureFiltering';
import { Utility } from '../../utility/Utility';
import { TextureType } from './enum/TextureType';
import { GlSampler } from '../../webgl/GlSampler';

export class Texture2D implements ITexture2D {

    private texture: GlTexture2D;
    private sampler: GlSampler;

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
        const internalFormat = hasAlphaChannel ? InternalFormat.RGBA32F : InternalFormat.RGB32F;
        const texture = GlTexture2D.createHdrTexture(image, internalFormat, true, flipY);
        return new Texture2D(texture, new GlSampler());
    }

    private static computeInternalFormat(hasAlphaChannel: boolean, type: TextureType): InternalFormat {
        if (type === TextureType.IMAGE) {
            return InternalFormat.SRGB8_A8;
        } else if (hasAlphaChannel && type === TextureType.DATA) {
            return InternalFormat.RGBA8;
        } else {
            return InternalFormat.RGB8;
        }
    }

    public bindToTextureUnit(textureUnit: number): void {
        this.texture.bindToTextureUnitWithSampler(textureUnit, this.sampler);
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