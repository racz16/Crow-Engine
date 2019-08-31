import { vec3, mat4, quat } from 'gl-matrix';
import { GameObject } from './GameObject';
import { Utility } from '../utility/Utility';
import { IInvalidatable } from '../utility/invalidatable/IInvalidatable';
import { InvalidatableContainer } from '../utility/invalidatable/InvalidatableContainer';

export class Transform implements IInvalidatable {

    private relativePosition = vec3.create();
    private relativeRotation = vec3.create();
    private relativeScale = vec3.fromValues(1, 1, 1);
    private absolutePosition = vec3.create();
    private absoluteRotation = vec3.create();
    private absoluteScale = vec3.fromValues(1, 1, 1);
    private modelMatrix = mat4.create();
    private inverseModelMatrix = mat4.create();
    private forward = vec3.create();
    private right = vec3.create();
    private up = vec3.create();
    private gameObject: GameObject;
    private valid: boolean;
    private readonly invalidatables = new InvalidatableContainer(this);
    private readonly parameterInvalidatables = new InvalidatableContainer(this);

    public Transform(position: vec3, rotation: vec3, scale: vec3) {
        this.setRelativePosition(position);
        this.setRelativeRotation(rotation);
        this.setRelativeScale(scale);
    }

    public getRelativePosition(): vec3 {
        return vec3.clone(this.relativePosition);
    }

    public setRelativePosition(position: vec3): void {
        this.relativePosition.set(position);
        this.invalidate();
    }

    public getAbsolutePosition(): vec3 {
        this.refresh();
        return vec3.clone(this.absolutePosition);
    }

    public setAbsolutePosition(position: vec3): void {
        if (this.haveParent()) {
            const relPos = this.computeRelativePositionFromAbsolutePosition(position);
            this.setRelativePosition(relPos);
        } else {
            this.setRelativePosition(position);
        }
    }

    private computeRelativePositionFromAbsolutePosition(absolutePosition: vec3): vec3 {
        const parentPosition = this.gameObject.getParent().getTransform().getAbsolutePosition();
        const parentRotation = this.gameObject.getParent().getTransform().getAbsoluteRotation();
        let rotation = quat.create();
        quat.rotateX(rotation, rotation, Utility.toRadians(-parentRotation[0]));
        quat.rotateY(rotation, rotation, Utility.toRadians(-parentRotation[1]));
        quat.rotateZ(rotation, rotation, Utility.toRadians(-parentRotation[2]));
        let relPos = vec3.create();
        vec3.sub(relPos, absolutePosition, parentPosition);
        return vec3.transformQuat(relPos, relPos, rotation);
    }

    public move(movement: vec3): void {
        vec3.add(this.relativePosition, this.relativePosition, movement);
        this.invalidate();
    }

    public getRelativeRotation(): vec3 {
        return vec3.clone(this.relativeRotation);
    }

    public setRelativeRotation(rotation: vec3): void {
        vec3.copy(this.relativeRotation, rotation);
        this.invalidate();
    }

    public getAbsoluteRotation(): vec3 {
        this.refresh();
        return vec3.clone(this.absoluteRotation);
    }

    public setAbsoluteRotation(rotation: vec3): void {
        if (this.haveParent()) {
            const relRot = this.computeRelativeRotationFromAbsoluteRotation(rotation);
            this.setRelativeRotation(relRot);
        } else {
            this.setRelativeRotation(rotation);
        }
    }

    private computeRelativeRotationFromAbsoluteRotation(absoluteRotation: vec3): vec3 {
        return vec3.sub(vec3.create(), absoluteRotation, this.gameObject.getParent().getTransform().getAbsoluteRotation())
    }

    public rotate(rotation: vec3): void {
        vec3.add(this.relativeRotation, this.relativeRotation, rotation);
        this.invalidate();
    }

    public getRelativeScale(): vec3 {
        return vec3.clone(this.relativeScale);
    }

    public setRelativeScale(scale: vec3): void {
        vec3.copy(this.relativeScale, scale);
        this.invalidate();
    }

    public getAbsoluteScale(): vec3 {
        this.refresh();
        return vec3.clone(this.absoluteScale);
    }

    public setAbsoluteScale(scale: vec3): void {
        if (this.haveParent()) {
            const relScale = this.computeRelativeScaleFromAbsoluteScale(scale);
            this.setRelativeScale(relScale);
        } else {
            this.setRelativeScale(scale);
        }
    }

    private computeRelativeScaleFromAbsoluteScale(absoluteScale: vec3): vec3 {
        const parentAbsoluteScale = this.gameObject.getParent().getTransform().getAbsoluteScale();
        return vec3.div(vec3.create(), absoluteScale, parentAbsoluteScale);
    }

