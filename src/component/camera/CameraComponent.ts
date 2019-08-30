import { Component } from '../Component';
import { ICameraComponent } from './ICameraComponent';
import { mat4 } from 'gl-matrix';
import { Scene } from '../../core/Scene';
import { Utility } from '../../utility/Utility';
import { GameObject } from '../../core/GameObject';
import { SimpleFrustum } from './frustum/SimpleFrustum';
import { Frustum } from './frustum/Frustum';
import { Log } from '../../utility/log/Log';
import { LogLevel } from '../../utility/log/LogLevel';

export class CameraComponent extends Component implements ICameraComponent {

    private viewMatrix: mat4;
    private projectionMatrix: mat4;
    private frustum: Frustum;
    private nearPlaneDistance: number;
    private farPlaneDistance: number;
    private fov: number;
    private aspectRatio: number;

    public constructor(fov = 55, aspectRatio = 1, nearPlane = 0.1, farPlane = 200) {
        super();
        this.setFrustum(new SimpleFrustum());
        this.setFov(fov);
        this.setAspectRatio(aspectRatio);
        this.setNearPlaneDistance(nearPlane);
        this.setFarPlaneDistance(farPlane);
    }

    public getFov(): number {
        return this.fov;
    }

    public setFov(fov: number): void {
        if (fov <= 0 || fov >= 180) {
            throw new Error();
        }
        this.fov = fov;
        this.invalidate();
    }

    public getAspectRatio(): number {
        return this.aspectRatio;
    }

    public setAspectRatio(aspectRatio: number): void {
        if (aspectRatio <= 0) {
            throw new Error();
        }
        this.aspectRatio = aspectRatio;
        this.invalidate();
    }

    public getNearPlaneDistance(): number {
        return this.nearPlaneDistance;
    }

    public setNearPlaneDistance(nearPlaneDistance: number): void {
        if (nearPlaneDistance <= 0 || nearPlaneDistance >= this.farPlaneDistance) {
            throw new Error();
        }
        this.nearPlaneDistance = nearPlaneDistance;
        this.invalidate();
    }

    public getFarPlaneDistance(): number {
        return this.farPlaneDistance;
    }

    public setFarPlaneDistance(farPlaneDistance: number): void {
        if (this.nearPlaneDistance >= farPlaneDistance) {
            throw new Error();
        }
        this.farPlaneDistance = farPlaneDistance;
        this.invalidate();
    }

    protected refresh(): void {
        if (!this.isValid()) {
            if (this.isTheMainCamera()) {
                this.setAspectRatio(Utility.getCanvasAspectRatio());
            }
            this.refreshProjectionMatrix();
            this.refreshViewMatrix();
            Log.logString(LogLevel.INFO_3, 'Camera matrices refreshed');
        }
    }

    private refreshProjectionMatrix(): void {
        this.projectionMatrix = Utility.computePerspectiveProjectionMatrix(this.fov, this.aspectRatio, this.nearPlaneDistance, this.farPlaneDistance);
    }

    private refreshViewMatrix(): void {
        if (this.getGameObject()) {
            const transform = this.getGameObject().getTransform();
            const position = transform.getAbsolutePosition();
            const rotation = transform.getAbsoluteRotation();
            this.viewMatrix = Utility.computeViewMatrix(position, rotation);
            this.setValid(true);
        }
    }

    public getViewMatrix(): mat4 {
        if (this.getGameObject()) {
            this.refresh();
            return mat4.clone(this.viewMatrix);
        } else {
            return null;
        }
    }

    public getProjectionMatrix(): mat4 {
        this.refresh();
        return mat4.clone(this.projectionMatrix);
    }

    public getFrustum(): Frustum {
        return this.frustum;
    }

    public setFrustum(frustum: Frustum): void {
        if (!frustum || frustum.getCameraComponent()) {
            throw new Error();
        }
        if (this.frustum) {
            (this.frustum as any).setCameraComponent(null);
        }
        this.frustum = frustum;
        (this.frustum as any).setCameraComponent(this);
        this.invalidate();
    }

    public isTheMainCamera(): boolean {
        return Scene.getParameters().get(Scene.MAIN_CAMERA) == this;
    }

    protected handleAttach(attached: GameObject): void {
        attached.getTransform().getInvalidatables().addInvalidatable(this);
    }

    protected handleDetach(detached: GameObject): void {
        detached.getTransform().getInvalidatables().removeInvalidatable(this);
    }

}
