import { GlCubeMapTexture } from '../../webgl/texture/GlCubeMapTexture';
import { IResource } from '../IResource';
import { ReadonlyVec2 } from 'gl-matrix';

export interface ICubeMapTexture extends IResource {

    getNativeTexture(): GlCubeMapTexture;

    getSize(): ReadonlyVec2;

}