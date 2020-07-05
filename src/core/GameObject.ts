import { ComponentContainer } from './ComponentContainer';
import { ChildContainer } from './ChildContainer';
import { Transform } from './Transform';
import { Engine } from './Engine';

export class GameObject {

    private components: ComponentContainer;
    private children: ChildContainer;
    private parent: GameObject;
    private root: GameObject;
    private transform: Transform;
    private destroyed = false;

    public constructor(transform = new Transform()) {
        this.setTransform(transform);
        this.root = this;
        this.components = new ComponentContainer(this);
        this.children = new ChildContainer(this);
        Engine.getGameObjectContainer().add(this);
    }

    public update(): void {
        if (!this.destroyed) {
            this.transform.update();
            this.components.update();
        }
    }

    public getRoot(): GameObject {
        return this.root;
    }

    private setRoot(root: GameObject): void {
        this.root = root;
        for (const child of this.children.getIterator()) {
            child.setRoot(root);
        }
    }

    public getParent(): GameObject {
        return this.parent;
    }

    public setParent(parent: GameObject): void {
        if (parent == this || this.children.containsDeep(parent) || this.destroyed || parent?.isDestroyed()) {
            throw new Error();
        }
        if (parent != this.getParent()) {
            this.removeParent();
            this.addParent(parent);
        }
    }

    private removeParent(): void {
        if (this.parent) {
            this.parent.getChildren()._removeChild(this);
            this.parent.getTransform().getInvalidatables().remove(this.transform);
            parent = null;
            this.setRoot(this);
        }
    }

    private addParent(parent: GameObject): void {
        this.parent = parent;
        if (parent) {
            this.setRoot(parent.getRoot());
            parent.getChildren()._addChild(this);
            parent.getTransform().getInvalidatables().add(this.getTransform());
        }
    }

    public getTransform(): Transform {
        return this.transform;
    }

    private setTransform(transform: Transform): void {
        if (transform.getGameObject()) {
            throw new Error();
        }
        this.transform = transform;
        transform._attachToGameObject(this);
    }

    public getComponents(): ComponentContainer {
        return this.components;
    }

    public getChildren(): ChildContainer {
        return this.children;
    }

    public destroy(): void {
        for (const child of this.children.getIterator()) {
            child.destroy();
        }
        this.setParent(null);
        this.components.clear();
        this.destroyed = true;
        Engine.getGameObjectContainer().remove(this);
    }

    public isDestroyed(): boolean {
        return this.destroyed;
    }

}
