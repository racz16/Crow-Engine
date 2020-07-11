import { GameObject } from './GameObject';
import { Component } from '../component/Component';
import { Utility } from '../utility/Utility';

export class ComponentContainer {

    private components = new Array<Component>();
    private gameObject: GameObject;

    public constructor(gameObject: GameObject) {
        if (gameObject.getComponents()) {
            throw new Error();
        }
        this.gameObject = gameObject;
    }

    public update(): void {
        if (!this.gameObject.isDestroyed()) {
            for (const component of this.components) {
                if (component.isActive()) {
                    component.updateComponent();
                }
            }
        }
    }

    public add(component: Component): void {
        if (component.getGameObject() || this.gameObject.isDestroyed()) {
            throw new Error();
        }
        if (!this.contains(component)) {
            component._attachToGameObject(this.gameObject);
            this.components.push(component);
        }
    }

    public contains(component: Component): boolean {
        return component && component.getGameObject() == this.gameObject;
    }

    public remove(component: Component): void {
        const index = this.components.indexOf(component);
        if (index !== -1) {
            this.components[index]._detachFromGameObject();
            Utility.removeElementByIndex(this.components, index);
        }
    }

    public removeAll<T extends Component>(type: new (..._) => T): void {
        for (let i = this.components.length - 1; i >= 0; i--) {
            const component = this.components[i];
            if (component instanceof type) {
                component._detachFromGameObject();
                Utility.removeElementByIndex(this.components, i);
            }
        }
    }

    public clear(): void {
        this.removeAll(Component);
    }

    public getAll<T>(type: new (..._) => T): IterableIterator<T> {
        const ret = new Array<T>();
        for (const component of this.components) {
            if (component instanceof type) {
                ret.push(component);
            }
        }
        return ret.values();
    }

    public getFirst<T extends Component>(type: new (..._) => T): T {
        for (const component of this.components) {
            if (component instanceof type) {
                return component;
            }
        }
        return null;
    }

    public get(index: number): Component {
        return this.components[index];
    }

    public getCount(): number {
        return this.components.length;
    }

    public getIterator(): IterableIterator<Component> {
        return this.components.values();
    }

}