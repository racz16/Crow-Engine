import { ICubeMapTexture } from './ICubeMapTexture';
import { GlCubeMapTexture } from '../../webgl/texture/GlCubeMapTexture';
import { GlInternalFormat } from '../../webgl/enum/GlInternalFormat';
import { vec2 } from 'gl-matrix';
import { GlCubeMapSideResolver } from '../../webgl/enum/GlCubeMapSide';
import { TextureFiltering, TextureFilteringResolver } from './enum/TextureFiltering';
import { Utility } from '../../utility/Utility';
import { TextureType } from './enum/TextureType';
import { GlFormat } from '../../webgl/enum/GlFormat';
import { HdrImageResult } from 'parse-hdr';
import { GlSampler } from '../../webgl/GlSampler';
import { TagContainer } from '../../core/TagContainer';

export class CubeMapTexture implements ICubeMapTexture {

    private texture: GlCubeMapTexture;
    private sampler: GlSampler;
    private textureFiltering: TextureFiltering
    private loaded = false;

    private tagContainer = new TagContainer();

    public constructor(paths: Array<string>, hasAlphaChannel = true, type = TextureType.IMAGE, textureFiltering = TextureFiltering.None) {
        this.sampler = new GlSampler();
        this.setTextureFiltering(textureFiltering);
        this.texture = new GlCubeMapTexture();
        const isHdr = paths[0].toLowerCase().endsWith('.hdr');
        if (isHdr) {
            this.createHdrTexture(paths, hasAlphaChannel);
        } else {
            this.createTexture(paths, hasAlphaChannel, type);
        }
    }

    private async createTexture(paths: Array<string>, hasAlphaChannel: boolean, type: TextureType): Promise<void> {
        const images = await this.loadImages(paths);
        const internalFormat = this.computeInternalFormat(hasAlphaChannel, type);
        const format = internalFormat === GlInternalFormat.RGB8 ? GlFormat.RGB : GlFormat.RGBA;
        this.texture.allocate(internalFormat, vec2.fromValues(images[0].width, images[0].height), true);
        this.addTextureSides(images, format);
        this.generateMipmapsIfNeeded(images.length);
        this.loaded = true;
    }

    private async createHdrTexture(paths: Array<string>, hasAlphaChannel: boolean): Promise<void> {
        const images = await this.loadHdrImages(paths);
        const internalFormat = hasAlphaChannel ? GlInternalFormat.RGBA32F : GlInternalFormat.RGB32F;
        const format = internalFormat === GlInternalFormat.RGB32F ? GlFormat.RGB : GlFormat.RGBA;
        this.texture.allocate(internalFormat, vec2.fromValues(images[0].shape[0], images[0].shape[1]), true);
        this.addHdrTextureSides(images, format);
        this.generateMipmapsIfNeeded(images.length);
        this.loaded = true;
    }

    private generateMipmapsIfNeeded(imageCount: number): void {
        if (imageCount === 6) {
            this.texture.generateMipmaps();
        }
    }

    private async loadImages(paths: Array<string>): Promise<Array<HTMLImageElement>> {
        return await Promise.all(
            paths.map(async path => {
                return Utility.loadImage(path);
            })
        );
    }

    private async loadHdrImages(paths: Array<string>): Promise<Array<HdrImageResult>> {
        return await Promise.all(
            paths.map(async path => {
                return Utility.loadHdrImage(path);
            })
        );
    }

    private addTextureSides(images: Array<HTMLImageElement>, format: GlFormat): void {
        const mipmapCount = images.length / GlCubeMapTexture.SIDE_COUNT;
        for (let i = 0; i < GlCubeMapTexture.SIDE_COUNT; i++) {
            const sideImages = images.slice(i * mipmapCount, i * mipmapCount + mipmapCount);
            const side = GlCubeMapSideResolver.indexToEnum(i);
            for (let mipmapLevel = 0; mipmapLevel < mipmapCount; mipmapLevel++) {
                const image = sideImages[mipmapLevel];
                this.texture.getSide(side).store(image, format, false, mipmapLevel);
            }
        }
    }

    private addHdrTextureSides(images: Array<HdrImageResult>, format: GlFormat): void {
        const mipmapCount = images.length / GlCubeMapTexture.SIDE_COUNT;
        for (let i = 0; i < GlCubeMapTexture.SIDE_COUNT; i++) {
            const sideImages = images.slice(i * mipmapCount, i * mipmapCount + mipmapCount);
            const side = GlCubeMapSideResolver.indexToEnum(i);
            for (let mipmapLevel = 0; mipmapLevel < mipmapCount; mipmapLevel++) {
                const image = sideImages[mipmapLevel];
                this.texture.getSide(side).storeFromBinary(image.data, vec2.fromValues(image.shape[0], image.shape[1]), format, false, mipmapLevel);
            }
        }
    }

    private computeInternalFormat(hasAlphaChannel: boolean, type: TextureType): GlInternalFormat {
        if (type === TextureType.IMAGE) {
            return GlInternalFormat.SRGB8_A8;
        } else if (hasAlphaChannel && type === TextureType.DATA) {
            return GlInternalFormat.RGBA8;
        } else {
            return GlInternalFormat.RGB8;
        }
    }

    public getTextureFiltering(): TextureFiltering {
        return this.textureFiltering;
    }

    public setTextureFiltering(textureFiltering: TextureFiltering): void {
        this.textureFiltering = textureFiltering;
        this.sampler.setMinificationFilter(TextureFilteringResolver.enumToGlMinification(textureFiltering));
        this.sampler.setMagnificationFilter(TextureFilteringResolver.enumToGlMagnification(textureFiltering));
        this.sampler.setAnisotropicLevel(TextureFilteringResolver.enumToGlAnisotropicValue(textureFiltering));
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

    public getAllDataSize(): number {
        return this.getDataSize();
    }

    public release(): void {
        if (this.isUsable()) {
            this.texture.release();
            this.texture = null;
            this.sampler.release();
            this.sampler = null;
        }
    }

    public isUsable(): boolean {
        return Utility.isUsable(this.sampler) && Utility.isUsable(this.texture) && this.loaded;
    }

}