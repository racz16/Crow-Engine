import { IRenderable } from "../../resource/IRenderable";
import { Component } from "../../core/Component";
import { GameObject } from "../../core/GameObject";
import { RenderingPipeline } from "../../rendering/RenderingPipeline";
import { Material } from "../../material/Material";
import { IBoundingShape } from "./boundingshape/IBoundingShape";
import { SphereBoundingShape } from "./boundingshape/SphereBoundingShape";

export abstract class RenderableComponent<T extends IRenderable> extends Component {

    private boundingShape: IBoundingShape;
    private renderable: T;
    private material: Material;
    private renderableActive = true;
    private materialActive = true;
    private castShadow = true;
    private receiveShadow = true;
    private reflectable = false;

    public constructor(renderable: T, material: Material) {
        super();
        this.setRenderable(renderable);
        this.setMaterial(material);
        this.setBoundingShape(new SphereBoundingShape());
    }

    public getRenderable(): T {
        return this.renderable;
    }

    public setRenderable(renderable: T): void {
        if (renderable == null) {
            throw new Error();
        }
        this.renderable = renderable;
        this.invalidate();
    }

    public getMaterial(): Material {
        return this.material;
    }

    public setMaterial(material: Material): void {
        if (material == null) {
            throw new Error();
        }
        this.material = material;
    }

    public setBoundingShape(boundingShape: IBoundingShape): void {
        if (!boundingShape) {
            throw new Error();
        }
        if (this.boundingShape) {
            this.boundingShape.private_setRenderableComponent(null);
        }
        this.boundingShape = boundingShape;
        this.boundingShape.private_setRenderableComponent(this);
    }

    public getBoundingShape(): IBoundingShape {
        return this.boundingShape;
    }

    public isReflectable(): boolean {
        return this.reflectable;
    }

    public setReflectable(reflectable: boolean): void {
        this.reflectable = reflectable;
    }

    public isCastShadow(): boolean {
        return this.castShadow;
    }

    public setCastShadow(castShadow: boolean): void {
        this.castShadow = castShadow;
    }

    public isReceiveShadows(): boolean {
        return this.receiveShadow;
    }

    public setReceiveShadows(receiveShadows: boolean): void {
        this.receiveShadow = receiveShadows;
    }

    public isRenderableActive(): boolean {
        return this.renderableActive;
    }

    public setRenderableActive(renderableActive: boolean): void {
        this.renderableActive = renderableActive;
    }

    public isMaterialActive(): boolean {
        return this.materialActive;
    }

    public setMaterialActive(materialActive: boolean): void {
        this.materialActive = materialActive;
    }

    public abstract getFaceCount(): number;

    public draw(): void {
        this.renderable.draw();
    }

    public private_detachFromGameObject(): void {
        this.getGameObject().getTransform().removeInvalidatable(this);
        super.private_detachFromGameObject();
        RenderingPipeline.getRenderableContainer().private_remove(this);
        this.invalidate();
    }

    public private_attachToGameObject(object: GameObject): void {
        super.private_attachToGameObject(object);
        this.getGameObject().getTransform().addInvalidatable(this);
        RenderingPipeline.getRenderableContainer().private_add(this);
        this.invalidate();
    }

}
