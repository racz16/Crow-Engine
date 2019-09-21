import { Shader } from './Shader';

export class GammaCorrectionShader extends Shader {

    protected connectTextureUnits(): void {
        this.getShaderProgram().connectTextureUnit('image', 0);
    }

    protected getVertexShaderPath(): string {
        return 'res/shaders/gammaCorrection/vertex.glsl';
    }

    protected getFragmentShaderPath(): string {
        return 'res/shaders/gammaCorrection/fragment.glsl';
    }

}