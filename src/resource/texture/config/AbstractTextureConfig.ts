import { TextureConfigElement } from './TextureConfigElement';

export abstract class AbstractTextureConfig<T extends TextureConfigElement> {

    private elements: Array<T>;
    private alphaChannel: boolean;
    private generateMipmaps: boolean;

    public constructor(elements: Array<T>, alphaChannel = true, generateMipmaps = true) {
        this.setElements(elements);
        this.setAlphaChannel(alphaChannel);
        this.setGenerateMipmaps(generateMipmaps);
    }

    public getElements(): Array<T> {
        return this.elements;
    }

    public setElements(elements: Array<T>): void {
        this.elements = elements;
    }

    public hasAlphaChannel(): boolean {
        return this.alphaChannel;
    }

    public setAlphaChannel(alphaChannel: boolean): void {
        this.alphaChannel = alphaChannel;
    }

    public isGenerateMipmaps(): boolean {
        return this.generateMipmaps;
    }

    public setGenerateMipmaps(generateMipmaps: boolean): void {
        this.generateMipmaps = generateMipmaps;
    }

}