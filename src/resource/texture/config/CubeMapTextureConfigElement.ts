import { TextureConfigElement } from './TextureConfigElement';
import { CubeMapTextureSide } from '../enum/CubeMapTextureSide';

export class CubeMapTextureConfigElement extends TextureConfigElement {

    private side: CubeMapTextureSide;

    public constructor(path: string, side: CubeMapTextureSide, flipY = true, mipmapLevel = 0) {
        super(path, flipY, mipmapLevel);
        this.setSide(side);
    }

    public getSide(): CubeMapTextureSide {
        return this.side;
    }

    public setSide(side: CubeMapTextureSide): void {
        this.side = side;
    }

}