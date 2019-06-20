import { IInvalidatable } from "../utility/invalidatable/IInvalidatable";
import { GameObject } from "../core/GameObject";

export interface IComponent extends IInvalidatable {

    addInvalidatable(invalidatable: IInvalidatable): void;

    getInvalidatable(index: number): IInvalidatable;

    containsInvalidatable(invalidatable: IInvalidatable): boolean;

    removeInvalidatable(invalidatable: IInvalidatable): void;

    getInvalidatableCount(): number;

    getInvalidatablesIterator(): IterableIterator<IInvalidatable>;

    isActive(): boolean;

    setActive(active: boolean): void;

    getGameObject(): GameObject;

    setGameObject(object: GameObject): void;

}
