import { GameObject } from './GameObject';
import { IGameObjectContainer } from './IGameObjectContainer';
import { Engine } from './Engine';
import { Utility } from '../utility/Utility';

export class GameObjectContainer implements IGameObjectContainer {

    private gameObjects = new Array<GameObject>();

    public update(): void {
        Engine.getLog().startGroup('updating components');
        for (const go of this.gameObjects) {
            go.update();
        }
        Engine.getLog().endGroup();
    }

    public add(gameObject: GameObject): void {
        if (!gameObject || gameObject.isDestroyed()) {
            throw new Error();
        }
        if (!this.gameObjects.includes(gameObject)) {
            this.gameObjects.push(gameObject);
        }
    }

    public remove(gameObject: GameObject): void {
        if (!gameObject || !gameObject.isDestroyed()) {
            throw new Error();
        }
        const index = this.gameObjects.indexOf(gameObject);
        if (index !== -1) {
            Utility.removeElement(this.gameObjects, index);
        }
    }

    public destroyAll(): void {
        for (const gameObject of this.gameObjects) {
            gameObject.destroy();
        }
    }

    public get(index: number): GameObject {
        return this.gameObjects[index];
    }

    public getIterator(): IterableIterator<GameObject> {
        return this.gameObjects.values();
    }

    public getCount(): number {
        return this.gameObjects.length;
    }

}