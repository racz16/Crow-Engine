import { vec3 } from 'gl-matrix';
import { FrustumCornerPoint } from './FrustumCornerPoint';
import { FrustumPlane } from './FrustumPlane';
import { FrustumSide } from './FrustumSide';
import { ICameraComponent } from '../ICameraComponent';

export interface IFrustum {

    getCenterPoint(): vec3;

    getCornerPointsIterator(): IterableIterator<vec3>;

    getCornerPoint(cornerPoint: FrustumCornerPoint): vec3;

    getPlanesIterator(): IterableIterator<FrustumPlane>;

    getPlane(side: FrustumSide): FrustumPlane;

    getCameraComponent(): ICameraComponent;

    private_setCameraComponent(cameraComponent: ICameraComponent): void;

}