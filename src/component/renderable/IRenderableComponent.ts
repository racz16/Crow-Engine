import { IComponent } from '../IComponent';
import { IRenderable } from '../../resource/IRenderable';
import { Material } from '../../material/Material';
import { vec2, mat4 } from 'gl-matrix';
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

    isTwoSided(): boolean;

    isMaterialActive(): boolean;

    getVisibilityInterval(): vec2;

    getModelMatrix(): mat4;

    getInverseModelMatrix(): mat4;

    getFaceCount(): number;

    draw(): void;

}