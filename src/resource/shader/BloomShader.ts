import { Shader } from './Shader';

export class BloomShader extends Shader {

    protected getVertexShaderPath(): string {
        return 'res/shaders/bloom/bloom.vs';
    }

    protected getFragmentShaderPath(): string {
        return 'res/shaders/bloom/bloom.fs';
    }

}