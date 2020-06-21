import { Shader } from './Shader';
import { ReadonlyMat4 } from 'gl-matrix';
import { Conventions } from '../Conventions';

export class TexturedQuadShader extends Shader {

    protected getVertexShaderPath(): string {
        return 'res/shaders/texturedQuad/texturedQuad.vs';
    }
    protected getFragmentShaderPath(): string {
        return 'res/shaders/texturedQuad/texturedQuad.fs';
    }

    public connectTextureUnits(): void {
        this.getShaderProgram().connectTextureUnit('image', Conventions.TU_ZERO);
    }

    public setUniforms(data: ReadonlyMat4): void {
        this.getShaderProgram().loadMatrix4("transformation", data);
    }

}
