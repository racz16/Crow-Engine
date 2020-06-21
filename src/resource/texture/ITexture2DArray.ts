import { IResource } from '../IResource';
import { ReadonlyVec2 } from 'gl-matrix';
import { GlTexture2DArray } from '../../webgl/texture/GlTexture2DArray';

export interface ITexture2DArray extends IResource {

    getNativeTexture(): GlTexture2DArray;

    getSize(): ReadonlyVec2;

    getLayers(): number;

}