import { Shader } from './Shader';
import { mat4 } from 'gl-matrix';
import { IRenderableComponent } from '../../component/renderable/IRenderableComponent';
import { IRenderable } from '../IRenderable';

export class VarianceShadowShader extends Shader {

    protected getVertexShaderPath(): string {
        return 'res/shaders/varianceShadow/varianceShadow.vs';
    }

    protected getFragmentShaderPath(): string {
        return 'res/shaders/varianceShadow/varianceShadow.fs';
    }

    public setShadowUniforms(renderableComponent: IRenderableComponent<IRenderable>, projectionViewMatrix: mat4): void {
        const projectionViewModelMatrix = mat4.create();
        const modelMatrix = renderableComponent.getModelMatrix();
        mat4.mul(projectionViewModelMatrix, projectionViewMatrix, modelMatrix);
        this.getShaderProgram().loadMatrix4('projectionViewModelMatrix', projectionViewModelMatrix);
    }

}