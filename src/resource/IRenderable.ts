import { IResource } from './IResource';
import { ReadonlyVec3 } from 'gl-matrix';

export interface IRenderable extends IResource {

    getVertexCount(): number;

    getObjectSpaceRadius(): number;

    getObjectSpaceAabbMin(): ReadonlyVec3;

    getObjectSpaceAabbMax(): ReadonlyVec3;

    draw(): void;

    update(): void;

    hasTextureCoordinates(): boolean;

    hasNormals(): boolean;

    hasTangents(): boolean;

    hasVertexColors(): boolean;

}
