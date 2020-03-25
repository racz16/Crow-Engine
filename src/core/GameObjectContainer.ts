import { GameObject } from './GameObject';
import { Log } from '../utility/log/Log';
import { IGameObjectContainer } from './IGameObjectContainer';

export class GameObjectContainer implements IGameObjectContainer {

    private gameObjects = new Array<GameObject>();

    public update(): void {
        Log.startGroup('updating components');
        for (const go of this.gameObjects) {
            go.update();
        }
        Log.endGroup();
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