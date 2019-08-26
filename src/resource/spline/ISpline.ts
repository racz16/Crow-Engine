import { IRenderable } from '../IRenderable';
import { vec3 } from 'gl-matrix';

export interface ISpline extends IRenderable {

    isLoop(): boolean;

    getApproximatedLength(): number;

    getForwardVector(t: number): vec3;

    getApproximatedPosition(t: number): vec3;
}
