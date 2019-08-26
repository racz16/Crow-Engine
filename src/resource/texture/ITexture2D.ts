import { GlTexture2D } from '../../webgl/texture/GlTexture2D';
import { IResource } from '../IResource';

export interface ITexture2D extends IResource {

    getNativeTexture(): GlTexture2D;

    bindToTextureUnit(textureUnit: number): void;

}