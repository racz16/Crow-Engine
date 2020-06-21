import { IRenderable } from '../IRenderable';
import { ReadonlyVec3 } from 'gl-matrix';

export interface ISpline extends IRenderable {

    isLoop(): boolean;

    getApproximatedLength(): number;

    getForwardVector(t: number): ReadonlyVec3;

    getApproximatedPosition(t: number): ReadonlyVec3;

}
