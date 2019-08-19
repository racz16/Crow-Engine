import { GameObject } from "./GameObject";
import { Log } from "../utility/log/Log";
import { LogLevel } from "../utility/log/LogLevel";
import { LogType } from "../utility/log/LogType";

export class GameObjectContainer {

    private gameObjects = new Array<GameObject>();

    private updateComponents(): void {
        Log.startGroup('updating components');
        for (const gameObject of this.gameObjects) {
            (gameObject as any).update();
        }
        Log.logString(LogLevel.INFO_1, LogType.ENGINE, 'updating components finished');
        Log.endGroup();
    }

    private addGameObject(gameObject: GameObject): void {
        if (!gameObject) {
            throw new Error();
        }
        if (!this.gameObjects.includes(gameObject)) {
            this.gameObjects.push(gameObject);
        }
    }

    public getGameObjectsIterator(): IterableIterator<GameObject> {
        return this.gameObjects.values();
    }

    public getGameObject(index: number): GameObject {
        return this.gameObjects[index];
    }

    public getGameObjectCount(): number {
        return this.gameObjects.length;
    }

}