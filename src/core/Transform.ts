import { vec3, mat4, quat } from 'gl-matrix';
import { GameObject } from './GameObject';
import { Utility } from '../utility/Utility';
import { IInvalidatable } from '../utility/invalidatable/IInvalidatable';
import { InvalidatableContainer } from '../utility/invalidatable/InvalidatableContainer';
import { Axis } from '../utility/Axis';

export class Transform implements IInvalidatable {

    private relativePosition = vec3.create();
    private relativeRotation = quat.create();
    private relativeScale = vec3.fromValues(1, 1, 1);
    private absolutePosition = vec3.create();
    private absoluteRotation = quat.create();
    private absoluteScale = vec3.fromValues(1, 1, 1);
    private modelMatrix = mat4.create();
    private inverseModelMatrix = mat4.create();
    private forward = vec3.create();
    private right = vec3.create();
    private up = vec3.create();
    private gameObject: GameObject;
    private valid = false;
    private readonly invalidatables = new InvalidatableContainer(this);
    private readonly parameterInvalidatables = new InvalidatableContainer(this);

    public getRelativePosition(): vec3 {
        return vec3.clone(this.relativePosition);
    }

    public setRelativePosition(position: vec3): void {
        vec3.copy(this.relativePosition, position);
        this.invalidate();
    }

    public getAbsolutePosition(): vec3 {
        this.refreshFromRelative();
        return vec3.clone(this.absolutePosition);
    }

    public setAbsolutePosition(position: vec3): void {
        if (this.haveParent()) {
            this.refreshFromAbsolute(position, this.getAbsoluteRotation(), this.getAbsoluteScale());
        } else {
            this.setRelativePosition(position);
        }
    }

    public move(movement: vec3): void {
        vec3.add(this.relativePosition, this.relativePosition, movement);
        this.invalidate();
    }

    public getRelativeRotation(): quat {
        return quat.clone(this.relativeRotation);
    }

    public setRelativeRotation(rotation: quat): void {
        quat.copy(this.relativeRotation, rotation);
        this.invalidate();
    }

    public getAbsoluteRotation(): quat {
        this.refreshFromRelative();
        return quat.clone(this.absoluteRotation);
    }

    public setAbsoluteRotation(rotation: quat): void {
        if (this.haveParent()) {
            this.refreshFromAbsolute(this.getAbsolutePosition(), rotation, this.getAbsoluteScale());
        } else {
            this.setRelativeRotation(rotation);
        }
    }

    public rotate(rotation: quat): void {
        quat.mul(this.relativeRotation, rotation, this.relativeRotation);
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
        this.refreshFromRelative();
        return vec3.clone(this.absoluteScale);
    }

    public setAbsoluteScale(scale: vec3): void {
        if (this.haveParent()) {
            this.refreshFromAbsolute(this.getAbsolutePosition(), this.getAbsoluteRotation(), scale);
        } else {
            this.setRelativeScale(scale);
        }
    }


    //
    //matrices------------------------------------------------------------------
    //
    public getModelMatrix(): mat4 {
        this.refreshFromRelative();
        return mat4.clone(this.modelMatrix);
    }

    public getInverseModelMatrix(): mat4 {
        this.refreshFromRelative();
        return mat4.clone(this.inverseModelMatrix);
    }

    //
    //direction vectors---------------------------------------------------------
    //
    public getForwardVector(): vec3 {
        this.refreshFromRelative();
        return vec3.clone(this.forward);
    }

    public getRightVector(): vec3 {
        this.refreshFromRelative();
        return vec3.clone(this.right);
    }

    public getUpVector(): vec3 {
        this.refreshFromRelative();
        return vec3.clone(this.up);
    }

    //
    //refreshing----------------------------------------------------------------
    //
    private refreshFromAbsolute(absolutePosition: vec3, absoluteRotation: quat, absoluteScale: vec3): void {
        this.refreshAbsoluteFromAbsolute(absolutePosition, absoluteRotation, absoluteScale);
        this.refreshMatricesFromAbsolute();
        this.refreshRelativeFromAbsolte();
        this.refreshDirectionVectors();
        this.valid = true;
    }

    private refreshAbsoluteFromAbsolute(absolutePosition: vec3, absoluteRotation: quat, absoluteScale: vec3): void {
        vec3.copy(this.absolutePosition, absolutePosition);
        quat.copy(this.absoluteRotation, absoluteRotation);
        vec3.copy(this.absoluteScale, absoluteScale);
    }

    private refreshMatricesFromAbsolute(): void {
        mat4.copy(this.modelMatrix, Utility.computeModelMatrix(this.absolutePosition, this.absoluteRotation, this.absoluteScale));
        mat4.copy(this.inverseModelMatrix, Utility.computeInverseModelMatrix(this.absolutePosition, this.absoluteRotation, this.absoluteScale));
    }

    private refreshRelativeFromAbsolte(): void {
        const inverseParentModelMatrix = this.gameObject.getParent().getTransform().getInverseModelMatrix();
        const localModelMatrix = mat4.mul(mat4.create(), this.modelMatrix, inverseParentModelMatrix);
        mat4.getTranslation(this.relativePosition, localModelMatrix);
        mat4.getRotation(this.relativeRotation, localModelMatrix);
        mat4.getScaling(this.relativeScale, localModelMatrix);
    }

    protected refreshFromRelative(): void {
        if (!this.valid) {
            this.refreshAbsoluteFromRelative();
            this.refreshDirectionVectors();
            this.valid = true;
        }
    }

    private refreshAbsoluteFromRelative(): void {
        if (!this.haveParent()) {
            this.refreshWhenAbsoluteEqualsRelative();
        } else {
            this.refreshWhenAbsoluteNotEqualsRelative();
        }
    }

    private refreshWhenAbsoluteEqualsRelative(): void {
        vec3.copy(this.absolutePosition, this.relativePosition);
        quat.copy(this.absoluteRotation, this.relativeRotation);
        vec3.copy(this.absoluteScale, this.relativeScale);
        mat4.copy(this.modelMatrix, Utility.computeModelMatrix(this.absolutePosition, this.absoluteRotation, this.absoluteScale));
        mat4.copy(this.inverseModelMatrix, Utility.computeInverseModelMatrix(this.absolutePosition, this.absoluteRotation, this.absoluteScale));
    }

    private refreshWhenAbsoluteNotEqualsRelative(): void {
        const localModelMatrix = Utility.computeModelMatrix(this.relativePosition, this.relativeRotation, this.relativeScale);
        const parentModelMatrix = this.gameObject.getParent().getTransform().getModelMatrix();
        mat4.mul(this.modelMatrix, parentModelMatrix, localModelMatrix);
        mat4.getTranslation(this.absolutePosition, this.modelMatrix);
        mat4.getRotation(this.absoluteRotation, this.modelMatrix);
        mat4.getScaling(this.absoluteScale, this.modelMatrix);
        mat4.copy(this.inverseModelMatrix, Utility.computeInverseModelMatrix(this.absolutePosition, this.absoluteRotation, this.absoluteScale));
    }

    private refreshDirectionVectors(): void {
        vec3.copy(this.forward, vec3.transformQuat(vec3.create(), Axis.Z_NEGATE, this.absoluteRotation));
        vec3.copy(this.right, vec3.transformQuat(vec3.create(), Axis.X, this.absoluteRotation));
        vec3.cross(this.up, this.right, this.forward);
    }

    //
    //GameObject related--------------------------------------------------------
    //
    public update(): void { }

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
