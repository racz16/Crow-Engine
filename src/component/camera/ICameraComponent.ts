import { IComponent } from "../IComponent";
import { mat4 } from "gl-matrix";
import { IFrustum } from "./frustum/IFrustum";

export interface ICameraComponent extends IComponent {

    getViewMatrix(): mat4;

    getProjectionMatrix(): mat4;

    getFrustum(): IFrustum;

    getFov(): number;

    getNearPlaneDistance(): number;

    getFarPlaneDistance(): number;

    isUsable(): boolean;

}
