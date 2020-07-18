import { GlCubeMapTexture } from '../../webgl/texture/GlCubeMapTexture';
import { IResource } from '../IResource';
import { ReadonlyVec2 } from 'gl-matrix';
import { GlSampler } from '../../webgl/GlSampler';

export interface ICubeMapTexture extends IResource {

    getNativeTexture(): GlCubeMapTexture;

    getNativeSampler(): GlSampler;

    getSize(): ReadonlyVec2;

}