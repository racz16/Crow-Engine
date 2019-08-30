import { GameObject } from './GameObject';
import { Log } from '../utility/log/Log';

export class GameObjectContainer {

    private gameObjects = new Array<GameObject>();

    private updateComponents(): void {
        Log.startGroup('updating components');
        for (const gameObject of this.gameObjects) {
            (gameObject as any).update();
        }
        Log.endGroup();
    }

    public add(gameObject: GameObject): void {
        if (!gameObject) {
            throw new Error();
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