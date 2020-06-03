import { mat4 } from 'gl-matrix';
import { Frustum } from './frustum/Frustum';
import { IComponent } from '../IComponent';
import { CameraType } from './CameraType';

export interface ICameraComponent extends IComponent {

    getViewMatrix(): mat4;

    getProjectionMatrix(): mat4;

    getFrustum(): Frustum;

    getType(): CameraType;

    getHorizontalScale(): number;

    getVerticalalScale(): number;

    getFov(): number;

    getAspectRatio(): number;

    getNearPlaneDistance(): number;

    getFarPlaneDistance(): number;

}
