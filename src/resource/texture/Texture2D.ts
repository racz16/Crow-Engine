import { GlTexture2D } from "../../webgl/texture/GlTexture2D";
import { InternalFormat } from "../../webgl/enum/InternalFormat";
import { vec2 } from "gl-matrix";
import { ITexture2D } from "./ITexture2D";
import { TextureFiltering, TextureFilteringResolver } from "./TextureFiltering";
import { Utility } from "../../utility/Utility";

export class Texture2D implements ITexture2D {

    private texture: GlTexture2D;
    private textureFiltering: TextureFiltering;
    public loaded = false;

    private static defaultTexture: Texture2D;

    public static getDefaultTexture(): Texture2D {
        if (!Utility.isUsable(this.defaultTexture)) {
            this.defaultTexture = new Texture2D();
        }
        return this.defaultTexture;
    }

    public constructor(path?: string, textureFiltering = TextureFiltering.None) {
        if (path) {
            this.createTextureFromImage(path, textureFiltering);
        } else {
            this.createEmptyTexture();
        }
    }

    private createEmptyTexture(): void {
        this.texture = new GlTexture2D();
        this.texture.allocate(InternalFormat.R8, vec2.fromValues(1, 1), false);
        this.loaded = true;
    }

    private createTextureFromImage(path: string, textureFiltering: TextureFiltering): void {
        const image = new Image();
        image.src = path;
        image.onload = () => {
            this.texture = new GlTexture2D();
            this.texture.allocate(InternalFormat.RGBA8, vec2.fromValues(image.width, image.height), true);
            this.texture.store(image);
            this.texture.generateMipmaps();
            this.loaded = true;
            this.setTextureFiltering(textureFiltering);
        }
    }

    public getTextureFiltering(): TextureFiltering {
        return this.textureFiltering;
    }

    public setTextureFiltering(textureFiltering: TextureFiltering): void {
        if (this.loaded) {
            this.textureFiltering = textureFiltering;
            this.texture.setMinificationFilter(TextureFilteringResolver.enumToGlMinification(textureFiltering));
            this.texture.setMagnificationFilter(TextureFilteringResolver.enumToGlMagnification(textureFiltering));
            this.texture.setAnisotropicLevel(TextureFilteringResolver.enumToGlAnisotropicValue(textureFiltering));
        }
    }

    public getNativeTexture(): GlTexture2D {
        return this.texture;
    }

    public bindToTextureUnit(textureUnit: number): void {
        this.texture.bindToTextureUnit(textureUnit);
    }

    public isUsable(): boolean {
        return this.texture.isUsable();
    }

    public release(): void {
        this.texture.release();
    }

}