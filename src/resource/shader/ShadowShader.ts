import { Shader } from './Shader';
import { mat4, ReadonlyMat4 } from 'gl-matrix';
import { IRenderableComponent } from '../../component/renderable/IRenderableComponent';
import { IRenderable } from '../IRenderable';

export class ShadowShader extends Shader {

    protected getVertexShaderPath(): string {
        return 'res/shaders/shadow/shadow.vs';
    }

    protected getFragmentShaderPath(): string {
        return 'res/shaders/shadow/shadow.fs';
    }

    public setShadowUniforms(renderableComponent: IRenderableComponent<IRenderable>, projectionViewMatrix: ReadonlyMat4): void {
        const projectionViewModelMatrix = mat4.create();
        const modelMatrix = renderableComponent.getModelMatrix();
        mat4.mul(projectionViewModelMatrix, projectionViewMatrix, modelMatrix);
        this.getShaderProgram().loadMatrix4('projectionViewModelMatrix', projectionViewModelMatrix);
    }

}