import { Shader } from "./Shader";
import { mat4 } from "gl-matrix";

export class ShadowShader extends Shader {

    public loadProjectionViewModelMatrix(projectionViewModelMatrix: mat4): void {
        this.getShaderProgram().loadMatrix4("projectionViewModelMatrix", projectionViewModelMatrix);
    }

    protected getVertexShaderPath(): string {
        return 'res/shaders/shadow/vertex.glsl';
    }

    protected getFragmentShaderPath(): string {
        return 'res/shaders/shadow/vertex.glsl';
    }

}