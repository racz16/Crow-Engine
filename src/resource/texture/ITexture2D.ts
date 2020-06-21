import { GlTexture2D } from '../../webgl/texture/GlTexture2D';
import { IResource } from '../IResource';
import { ReadonlyVec2 } from 'gl-matrix';

export interface ITexture2D extends IResource {

    getNativeTexture(): GlTexture2D;

    getSize(): ReadonlyVec2;

}