import { GameObject } from "./GameObject";

export interface IGameObjectContainer {

    update(): void;

    add(gameObject: GameObject): void;

    remove(gameObject: GameObject): void;

    destroyAll(): void;

    get(index: number): GameObject;

    getIterator(): IterableIterator<GameObject>;

    getCount(): number;

}