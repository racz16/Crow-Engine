import { Transform } from "./Transform";
import { ComponentContainer } from "./ComponentContainer";
import { ChildContainer } from "./ChildContainer";
import { vec3 } from "gl-matrix";
import { Scene } from "./Scene";

export class GameObject {

    private components: ComponentContainer;
    private children: ChildContainer;
    private parent: GameObject = null;
    private root: GameObject;
    private transform: Transform;

    public constructor() {
        this.transform = new Transform();
        this.transform.private_attachToGameObject(this);
        this.root = this;
        this.components = new ComponentContainer(this);
        this.children = new ChildContainer(this);
        Scene.getGameObjects().private_addGameObject(this);
    }

    public private_update(): void {
        this.transform.private_update();
        this.components.private_update();
    }

    //
    //children------------------------------------------------------------------
    //
    public getParent(): GameObject {
        return this.parent;
    }

    public setParent(parent: GameObject): void {
        if (parent == this.getParent()) {
            return;
        }
        if (parent == this || this.children.containsDeep(parent)) {
            throw new Error();
        }
        this.setParentUnsafe(parent);
    }

    public getRoot(): GameObject {
        return this.root;
    }

    private setRoot(root: GameObject): void {
        this.root = root;
        for (const child of this.children.getChildrenIterator()) {
            child.setRoot(root);
        }
    }

    private setParentUnsafe(parent: GameObject): void {
        const holder = this.getCurrentTransformData();
        this.removeParent();
        this.addParent(parent);
        this.setTransformHolder(holder);
    }

    private getCurrentTransformData(): TransformHolder {
        return new TransformHolder(this.transform.getAbsolutePosition(),
            this.transform.getAbsoluteRotation(),
            this.transform.getAbsoluteScale());
    }

    private setTransformHolder(holder: TransformHolder): void {
        this.transform.setAbsolutePosition(holder.getPosition());
        this.transform.setAbsoluteRotation(holder.getRotation());
        this.transform.setAbsoluteScale(holder.getScale());
    }

    private removeParent(): void {
        if (this.parent) {
            this.parent.getChildren().private_removeChild(this);
            this.parent.getTransform().getInvalidatables().removeInvalidatable(this.transform);
            parent = null;
            this.setRoot(this);
        }
    }

    private addParent(parent: GameObject): void {
        this.parent = parent;
        if (parent) {
            this.setRoot(parent.getRoot());
            parent.getChildren().private_addChild(this);
            parent.getTransform().getInvalidatables().addInvalidatable(this.getTransform());
        }
    }

    //
    //transform-------------------------------------------
    //

    public getTransform(): Transform {
        return this.transform;
    }

    public setTransform(transform: Transform): void {
        //TODO: ne lehessen változtatni, max a konstruktorban
        if (transform.getGameObject()) {
            throw new Error();
        }
        this.transform.private_detachFromGameObject();
        transform.private_attachToGameObject(this);
        this.transform = transform;
    }

    public getComponents(): ComponentContainer {
        return this.components;
    }

    public getChildren(): ChildContainer {
        return this.children;
    }
}

class TransformHolder {

    public constructor(private position: vec3, private rotation: vec3, private scale: vec3) { }

    public getPosition(): vec3 {
        return this.position;
    }

    public getRotation(): vec3 {
        return this.rotation;
    }
    public getScale(): vec3 {
        return this.scale;
    }

}