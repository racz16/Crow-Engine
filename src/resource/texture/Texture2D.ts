import { GlTexture2D } from '../../webgl/texture/GlTexture2D';
import { InternalFormat, InternalFormatResolver } from '../../webgl/enum/InternalFormat';
import { vec2 } from 'gl-matrix';
import { ITexture2D } from './ITexture2D';
import { TextureFiltering, TextureFilteringResolver } from './enum/TextureFiltering';
import { Utility } from '../../utility/Utility';
import { TextureType } from './enum/TextureType';
import { Format } from '../../webgl/enum/Format';

export class Texture2D implements ITexture2D {

    private texture: GlTexture2D;
    private textureFiltering: TextureFiltering;
    private loaded = false;

    public constructor(path?: string, hasAlphaChannel = true, type = TextureType.IMAGE, textureFiltering = TextureFiltering.None) {
        this.createTexture(path, hasAlphaChannel, type, textureFiltering);
    }

    private async createTexture(path: string, hasAlphaChannel = true, type = TextureType.IMAGE, textureFiltering: TextureFiltering): Promise<void> {
        this.texture = new GlTexture2D();
        const image = await Utility.loadImage(path);
        const internalFormat = this.computeInternalFormat(hasAlphaChannel, type);
        const format = internalFormat === InternalFormat.RGB8 ? Format.RGB : Format.RGBA;
        this.texture.allocate(internalFormat, vec2.fromValues(image.width, image.height), true);
        this.texture.store(image, format);
        this.setTextureFiltering(textureFiltering);
        this.texture.generateMipmaps();
        this.loaded = true;
    }

    private computeInternalFormat(hasAlphaChannel: boolean, type: TextureType): InternalFormat {
        if (type === TextureType.IMAGE) {
            return InternalFormat.SRGB8_A8;
        } else if (hasAlphaChannel && type === TextureType.DATA) {
            return InternalFormat.RGBA8;
        } else {
            return InternalFormat.RGB8;
        }
    }

    public getTextureFiltering(): TextureFiltering {
        return this.textureFiltering;
    }

    public setTextureFiltering(textureFiltering: TextureFiltering): void {
        this.textureFiltering = textureFiltering;
        this.texture.setMinificationFilter(TextureFilteringResolver.enumToGlMinification(textureFiltering));
        this.texture.setMagnificationFilter(TextureFilteringResolver.enumToGlMagnification(textureFiltering));
        this.texture.setAnisotropicLevel(TextureFilteringResolver.enumToGlAnisotropicValue(textureFiltering));
    }

    public getNativeTexture(): GlTexture2D {
        return this.texture;
    }

    public getSize(): vec2 {
        return this.texture.getSize();
    }

    public getDataSize(): number {
        return this.texture.getDataSize();
    }

    public isUsable(): boolean {
        return Utility.isUsable(this.texture) && this.loaded;
    }

    public release(): void {
        if (this.isUsable()) {
            this.texture.release();
            this.texture = null;
        }
    }

}