    public getModelMatrix(): mat4 {
        this.refresh();
        return mat4.clone(this.modelMatrix);
    }

    public getInverseModelMatrix(): mat4 {
        this.refresh();
        return mat4.clone(this.inverseModelMatrix);
    }

    //
    //refreshing----------------------------------------------------------------
    //
    protected refresh(): void {
        if (!this.valid) {
            this.refreshAbsoluteTransform();
            this.refreshMatrices();
            this.refreshDirectionVectors();
            this.valid = true;
        }
    }

    private refreshMatrices(): void {
        mat4.copy(this.modelMatrix, Utility.computeModelMatrix(this.absolutePosition, this.absoluteRotation, this.absoluteScale));
        mat4.copy(this.inverseModelMatrix, Utility.computeInverseModelMatrix(this.absolutePosition, this.absoluteRotation, this.absoluteScale));
    }

    private refreshAbsoluteTransform(): void {
        if (!this.haveParent()) {
            this.refreshAbsoluteTransformWhenNoParent();
        } else {
            this.refreshAbsolutePosition();
            this.refreshAbsoluteRotation();
            this.refreshAbsoluteScale();
        }
    }

    private refreshAbsolutePosition(): void {
        const position = this.getRelativePosition();
        const parentRotation = this.gameObject.getParent().getTransform().getAbsoluteRotation();
        let rotation = quat.create();
        quat.rotateX(rotation, rotation, Utility.toRadians(parentRotation[0]));
        quat.rotateY(rotation, rotation, Utility.toRadians(parentRotation[1]));
        quat.rotateZ(rotation, rotation, Utility.toRadians(parentRotation[2]));
        vec3.copy(this.absolutePosition, vec3.transformQuat(vec3.create(), position, rotation));
        vec3.add(this.absolutePosition, this.absolutePosition, this.gameObject.getParent().getTransform().getAbsolutePosition());
    }

    private refreshAbsoluteRotation(): void {
        const parentAbsoluteRotation = this.gameObject.getParent().getTransform().getAbsoluteRotation();
        vec3.copy(this.absoluteRotation, vec3.add(vec3.create(), parentAbsoluteRotation, this.relativeRotation));
    }

    private refreshAbsoluteScale(): void {
        const parentAbsoluteScale = this.gameObject.getParent().getTransform().getAbsoluteScale();
        vec3.copy(this.absoluteScale, vec3.mul(vec3.create(), parentAbsoluteScale, this.relativeScale));
    }

    private refreshAbsoluteTransformWhenNoParent(): void {
        vec3.copy(this.absolutePosition, this.relativePosition);
        vec3.copy(this.absoluteRotation, this.relativeRotation);
        vec3.copy(this.absoluteScale, this.relativeScale);
    }

    //
    //direction vectors---------------------------------------------------------
    //
    public getForwardVector(): vec3 {
        this.refresh();
        return vec3.clone(this.forward);
    }

    public getRightVector(): vec3 {
        this.refresh();
        return vec3.clone(this.right);
    }

    public getUpVector(): vec3 {
        this.refresh();
        return vec3.clone(this.up);
    }

    private refreshDirectionVectors(): void {
        let rotation = quat.create();
        quat.rotateX(rotation, rotation, Utility.toRadians(this.absoluteRotation[0]));
        quat.rotateY(rotation, rotation, Utility.toRadians(this.absoluteRotation[1]));
        quat.rotateZ(rotation, rotation, Utility.toRadians(this.absoluteRotation[2]));
        vec3.copy(this.forward, vec3.transformQuat(vec3.create(), vec3.fromValues(0, 0, -1), rotation));
        vec3.copy(this.right, vec3.transformQuat(vec3.create(), vec3.fromValues(1, 0, 0), rotation));
        vec3.cross(this.up, this.right, this.forward);
    }

    //
    //GameObject related--------------------------------------------------------
    //
    protected update(): void {
    }

    protected attachToGameObject(gameObject: GameObject): void {
        this.gameObject = gameObject;
        this.invalidate();
    }

    public getGameObject(): GameObject {
        return this.gameObject;
    }

    private haveParent(): boolean {
        return this.gameObject && this.gameObject.getParent() != null;
    }

    public invalidate(): void {
        this.invalidatables.invalidate();
        this.parameterInvalidatables.invalidate();
        this.valid = false;
    }

    public getInvalidatables(): InvalidatableContainer {
        return this.invalidatables;
    }

    private getParameterInvalidatables(): InvalidatableContainer {
        return this.parameterInvalidatables;
    }

}
