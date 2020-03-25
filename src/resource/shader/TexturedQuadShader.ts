import { Shader } from './Shader';
import { mat4 } from 'gl-matrix';

export class TexturedQuadShader extends Shader {

    protected getVertexShaderPath(): string {
        return 'res/shaders/texturedQuad/texturedQuad.vs';
    }
    protected getFragmentShaderPath(): string {
        return 'res/shaders/texturedQuad/texturedQuad.fs';
    }

    public connectTextureUnits(): void {
        this.getShaderProgram().connectTextureUnit('image', 10);
    }

    public setUniforms(data: mat4): void {
        this.getShaderProgram().loadMatrix4("transformation", data);
    }

}
