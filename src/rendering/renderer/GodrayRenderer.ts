import { PostProcessRenderer } from '../PostProcessRenderer';
import { Shader } from '../../resource/shader/Shader';
import { GodrayShader } from '../../resource/shader/GodrayShader';

export class GodrayRenderer extends PostProcessRenderer {

    private shader: GodrayShader;

    public constructor() {
        super('Godray Renderer');
        this.shader = new GodrayShader();
    }

    protected getShader(): Shader {
        return this.shader;
    }

}