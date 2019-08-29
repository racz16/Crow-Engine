import { mat4, vec3 } from 'gl-matrix';
import { IRenderableComponent } from '../IRenderableComponent';
import { IRenderable } from '../../../resource/IRenderable';
import { Scene } from '../../../core/Scene';
import { Utility } from '../../../utility/Utility';
import { IInvalidatable } from '../../../utility/invalidatable/IInvalidatable';
import { Transform } from '../../../core/Transform';

export abstract class Billboard implements IInvalidatable {

    protected renderableComponent: IRenderableComponent<IRenderable>;
    protected modelMatrix: mat4;
    protected inverseModelMatrix: mat4;
    private valid = false;

    protected setRenderableComponent(renderableComponent: IRenderableComponent<IRenderable>): void {
        if (this.renderableComponent) {
            this.renderableComponent.getInvalidatables().removeInvalidatable(this);
            Scene.getParameters().removeInvalidatable(Scene.MAIN_CAMERA, this);
        }
        this.renderableComponent = renderableComponent;
        if (this.renderableComponent) {
            this.renderableComponent.getInvalidatables().addInvalidatable(this);
            Scene.getParameters().addInvalidatable(Scene.MAIN_CAMERA, this);
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
        if (!this.valid) {
            this.refreshUnsafe();
            this.valid = true;
        }
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
        const mat = Utility.computeModelMatrixFromDirectionVectorsAndPosition(forward, up, right, position);
        mat4.scale(mat, mat, scale);
        return mat;
    }

    protected getMainCameraTransform(): Transform {
        return Scene.getParameters().get(Scene.MAIN_CAMERA).getGameObject().getTransform();
    }
}