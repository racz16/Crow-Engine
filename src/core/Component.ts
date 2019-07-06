import { GameObject } from "./GameObject";
import { InvalidatableContainer } from "../utility/invalidatable/InvalidatableContainer";
import { IComponent } from "../component/IComponent";

export class Component implements IComponent {

    private readonly invalidatables = new InvalidatableContainer(this);
    private gameObject: GameObject;
    private active = true;
    private valid = false;

    public getInvalidatables(): InvalidatableContainer {
        return this.invalidatables;
    }

    public invalidate(sender?: any): void {
        this.valid = false;
        this.invalidatables.invalidate();
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

    public private_attachToGameObject(gameObject: GameObject): void {
        this.gameObject = gameObject;
        this.invalidate();
    }

    public private_detachFromGameObject(): void {
        this.gameObject = null;
        this.invalidate();
    }

    public private_update(): void { }

}