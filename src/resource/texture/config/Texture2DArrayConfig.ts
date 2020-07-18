import { AbstractTextureConfig } from "./AbstractTextureConfig";
import { Texture2DArrayConfigElement } from "./Texture2DArrayConfigElement";

export class Texture2DArrayConfig extends AbstractTextureConfig<Texture2DArrayConfigElement> {

    private layerCount: number;

    public constructor(elements: Array<Texture2DArrayConfigElement>, layerCount: number, alphaChannel = true, generateMipmaps = true) {
        super(elements, alphaChannel, generateMipmaps);
        this.setLayerCount(layerCount);
    }

    public getLayerCount(): number {
        return this.layerCount;
    }

    public setLayerCount(layerCount: number): void {
        this.layerCount = layerCount;
    }

}