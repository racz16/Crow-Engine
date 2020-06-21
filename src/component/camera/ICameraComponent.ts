import { ReadonlyMat4 } from 'gl-matrix';
import { Frustum } from './frustum/Frustum';
import { IComponent } from '../IComponent';
import { CameraType } from './CameraType';

export interface ICameraComponent extends IComponent {

    getViewMatrix(): ReadonlyMat4;

    getProjectionMatrix(): ReadonlyMat4;

    getFrustum(): Frustum;

    getType(): CameraType;

    getHorizontalScale(): number;

    getVerticalalScale(): number;

    getFov(): number;

    getAspectRatio(): number;

    getNearPlaneDistance(): number;

    getFarPlaneDistance(): number;

}
