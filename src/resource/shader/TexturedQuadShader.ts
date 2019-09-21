import { Shader } from './Shader';

export class TexturedQuadShader extends Shader {

    protected getVertexShaderPath(): string {
        return 'res/shaders/texturedQuad/vertex.glsl';
    }
    protected getFragmentShaderPath(): string {
        return 'res/shaders/texturedQuad/fragment.glsl';
    }

    public connectTextureUnits(): void {
        this.getShaderProgram().connectTextureUnit('image', 0);
    }

}
