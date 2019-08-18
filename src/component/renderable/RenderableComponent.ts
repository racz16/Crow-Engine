import { IRenderable } from "../../resource/IRenderable";
import { Component } from "../Component";
import { GameObject } from "../../core/GameObject";
import { RenderingPipeline } from "../../rendering/RenderingPipeline";
import { Material } from "../../material/Material";
import { IBoundingShape } from "./boundingshape/IBoundingShape";
import { SphereBoundingShape } from "./boundingshape/SphereBoundingShape";
import { IRenderableComponent } from "./IRenderableComponent";
import { vec2, mat4 } from "gl-matrix";
import { IBillboard } from "./billboard/IBillboard";

export abstract class RenderableComponent<T extends IRenderable> extends Component implements IRenderableComponent<T>{

    private renderable: T;
    private boundingShape: IBoundingShape;
    private material: Material;
    private readonly visibilityInterval = vec2.fromValues(Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY);
    private materialActive = true;
    private castShadow = true;
    private receiveShadow = true;
    private reflectable = false;
    private billboard: IBillboard;

    public constructor(renderable: T, material = new Material(), boundingShape: IBoundingShape = new SphereBoundingShape()) {
        super();
        this.setRenderable(renderable);
        this.setMaterial(material);
        this.setBoundingShape(boundingShape);
    }

    public getRenderable(): T {
        return this.renderable;
    }

    public setRenderable(renderable: T): void {
        if (!renderable) {
            throw new Error();
        }
        this.renderable = renderable;
        this.invalidate();
    }

    public getMaterial(): Material {
        return this.material;
    }

    public setMaterial(material: Material): void {
        if (!material) {
            throw new Error();
        }
        this.material = material;
        this.invalidate();
    }

    public getBoundingShape(): IBoundingShape {
        return this.boundingShape;
    }

    public setBoundingShape(boundingShape: IBoundingShape): void {
        if (!boundingShape || boundingShape.getRenderableComponent()) {
            throw new Error();
        }
        if (this.boundingShape) {
            this.boundingShape.private_setRenderableComponent(null);
        }
        this.boundingShape = boundingShape;
        this.boundingShape.private_setRenderableComponent(this);
        this.invalidate();
    }

    public getBillboard(): IBillboard {
        return this.billboard;
    }

    public setBillboard(billboard: IBillboard): void {
        if (billboard && billboard.getRenderableComponent()) {
            throw new Error();
        }
        if (this.billboard) {
            this.billboard.private_setRenderableComponent(null);
        }
        this.billboard = billboard;
        this.billboard.private_setRenderableComponent(this);
        this.invalidate();
    }

    public isReflectable(): boolean {
        return this.reflectable;
    }

    public setReflectable(reflectable: boolean): void {
        this.reflectable = reflectable;
        this.invalidate();
    }

    public isCastShadow(): boolean {
        return this.castShadow;
    }

    public setCastShadow(castShadow: boolean): void {
        this.castShadow = castShadow;
        this.invalidate();
    }

    public isReceiveShadows(): boolean {
        return this.receiveShadow;
    }

    public setReceiveShadows(receiveShadows: boolean): void {
        this.receiveShadow = receiveShadows;
        this.invalidate();
    }

    public isMaterialActive(): boolean {
        return this.materialActive;
    }

    public setMaterialActive(materialActive: boolean): void {
        this.materialActive = materialActive;
        this.invalidate();
    }

    public getVisibilityInterval(): vec2 {
        return vec2.clone(this.visibilityInterval);
    }

    public setVisibilityInterval(interval: vec2): void {
        if (!interval) {
            throw new Error();
        }
        this.visibilityInterval[0] = interval[0];
        this.visibilityInterval[1] = interval[1];
    }

    public getModelMatrix(): mat4 {
        if (this.getGameObject()) {
            if (this.billboard) {
                return this.billboard.getModelMatrix();
            } else {
                return this.getGameObject().getTransform().getModelMatrix();
            }
        } else {
            return null;
        }
    }

    public getInverseModelMatrix(): mat4 {
        if (this.getGameObject()) {
            if (this.billboard) {
                return this.billboard.getInverseModelMatrix();
            } else {
                return this.getGameObject().getTransform().getInverseModelMatrix();
            }
        } else {
            return null;
        }
    }

    public abstract getFaceCount(): number;

    public draw(): void {
        this.renderable.draw();
    }

    protected updateComponent(): void {
        super.updateComponent();
        this.renderable.update();
    }

    protected attachToGameObject(gameObject: GameObject): void {
        super.attachToGameObject(gameObject);
        gameObject.getTransform().getInvalidatables().addInvalidatable(this);
        (RenderingPipeline.getRenderableContainer() as any).add(this);
    }

    protected detachFromGameObject(): void {
        this.getGameObject().getTransform().getInvalidatables().removeInvalidatable(this);
        super.detachFromGameObject();
        (RenderingPipeline.getRenderableContainer() as any).remove(this);
    }

}
