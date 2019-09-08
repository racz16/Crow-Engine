import { GlCubeMapTexture } from '../../webgl/texture/GlCubeMapTexture';
import { IResource } from '../IResource';
import { vec2 } from 'gl-matrix';

export interface ICubeMapTexture extends IResource {

    getNativeTexture(): GlCubeMapTexture;

    getSize(): vec2;

    getDataSize(): number;

}