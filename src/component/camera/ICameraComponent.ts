import { mat4 } from 'gl-matrix';
import { Frustum } from './frustum/Frustum';
import { IComponent } from '../IComponent';

export interface ICameraComponent extends IComponent {

    getViewMatrix(): mat4;

    getProjectionMatrix(): mat4;

    getFrustum(): Frustum;

    getFov(): number;

    getAspectRatio(): number;

    getNearPlaneDistance(): number;

    getFarPlaneDistance(): number;

}
