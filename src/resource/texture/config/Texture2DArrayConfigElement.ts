import { TextureConfigElement } from "./TextureConfigElement";

export class Texture2DArrayConfigElement extends TextureConfigElement {

    private layer: number;

    public constructor(path: string, layer: number, flipY = true, mipmapLevel = 0) {
        super(path, flipY, mipmapLevel);
        this.setLayer(layer);
    }

    public getLayer(): number {
        return this.layer;
    }

    public setLayer(layer: number): void {
        this.layer = layer;
    }

}