import { Shader } from './Shader';
import { Conventions } from '../Conventions';

export class GammaCorrectionShader extends Shader {

    protected connectTextureUnits(): void {
        this.getShaderProgram().connectTextureUnit('image', Conventions.ZERO_TEXTURE_UNIT);
    }

    protected getVertexShaderPath(): string {
        return 'res/shaders/gammaCorrection/gammaCorrection.vs';
    }

    protected getFragmentShaderPath(): string {
        return 'res/shaders/gammaCorrection/gammaCorrection.fs';
    }

}