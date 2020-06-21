import { vec3, mat4, quat, ReadonlyMat4, ReadonlyQuat, ReadonlyVec3 } from 'gl-matrix';
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

    public getRelativePosition(): ReadonlyVec3 {
        return this.relativePosition;
    }

    public setRelativePosition(position: ReadonlyVec3): void {
        vec3.copy(this.relativePosition, position);
        this.invalidate();
    }

    public getAbsolutePosition(): ReadonlyVec3 {
        this.refreshFromRelative();
        return this.absolutePosition;
    }

    public setAbsolutePosition(position: ReadonlyVec3): void {
        if (this.haveParent()) {
            this.refreshFromAbsolute(position, this.getAbsoluteRotation(), this.getAbsoluteScale());
        } else {
            this.setRelativePosition(position);
        }
    }

    public move(movement: ReadonlyVec3): void {
        vec3.add(this.relativePosition, this.relativePosition, movement);
        this.invalidate();
    }

    public getRelativeRotation(): ReadonlyQuat {
        return this.relativeRotation;
    }

    public setRelativeRotation(rotation: ReadonlyQuat): void {
        quat.copy(this.relativeRotation, rotation);
        this.invalidate();
    }

    public getAbsoluteRotation(): ReadonlyQuat {
        this.refreshFromRelative();
        return this.absoluteRotation;
    }

    public setAbsoluteRotation(rotation: ReadonlyQuat): void {
        if (this.haveParent()) {
            this.refreshFromAbsolute(this.getAbsolutePosition(), rotation, this.getAbsoluteScale());
        } else {
            this.setRelativeRotation(rotation);
        }
    }

    public rotate(rotation: ReadonlyQuat): void {
        quat.mul(this.relativeRotation, rotation, this.relativeRotation);
        this.invalidate();
    }

    public getRelativeScale(): ReadonlyVec3 {
        return this.relativeScale;
    }

    public setRelativeScale(scale: ReadonlyVec3): void {
        vec3.copy(this.relativeScale, scale);
        this.invalidate();
    }

    public getAbsoluteScale(): ReadonlyVec3 {
        this.refreshFromRelative();
        return this.absoluteScale;
    }

    public setAbsoluteScale(scale: ReadonlyVec3): void {
        if (this.haveParent()) {
            this.refreshFromAbsolute(this.getAbsolutePosition(), this.getAbsoluteRotation(), scale);
        } else {
            this.setRelativeScale(scale);
        }
    }

    //matrices
    public getModelMatrix(): ReadonlyMat4 {
        this.refreshFromRelative();
        return this.modelMatrix;
    }

    public getInverseModelMatrix(): ReadonlyMat4 {
        this.refreshFromRelative();
        return this.inverseModelMatrix;
    }

    //direction vectors
    public getForwardVector(): ReadonlyVec3 {
        this.refreshFromRelative();
        return this.forward;
    }

    public getRightVector(): ReadonlyVec3 {
        this.refreshFromRelative();
        return this.right;
    }

    public getUpVector(): ReadonlyVec3 {
        this.refreshFromRelative();
        return this.up;
    }

    //refreshing
    private refreshFromAbsolute(absolutePosition: ReadonlyVec3, absoluteRotation: ReadonlyQuat, absoluteScale: ReadonlyVec3): void {
        this.refreshAbsoluteFromAbsolute(absolutePosition, absoluteRotation, absoluteScale);
        this.refreshMatricesFromAbsolute();
        this.refreshRelativeFromAbsolte();
        this.refreshDirectionVectors();
        this.valid = true;
    }

    private refreshAbsoluteFromAbsolute(absolutePosition: ReadonlyVec3, absoluteRotation: ReadonlyQuat, absoluteScale: ReadonlyVec3): void {
        vec3.copy(this.absolutePosition, absolutePosition);
        quat.copy(this.absoluteRotation, absoluteRotation);
        vec3.copy(this.absoluteScale, absoluteScale);
    }

    private refreshMatricesFromAbsolute(): void {
        this.modelMatrix = Utility.computeModelMatrix(this.absolutePosition, this.absoluteRotation, this.absoluteScale);
        this.inverseModelMatrix = Utility.computeInverseModelMatrix(this.absolutePosition, this.absoluteRotation, this.absoluteScale);
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
        this.modelMatrix = Utility.computeModelMatrix(this.absolutePosition, this.absoluteRotation, this.absoluteScale);
        this.inverseModelMatrix = Utility.computeInverseModelMatrix(this.absolutePosition, this.absoluteRotation, this.absoluteScale);
    }

    private refreshWhenAbsoluteNotEqualsRelative(): void {
        const localModelMatrix = Utility.computeModelMatrix(this.relativePosition, this.relativeRotation, this.relativeScale);
        const parentModelMatrix = this.gameObject.getParent().getTransform().getModelMatrix();
        mat4.mul(this.modelMatrix, parentModelMatrix, localModelMatrix);
        mat4.getTranslation(this.absolutePosition, this.modelMatrix);
        mat4.getRotation(this.absoluteRotation, this.modelMatrix);
        mat4.getScaling(this.absoluteScale, this.modelMatrix);
        this.inverseModelMatrix = Utility.computeInverseModelMatrix(this.absolutePosition, this.absoluteRotation, this.absoluteScale);
    }

    private refreshDirectionVectors(): void {
        vec3.copy(this.forward, vec3.transformQuat(vec3.create(), Axis.Z_NEGATE, this.absoluteRotation));
        vec3.copy(this.right, vec3.transformQuat(vec3.create(), Axis.X, this.absoluteRotation));
        vec3.cross(this.up, this.right, this.forward);
    }

    //GameObject related
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
        this.valid = false;
    }

    public getInvalidatables(): InvalidatableContainer {
        return this.invalidatables;
    }

}
