import { ReadonlyVec3 } from 'gl-matrix';
import { FrustumCornerPoint } from './FrustumCornerPoint';
import { FrustumPlane } from './FrustumPlane';
import { FrustumSide } from './FrustumSide';
import { IInvalidatable } from '../../../utility/invalidatable/IInvalidatable';
import { ICameraComponent } from '../ICameraComponent';

export interface IFrustum extends IInvalidatable {

    getCenterPoint(): ReadonlyVec3;

    getCornerPointsIterator(): IterableIterator<ReadonlyVec3>;

    getCornerPoint(cornerPoint: FrustumCornerPoint): ReadonlyVec3;

    getPlanesIterator(): IterableIterator<FrustumPlane>;

    getPlane(side: FrustumSide): FrustumPlane;

    invalidate(sender?: any): void;

    getCameraComponent(): ICameraComponent

    _setCameraComponent(cameraComponent: ICameraComponent): void;

}