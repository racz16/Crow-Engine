import { GameObject } from "./GameObject";
import { InvalidatableContainer } from "../utility/invalidatable/InvalidatableContainer";
import { IInvalidatable } from "../utility/invalidatable/IInvalidatable";
import { IComponent } from "../component/IComponent";

export class Component implements IComponent {

    private readonly invalidatables = new InvalidatableContainer(this);
    private gameObject: GameObject;
    private active = true;

    public addInvalidatable(invalidatable: IInvalidatable): void {
        this.invalidatables.addInvalidatable(invalidatable);
    }

    public getInvalidatable(index: number): IInvalidatable {
        return this.invalidatables.getInvalidatable(index);
    }

    public containsInvalidatable(invalidatable: IInvalidatable): boolean {
        return this.invalidatables.containsInvalidatable(invalidatable);
    }

    public removeInvalidatable(invalidatable: IInvalidatable): void {
        this.invalidatables.removeInvalidatable(invalidatable);
    }

    public getInvalidatableCount(): number {
        return this.invalidatables.getInvalidatableCount();
    }

    public getInvalidatablesIterator(): IterableIterator<IInvalidatable> {
        return this.invalidatables.getIterator();
    }

    public invalidate(): void {
        this.invalidatables.invalidate();
    }

    public isActive(): boolean {
        return this.active;
    }

    public setActive(active: boolean): void {
        this.active = active;
    }

    public getGameObject(): GameObject {
        return this.gameObject;
    }

    public setGameObject(object: GameObject): void {
        if (object == null) {
            if (this.gameObject != null) {
                this.gameObject.getComponents().remove(this);
            }
        } else {
            object.getComponents().add(this);
        }
    }

    public private_attachToGameObject(object: GameObject): void {
        this.gameObject = object;
    }

    public private_detachFromGameObject(): void {
        this.gameObject = null;
    }

    public private_update(): void {
    }

}