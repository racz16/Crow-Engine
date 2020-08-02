import { Shader } from './Shader';
import { mat4, ReadonlyMat4 } from 'gl-matrix';
import { IRenderableComponent } from '../../component/renderable/IRenderableComponent';
import { IRenderable } from '../IRenderable';
import { Conventions } from '../Conventions';
import { AlphaSlotHelper } from './slotHelper/AlphaSlotHelper';

export class VarianceShadowShader extends Shader {

    private slotHelper: AlphaSlotHelper;

    public constructor() {
        super();
        this.slotHelper = new AlphaSlotHelper(this.getShaderProgram(), Conventions.TU_ZERO, true);
    }

    protected getVertexShaderPath(): string {
        return 'res/shaders/varianceShadow/varianceShadow.vs';
    }

    protected getFragmentShaderPath(): string {
        return 'res/shaders/varianceShadow/varianceShadow.fs';
    }

    public setShadowUniforms(renderableComponent: IRenderableComponent<IRenderable>, projectionViewMatrix: ReadonlyMat4): void {
        const projectionViewModelMatrix = mat4.create();
        const modelMatrix = renderableComponent.getModelMatrix();
        mat4.mul(projectionViewModelMatrix, projectionViewMatrix, modelMatrix);
        this.getShaderProgram().loadMatrix4('projectionViewModelMatrix', projectionViewModelMatrix);
        this.slotHelper.loadSlot(renderableComponent.getMaterial());
    }

}