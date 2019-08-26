import { IComponent } from '../IComponent';
import { IRenderable } from '../../resource/IRenderable';
import { Material } from '../../material/Material';
import { IBoundingShape } from './boundingshape/IBoundingShape';
import { vec2, mat4 } from 'gl-matrix';
import { IBillboard } from './billboard/IBillboard';

export interface IRenderableComponent<T extends IRenderable> extends IComponent {

    getRenderable(): T;

    getMaterial(): Material<any>;

    getBoundingShape(): IBoundingShape;

    getBillboard(): IBillboard;

    isReflectable(): boolean;

    isCastShadow(): boolean;

    isReceiveShadows(): boolean;

    isMaterialActive(): boolean;

    getVisibilityInterval(): vec2;

    getModelMatrix(): mat4;

    getInverseModelMatrix(): mat4;

    getFaceCount(): number;

    draw(): void;

}