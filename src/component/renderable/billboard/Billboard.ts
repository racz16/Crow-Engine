import { mat4, vec3, quat, ReadonlyMat4, ReadonlyVec3, ReadonlyQuat } from 'gl-matrix';
import { IRenderableComponent } from '../IRenderableComponent';
import { IRenderable } from '../../../resource/IRenderable';
import { Utility } from '../../../utility/Utility';
import { IInvalidatable } from '../../../utility/invalidatable/IInvalidatable';
import { Transform } from '../../../core/Transform';
import { LogLevel } from '../../../utility/log/LogLevel';
import { Engine } from '../../../core/Engine';
import { Axis } from '../../../utility/Axis';
import { RotationBuilder } from '../../../utility/RotationBuilder';

export abstract class Billboard implements IInvalidatable {

    protected renderableComponent: IRenderableComponent<IRenderable>;
    protected modelMatrix: mat4;
    protected inverseModelMatrix: mat4;
    protected readonly forward = vec3.create();
    protected readonly right = vec3.create();
    protected readonly up = vec3.create();
    protected relativeRotation: quat;
    protected absoluteRotation: quat;
    private valid = false;

    protected setRenderableComponent(renderableComponent: IRenderableComponent<IRenderable>): void {
        if (this.renderableComponent) {
            this.renderableComponent.getInvalidatables().remove(this);
            Engine.getParameters().removeInvalidatable(Engine.MAIN_CAMERA, this);
        }
        this.renderableComponent = renderableComponent;
        if (this.renderableComponent) {
            this.renderableComponent.getInvalidatables().add(this);
            Engine.getParameters().addInvalidatable(Engine.MAIN_CAMERA, this);
        }
        this.invalidate();
    }

    public getRenderableComponent(): IRenderableComponent<IRenderable> {
        return this.renderableComponent;
    }

    protected isValid(): boolean {
        return this.valid;
    }

    protected setValid(valid: boolean): void {
        this.valid = valid;
    }

    protected setMatricesToDefault(): void {
        this.modelMatrix = Utility.computeModelMatrix(
            this.renderableComponent.getGameObject().getTransform().getAbsolutePosition(),
            RotationBuilder.createRotation(Axis.Z, 90).getQuaternion(),
            this.renderableComponent.getGameObject().getTransform().getAbsoluteScale()
        )
        this.inverseModelMatrix = mat4.create();
        mat4.invert(this.inverseModelMatrix, this.modelMatrix);
    }

    public invalidate(sender?: any): void {
        this.valid = false;
    }

    private refresh(): void {
        if (!this.valid) {
            this.refreshUnsafe();
            this.valid = true;
            Engine.getLog().logString(LogLevel.INFO_3, 'Billboard matrices refreshed');
        }
    }

    protected abstract refreshUnsafe(): void;

    protected isUsable(): boolean {
        const camera = Engine.getMainCamera();
        return this.renderableComponent && this.renderableComponent.getGameObject() && camera && camera.getGameObject() != null;
    }

    public getModelMatrix(): ReadonlyMat4 {
        if (this.isUsable()) {
            this.refresh();
            return this.modelMatrix;
        } else {
            return null;
        }
    }

    public getInverseModelMatrix(): ReadonlyMat4 {
        if (this.isUsable()) {
            this.refresh();
            return this.inverseModelMatrix;
        } else {
            return null;
        }
    }

    public getForwardVector(): ReadonlyVec3 {
        if (this.isUsable()) {
            this.refresh();
            return this.forward;
        } else {
            return null;
        }
    }

    public getRightVector(): ReadonlyVec3 {
        if (this.isUsable()) {
            this.refresh();
            return this.right;
        } else {
            return null;
        }
    }

    public getUpVector(): ReadonlyVec3 {
        if (this.isUsable()) {
            this.refresh();
            return this.up;
        } else {
            return null;
        }
    }

    public getRelativeRotation(): ReadonlyQuat {
        if (this.isUsable()) {
            this.refresh();
            return this.relativeRotation;
        } else {
            return null;
        }
    }

    public getAbsoluteRotation(): ReadonlyQuat {
        if (this.isUsable()) {
            this.refresh();
            return this.absoluteRotation;
        } else {
            return null;
        }
    }

    protected refreshDataFromDirections(forward: ReadonlyVec3, up: ReadonlyVec3, right: ReadonlyVec3): void {
        this.refreshDirectionVectors(forward, up, right);
        this.refreshMatrices();
        this.refreshRotation();
    }

    private refreshDirectionVectors(forward: ReadonlyVec3, up: ReadonlyVec3, right: ReadonlyVec3): void {
        vec3.copy(this.forward, forward);
        vec3.copy(this.up, up);
        vec3.copy(this.right, right);
    }

    private refreshMatrices(): void {
        const transform = this.getRenderableComponent().getGameObject().getTransform();
        const position = transform.getAbsolutePosition();
        const scale = transform.getAbsoluteScale();
        this.modelMatrix = Utility.computeModelMatrixFromDirections(this.forward, this.up, this.right, position, scale);
        this.inverseModelMatrix = Utility.computeInverseModelMatrixFromDirections(this.forward, this.up, this.right, position, scale);
    }

    private refreshRotation(): void {
        this.absoluteRotation = mat4.getRotation(quat.create(), this.modelMatrix);
        const parentRotation = this.renderableComponent.getGameObject().getTransform().getAbsoluteRotation();
        const parentInverseRotation = quat.invert(quat.create(), parentRotation);
        this.relativeRotation = quat.mul(quat.create(), parentInverseRotation, this.absoluteRotation);
    }

    protected getMainCameraTransform(): Transform {
        return Engine.getMainCamera().getGameObject().getTransform();
    }
}