import { ComponentContainer } from './ComponentContainer';
import { ChildContainer } from './ChildContainer';
import { vec3 } from 'gl-matrix';
import { Transform } from './Transform';
import { Engine } from './Engine';
export class GameObject {

    private components: ComponentContainer;
    private children: ChildContainer;
    private parent: GameObject;
    private root: GameObject;
    private transform: Transform;

    public constructor(transform = new Transform()) {
        this.setTransform(transform);
        this.root = this;
        this.components = new ComponentContainer(this);
        this.children = new ChildContainer(this);
        Engine.getGameObjectContainer().add(this);
    }

    protected update(): void {
        (this.transform as any).update();
        (this.components as any).update();
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
        if (parent == this || this.children.containsDeep(parent)) {
            throw new Error();
        }
        if (parent != this.getParent()) {
            this.setParentUnsafe(parent);
        }
    }

    private setParentUnsafe(parent: GameObject): void {
        const transformData = this.getTransformData();
        this.removeParent();
        this.addParent(parent);
        this.setTransformData(transformData);
    }

    private getTransformData(): [vec3, vec3, vec3] {
        return [
            this.transform.getAbsolutePosition(),
            this.transform.getAbsoluteRotation(),
            this.transform.getAbsoluteScale()
        ];
    }

    private setTransformData([position, rotation, scale]: [vec3, vec3, vec3]): void {
        this.transform.setAbsolutePosition(position);
        this.transform.setAbsoluteRotation(rotation);
        this.transform.setAbsoluteScale(scale);
    }

    private removeParent(): void {
        if (this.parent) {
            (this.parent.getChildren() as any).removeChild(this);
            this.parent.getTransform().getInvalidatables().removeInvalidatable(this.transform);
            parent = null;
            this.setRoot(this);
        }
    }

    private addParent(parent: GameObject): void {
        this.parent = parent;
        if (parent) {
            this.setRoot(parent.getRoot());
            (parent.getChildren() as any).addChild(this);
            parent.getTransform().getInvalidatables().addInvalidatable(this.getTransform());
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
        (transform as any).attachToGameObject(this);
    }

    public getComponents(): ComponentContainer {
        return this.components;
    }

    public getChildren(): ChildContainer {
        return this.children;
    }
}