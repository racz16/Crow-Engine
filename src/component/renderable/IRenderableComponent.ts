import { IComponent } from '../IComponent';
import { IRenderable } from '../../resource/IRenderable';
import { Material } from '../../material/Material';
import { ReadonlyMat4, ReadonlyVec2, ReadonlyVec3, ReadonlyQuat } from 'gl-matrix';
import { BoundingShape } from './boundingshape/BoundingShape';
import { Billboard } from './billboard/Billboard';

export interface IRenderableComponent<T extends IRenderable> extends IComponent {

    getRenderable(): T;

    getMaterial(): Material<any>;

    getBoundingShape(): BoundingShape;

    getBillboard(): Billboard;

    isCastShadow(): boolean;

    isReceiveShadows(): boolean;

    isMaterialActive(): boolean;

    getVisibilityInterval(): ReadonlyVec2;

    getModelMatrix(): ReadonlyMat4;

    getInverseModelMatrix(): ReadonlyMat4;

    getForwardVector(): ReadonlyVec3;

    getRightVector(): ReadonlyVec3;

    getUpVector(): ReadonlyVec3;

    getRelativeRotation(): ReadonlyQuat;

    getAbsoluteRotation(): ReadonlyQuat;

    getFaceCount(): number;

    draw(): void;

}