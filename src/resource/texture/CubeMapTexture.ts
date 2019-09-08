import { ICubeMapTexture } from './ICubeMapTexture';
import { GlCubeMapTexture } from '../../webgl/texture/GlCubeMapTexture';
import { InternalFormat } from '../../webgl/enum/InternalFormat';
import { vec2 } from 'gl-matrix';
import { CubeMapSideResolver } from '../../webgl/enum/CubeMapSide';
import { TextureFiltering, TextureFilteringResolver } from './enum/TextureFiltering';
import { Utility } from '../../utility/Utility';
import { TextureType } from './enum/TextureType';
import { Format } from '../../webgl/enum/Format';

export class CubeMapTexture implements ICubeMapTexture {

    private texture: GlCubeMapTexture;
    private textureFiltering: TextureFiltering;
    private loaded = false;

    public constructor(paths?: Array<string>, hasAlphaChannel = true, type = TextureType.IMAGE, textureFiltering = TextureFiltering.None) {
        this.createTexture(paths, hasAlphaChannel, type, textureFiltering);
    }

    private async createTexture(paths: Array<string>, hasAlphaChannel = true, type = TextureType.IMAGE, textureFiltering: TextureFiltering): Promise<void> {
        this.texture = new GlCubeMapTexture();
        const sideImages = await this.loadSideImages(paths);
        const internalFormat = this.computeInternalFormat(hasAlphaChannel, type);
        const format = internalFormat === InternalFormat.RGB8 ? Format.RGB : Format.RGBA;
        this.texture.allocate(internalFormat, vec2.fromValues(sideImages[0].width, sideImages[0].height), true);
        this.addTextureSides(sideImages, format);
        this.setTextureFiltering(textureFiltering);
        this.texture.generateMipmaps();
        this.loaded = true;
    }

    private async loadSideImages(paths: Array<string>): Promise<Array<HTMLImageElement>> {
        return await Promise.all([
            await Utility.loadImage(paths[0]),
            await Utility.loadImage(paths[1]),
            await Utility.loadImage(paths[2]),
            await Utility.loadImage(paths[3]),
            await Utility.loadImage(paths[4]),
            await Utility.loadImage(paths[5]),
        ]);
    }

    private addTextureSides(sideImages: Array<HTMLImageElement>, format: Format): void {
        for (let i = 0; i < GlCubeMapTexture.SIDE_COUNT; i++) {
            const side = CubeMapSideResolver.indexToEnum(i);
            this.texture.getSide(side).store(sideImages[i], format);
        }
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

    public getNativeTexture(): GlCubeMapTexture {
        return this.texture;
    }

    public getSize(): vec2 {
        return this.texture.getSize();
    }

    public getDataSize(): number {
        return this.texture.getDataSize();
    }

    public release(): void {
        if (this.isUsable()) {
            this.texture.release();
            this.texture = null;
        }
    }

    public isUsable(): boolean {
        return Utility.isUsable(this.texture) && this.loaded;
    }

}