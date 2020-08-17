import { Shader } from './Shader';

export class BlendShader extends Shader {

    protected getVertexShaderPath(): string {
        return 'res/shaders/blend/blend.vs';
    }

    protected getFragmentShaderPath(): string {
        return 'res/shaders/blend/blend.fs';
    }

}