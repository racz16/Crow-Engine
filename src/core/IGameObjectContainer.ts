import { GameObject } from "./GameObject";

export interface IGameObjectContainer {

    update(): void;

    add(gameObject: GameObject): void;

    getIterator(): IterableIterator<GameObject>;

    getCount(): number;

}