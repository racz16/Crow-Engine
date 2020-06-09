import { Shader } from './Shader';
import { Conventions } from '../Conventions';

export class GaussianBlurShader extends Shader {

    private horizontal = true;
    private layer = 0;
    private blurOffset = 0.005;

    public isHorizontal(): boolean {
        return this.horizontal;
    }

    public setHorizontal(horizontal: boolean): void {
        this.horizontal = horizontal;
    }

    public setBlurOffset(blurOffset: number): void {
        this.blurOffset = blurOffset;
    }

    public setLayer(layer: number): void {
        this.layer = layer;
    }

    public setUniforms(): void {
        this.getShaderProgram().loadBoolean('horizontal', this.horizontal);
        this.getShaderProgram().loadInt('layer', this.layer);
        this.getShaderProgram().loadFloat('blurOffset', this.blurOffset);
    }

    protected connectTextureUnits(): void {
        this.getShaderProgram().connectTextureUnit('image', Conventions.ZERO_TEXTURE_UNIT);
    }

    protected getVertexShaderPath(): string {
        return 'res/shaders/gaussianBlur/gaussianBlur.vs';
    }

    protected getFragmentShaderPath(): string {
        return 'res/shaders/gaussianBlur/gaussianBlur.fs';
    }

}