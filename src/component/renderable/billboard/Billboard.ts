import { mat4, vec3 } from 'gl-matrix';
import { IRenderableComponent } from '../IRenderableComponent';
import { IRenderable } from '../../../resource/IRenderable';
import { Utility } from '../../../utility/Utility';
import { IInvalidatable } from '../../../utility/invalidatable/IInvalidatable';
import { Transform } from '../../../core/Transform';
import { Log } from '../../../utility/log/Log';
import { LogLevel } from '../../../utility/log/LogLevel';
import { Engine } from '../../../core/Engine';

export abstract class Billboard implements IInvalidatable {

    protected renderableComponent: IRenderableComponent<IRenderable>;
    protected modelMatrix: mat4;
    protected inverseModelMatrix: mat4;
    private valid = false;

    protected setRenderableComponent(renderableComponent: IRenderableComponent<IRenderable>): void {
        if (this.renderableComponent) {
            this.renderableComponent.getInvalidatables().removeInvalidatable(this);
            Engine.getParameters().removeInvalidatable(Engine.MAIN_CAMERA, this);
        }
        this.renderableComponent = renderableComponent;
        if (this.renderableComponent) {
            this.renderableComponent.getInvalidatables().addInvalidatable(this);
            Engine.getParameters().addInvalidatable(Engine.MAIN_CAMERA, this);
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

    private refresh(): void {
        if (!this.valid) {
            this.refreshUnsafe();
            this.valid = true;
            Log.logString(LogLevel.INFO_3, 'Billboard matrices refreshed');
        }
    }

    protected abstract refreshUnsafe(): void;

    protected isUsable(): boolean {
        const camera = Engine.getMainCamera();
        return this.renderableComponent && this.renderableComponent.getGameObject() && camera && camera.getGameObject() != null;
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
        return Engine.getMainCamera().getGameObject().getTransform();
    }
}