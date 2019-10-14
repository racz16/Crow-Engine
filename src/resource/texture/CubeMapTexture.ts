import { ICubeMapTexture } from './ICubeMapTexture';
import { GlCubeMapTexture } from '../../webgl/texture/GlCubeMapTexture';
import { InternalFormat } from '../../webgl/enum/InternalFormat';
import { vec2 } from 'gl-matrix';
import { CubeMapSideResolver } from '../../webgl/enum/CubeMapSide';
import { TextureFiltering, TextureFilteringResolver } from './enum/TextureFiltering';
import { Utility } from '../../utility/Utility';
import { TextureType } from './enum/TextureType';
import { Format } from '../../webgl/enum/Format';
import { HdrImageResult } from 'parse-hdr';

export class CubeMapTexture implements ICubeMapTexture {

    private texture: GlCubeMapTexture;
    private textureFiltering: TextureFiltering;
    private loaded = false;
    private readonly sides = ['right', 'left', 'top', 'bottom', 'front', 'back'];

    public constructor() {
        this.texture = new GlCubeMapTexture();
    }

    public async createTexture(paths: Array<string>, hasAlphaChannel = true, type = TextureType.IMAGE, textureFiltering: TextureFiltering): Promise<void> {
        const sideImages = await this.loadSideImages(paths);
        const internalFormat = this.computeInternalFormat(hasAlphaChannel, type);
        const format = internalFormat === InternalFormat.RGB8 ? Format.RGB : Format.RGBA;
        this.texture.allocate(internalFormat, vec2.fromValues(sideImages[0].width, sideImages[0].height), true);
        this.addTextureSides(sideImages, format);
        this.setTextureFiltering(textureFiltering);
        this.texture.generateMipmaps();
        this.loaded = true;
    }

    public async createHdrTexture(paths: Array<string>, hasAlphaChannel = true, textureFiltering: TextureFiltering): Promise<void> {
        const sideImages = await this.loadHdrSideImages(paths);
        const internalFormat = hasAlphaChannel ? InternalFormat.RGBA32F : InternalFormat.RGB32F;
        const format = internalFormat === InternalFormat.RGB32F ? Format.RGB : Format.RGBA;
        this.texture.allocate(internalFormat, vec2.fromValues(sideImages[0].shape[0], sideImages[0].shape[1]), true);
        this.addHdrTextureSides(sideImages, format);
        this.setTextureFiltering(textureFiltering);
        this.texture.generateMipmaps();
        this.loaded = true;
    }

    public async createHdrTextureWithMipmaps(/*name: string, mipmapCount: number,*/paths:Array<string>, hasAlphaChannel = true, textureFiltering: TextureFiltering): Promise<void> {
        /*const paths = new Array<string>();
        for (let i = 0; i < this.sides.length; i++) {
            const side = this.sides[i];
            for (let mipmapLevel = 0; mipmapLevel < mipmapCount; mipmapLevel++) {
                paths.push(`res/textures/pisa/specular/${name}_${side}_${mipmapLevel}.hdr`);
            }
        }*/
        const mipmapCount = 10;
        const images = await this.loadHdrSideImages(paths);
        const internalFormat = hasAlphaChannel ? InternalFormat.RGBA32F : InternalFormat.RGB32F;
        const format = internalFormat === InternalFormat.RGB32F ? Format.RGB : Format.RGBA;
        this.texture.allocate(internalFormat, vec2.fromValues(images[0].shape[0], images[0].shape[1]), true);
        for (let i = 0; i < this.sides.length; i++) {
            const sideImages = images.slice(i * mipmapCount, i * mipmapCount + mipmapCount);
            const side = CubeMapSideResolver.indexToEnum(i);
            for (let mipmapLevel = 0; mipmapLevel < mipmapCount; mipmapLevel++) {
                const image = sideImages[mipmapLevel];
                this.texture.getSide(side).storeHdr(image.data, vec2.fromValues(image.shape[0], image.shape[1]), format, false, mipmapLevel);
            }
        }
        this.setTextureFiltering(textureFiltering);
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

    private async loadHdrSideImages(paths: Array<string>): Promise<Array<HdrImageResult>> {
        const promises = new Array<Promise<HdrImageResult>>();
        for (const path of paths) {
            promises.push(Utility.loadHdrImage(path));
        }
        return await Promise.all(promises);
        /*return await Promise.all([
            await Utility.loadHdrImage(paths[0]),
            await Utility.loadHdrImage(paths[1]),
            await Utility.loadHdrImage(paths[2]),
            await Utility.loadHdrImage(paths[3]),
            await Utility.loadHdrImage(paths[4]),
            await Utility.loadHdrImage(paths[5]),
        ]);*/
    }

    private addTextureSides(sideImages: Array<HTMLImageElement>, format: Format): void {
        for (let i = 0; i < GlCubeMapTexture.SIDE_COUNT; i++) {
            const side = CubeMapSideResolver.indexToEnum(i);
            this.texture.getSide(side).store(sideImages[i], format);
        }
    }

    private addHdrTextureSides(sideImages: Array<HdrImageResult>, format: Format): void {
        for (let i = 0; i < GlCubeMapTexture.SIDE_COUNT; i++) {
            const side = CubeMapSideResolver.indexToEnum(i);
            const image = sideImages[i];
            this.texture.getSide(side).storeHdr(image.data, vec2.fromValues(image.shape[0], image.shape[1]), format);
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