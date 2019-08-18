import { IBillboard } from "./IBillboard";
import { mat4, vec3 } from "gl-matrix";
import { ICameraComponent } from "../../camera/ICameraComponent";
import { IRenderableComponent } from "../IRenderableComponent";
import { IRenderable } from "../../../resource/IRenderable";
import { Scene } from "../../../core/Scene";
import { Utility } from "../../../utility/Utility";

export abstract class Billboard implements IBillboard {

    private renderableComponent: IRenderableComponent<IRenderable>;
    private camera: ICameraComponent;
    private valid = false;
    private modelMatrix: mat4;
    private inverseModelMatrix: mat4;

    public private_setRenderableComponent(renderableComponent: IRenderableComponent<IRenderable>): void {
        if (this.renderableComponent) {
            this.renderableComponent.getInvalidatables().removeInvalidatable(this);
        }
        this.renderableComponent = renderableComponent;
        if (this.renderableComponent) {
            this.renderableComponent.getInvalidatables().addInvalidatable(this);
        }
        this.invalidate();
    }

    public getRenderableComponent(): IRenderableComponent<IRenderable> {
        return this.renderableComponent;
    }

    protected isValid(): boolean {
        return this.valid;
    }

    protected setValid(valid: boolean): void {
        this.valid = valid;
    }

    protected getCamera(): ICameraComponent {
        return this.camera;
    }

    protected setModelMatrix(modelMatrix: mat4): void {
        this.modelMatrix = modelMatrix;
    }

    protected setInverseModelMatrix(inverseModelMatrix: mat4): void {
        this.inverseModelMatrix = inverseModelMatrix;
    }

    protected setMatricesToDefault(): void {
        this.modelMatrix = Utility.computeModelMatrix(
            this.renderableComponent.getGameObject().getTransform().getAbsolutePosition(),
            vec3.fromValues(0, 0, 90),
            this.renderableComponent.getGameObject().getTransform().getAbsoluteScale()
        )
        this.inverseModelMatrix = mat4.create();
        mat4.invert(this.inverseModelMatrix, this.modelMatrix);
    }

    public invalidate(sender?: any): void {
        this.valid = false;
    }

    protected refresh(): void {
        const camera = Scene.getParameters().get(Scene.MAIN_CAMERA);
        if (!this.valid || this.camera != camera) {
            if (this.camera != camera) {
                this.changeCamera(camera);
            }
            this.refreshUnsafe();
            this.valid = true;
        }
    }

    private changeCamera(camera: ICameraComponent): void {
        if (this.camera) {
            this.camera.getInvalidatables().removeInvalidatable(this);
        }
        this.camera = camera;
        this.camera.getInvalidatables().addInvalidatable(this);
    }

    protected abstract refreshUnsafe(): void;

    protected isUsable(): boolean {
        return this.renderableComponent && this.renderableComponent.getGameObject() && Scene.getParameters().get(Scene.MAIN_CAMERA) != null;
    }

    public getModelMatrix(): mat4 {
        if (this.isUsable()) {
            this.refresh();
            return this.modelMatrix;
        } else {
            return null;
        }
    }

    public getInverseModelMatrix(): mat4 {
        if (this.isUsable()) {
            this.refresh();
            return this.inverseModelMatrix;
        } else {
            return null;
        }
    }

    protected createBillboard(forward: vec3, up: vec3, right: vec3): mat4 {
        const transform = this.getRenderableComponent().getGameObject().getTransform();
        const position = transform.getAbsolutePosition();
        const scale = transform.getAbsoluteScale();
        const mat = this.createMatrixFromVectors(forward, up, right, position);
        mat4.scale(mat, mat, scale);
        return mat;
    }

    private createMatrixFromVectors(forward: vec3, up: vec3, right: vec3, position: vec3): mat4 {
        return mat4.fromValues(
            right[0], right[1], right[2], 0,
            up[0], up[1], up[2], 0,
            forward[0], forward[1], forward[2], 0,
            position[0], position[1], position[2], 1
        );
    }

}