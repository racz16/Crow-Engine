import { GameObject } from './GameObject';
import { IGameObjectContainer } from './IGameObjectContainer';
import { Engine } from './Engine';

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
        if (!gameObject) {
            throw new Error('Can\'t add null to the Game Object Container');
        }
        if (!this.gameObjects.includes(gameObject)) {
            this.gameObjects.push(gameObject);
        }
    }

    public getIterator(): IterableIterator<GameObject> {
        return this.gameObjects.values();
    }

    public getCount(): number {
        return this.gameObjects.length;
    }

}