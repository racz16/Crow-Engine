import { GlTexture2D } from '../../webgl/texture/GlTexture2D';
import { IResource } from '../IResource';
import { ReadonlyVec2 } from 'gl-matrix';
import { GlSampler } from '../../webgl/GlSampler';

export interface ITexture2D extends IResource {

    getNativeTexture(): GlTexture2D;

    getNativeSampler(): GlSampler;

    getSize(): ReadonlyVec2;

}