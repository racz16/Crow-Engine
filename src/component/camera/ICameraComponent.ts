import { ReadonlyMat4 } from 'gl-matrix';
import { IFrustum } from './frustum/IFrustum';
import { IComponent } from '../IComponent';
import { CameraType } from './CameraType';

export interface ICameraComponent extends IComponent {

    getViewMatrix(): ReadonlyMat4;

    getProjectionMatrix(): ReadonlyMat4;

    getFrustum(): IFrustum;

    getType(): CameraType;

    getHorizontalScale(): number;

    getVerticalalScale(): number;

    getFov(): number;

    getAspectRatio(): number;

    getNearPlaneDistance(): number;

    getFarPlaneDistance(): number;

}
