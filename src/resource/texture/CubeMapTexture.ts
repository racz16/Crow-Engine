import { ICubeMapTexture } from './ICubeMapTexture';
import { GlCubeMapTexture } from '../../webgl/texture/GlCubeMapTexture';
import { InternalFormat } from '../../webgl/enum/InternalFormat';
import { vec2 } from 'gl-matrix';
import { CubeMapSideResolver } from '../../webgl/enum/CubeMapSide';
import { TextureFiltering, TextureFilteringResolver } from './TextureFiltering';
import { Gl } from '../../webgl/Gl';
import { Utility } from '../../utility/Utility';

export class CubeMapTexture implements ICubeMapTexture {

    private texture: GlCubeMapTexture;
    public loaded = 0;

    private static defaultTexture: CubeMapTexture;

    public static getDefaultTexture(): CubeMapTexture {
        if (!Utility.isUsable(this.defaultTexture)) {
            this.defaultTexture = new CubeMapTexture();
        }
        return this.defaultTexture;
    }

    public constructor(paths?: Array<string>, textureFiltering = TextureFiltering.None) {
        if (paths) {
            this.createTextureFromImage(paths, textureFiltering);
        } else {
            this.createEmptyTexture();
        }
    }

    private createEmptyTexture(): void {
        this.texture = new GlCubeMapTexture();
        this.texture.allocate(InternalFormat.R8, vec2.fromValues(1, 1), false);
        this.loaded = 6;
    }

    private createTextureFromImage(paths: Array<string>, textureFiltering: TextureFiltering): void {
        this.texture = new GlCubeMapTexture();
        for (let i = 0; i < 6; i++) {
            const path = paths[i];
            const side = CubeMapSideResolver.indexToEnum(i);
            const image = new Image();
            image.src = path;
            image.onload = () => {
                if (!this.texture.isAllocated()) {
                    this.texture.allocate(InternalFormat.RGBA8, vec2.fromValues(image.width, image.height), true);
                }
                this.texture.getSide(side).store(image);
                this.loaded++;
                if (this.allResourcesLoaded()) {
                    this.texture.generateMipmaps();
                    this.texture.setMinificationFilter(TextureFilteringResolver.enumToGlMinification(textureFiltering));
                    this.texture.setMagnificationFilter(TextureFilteringResolver.enumToGlMagnification(textureFiltering));
                    this.texture.setAnisotropicLevel(TextureFilteringResolver.enumToGlAnisotropicValue(textureFiltering));
                }
            }
        }
    }

    public allResourcesLoaded(): boolean {
        return this.loaded === 6;
    }

    public getNativeTexture(): GlCubeMapTexture {
        return this.texture;
    }

    public bindToTextureUnit(textureUnit: number): void {
        this.texture.bindToTextureUnit(textureUnit);
    }

    public release(): void {
        this.texture.release();
    }

    public isUsable(): boolean {
        return this.texture.isUsable();
    }


}