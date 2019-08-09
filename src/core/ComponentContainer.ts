import { GameObject } from "./GameObject";
import { Component } from "../component/Component";
import { Utility } from "../utility/Utility";
import { IComponent } from "../component/IComponent";

export class ComponentContainer {

    private components = new Array<Component>();
    private gameObject: GameObject;

    public constructor(gameObject: GameObject) {
        if (gameObject.getComponents()) {
            throw new Error();
        }
        this.gameObject = gameObject;
    }

    public private_update(): void {
        for (const component of this.components) {
            if (component.isActive()) {
                component.private_update();
            }
        }
    }

    public add(component: Component): void {
        if (this.contains(component)) {
            return;
        }
        if (component.getGameObject()) {
            throw new Error();
        }
        this.addUnsafe(component);
    }

    private addUnsafe(component: Component): void {
        component.private_attachToGameObject(this.gameObject);
        this.components.push(component);
    }

    public contains(component: Component): boolean {
        return component && component.getGameObject() === this.gameObject;
    }

    public remove(component: Component): void {
        const index = this.components.indexOf(component);
        if (index >= 0) {
            this.components[index].private_detachFromGameObject();
            Utility.removeElement(this.components, index);
        }
    }

    public removeAll<T extends Component>(type: new (..._) => T): void {
        for (let i = this.components.length - 1; i >= 0; i--) {
            const component = this.components[i];
            if (component instanceof type) {
                component.private_detachFromGameObject();
                Utility.removeElement(this.components, i);
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

    public getFirst<T extends IComponent>(type: new (..._) => T): T {
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

    public getComponentCount(): number {
        return this.components.length;
    }

    public getComponentIterator(): IterableIterator<Component> {
        return this.components.values();
    }

}