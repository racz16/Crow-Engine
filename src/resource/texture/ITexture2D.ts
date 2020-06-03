import { GlTexture2D } from '../../webgl/texture/GlTexture2D';
import { IResource } from '../IResource';
import { vec2 } from 'gl-matrix';

export interface ITexture2D extends IResource {

    bindToTextureUnit(textureUnit: number): void;

    getNativeTexture(): GlTexture2D;

    getSize(): vec2;

    getDataSize(): number;

}