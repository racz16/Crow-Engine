import { GameObject } from "../core/GameObject";
import { InvalidatableContainer } from "../utility/invalidatable/InvalidatableContainer";
import { IComponent } from "./IComponent";

export class Component implements IComponent {

    private readonly invalidatables = new InvalidatableContainer(this);
    private readonly parameterInvalidatables = new InvalidatableContainer(this);
    private gameObject: GameObject;
    private active = true;
    private valid = false;

    public getInvalidatables(): InvalidatableContainer {
        return this.invalidatables;
    }

    private getParameterInvalidatables(): InvalidatableContainer {
        return this.parameterInvalidatables;
    }

    public invalidate(sender?: any): void {
        this.valid = false;
        this.invalidatables.invalidate();
        this.parameterInvalidatables.invalidate();
    }

    protected isValid(): boolean {
        return this.valid;
    }

    protected setValid(valid: boolean): void {
        this.valid = valid;
    }

    public isActive(): boolean {
        return this.active;
    }

    public setActive(active: boolean): void {
        this.active = active;
        this.invalidate();
    }

    public getGameObject(): GameObject {
        return this.gameObject;
    }

    protected attachToGameObject(gameObject: GameObject): void {
        this.gameObject = gameObject;
        this.invalidate();
    }

    protected detachFromGameObject(): void {
        this.gameObject = null;
        this.invalidate();
    }

    protected updateComponent(): void { }

}