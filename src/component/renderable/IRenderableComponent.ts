import { IComponent } from '../IComponent';
import { IRenderable } from '../../resource/IRenderable';
import { Material } from '../../material/Material';
import { ReadonlyMat4, ReadonlyVec2 } from 'gl-matrix';
import { BoundingShape } from './boundingshape/BoundingShape';
import { Billboard } from './billboard/Billboard';

export interface IRenderableComponent<T extends IRenderable> extends IComponent {

    getRenderable(): T;

    getMaterial(): Material<any>;

    getBoundingShape(): BoundingShape;

    getBillboard(): Billboard;

    isReflectable(): boolean;

    isCastShadow(): boolean;

    isReceiveShadows(): boolean;

    isMaterialActive(): boolean;

    getVisibilityInterval(): ReadonlyVec2;

    getModelMatrix(): ReadonlyMat4;

    getInverseModelMatrix(): ReadonlyMat4;

    getFaceCount(): number;

    draw(): void;

}