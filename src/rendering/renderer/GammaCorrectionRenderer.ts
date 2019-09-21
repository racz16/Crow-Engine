import { PostProcessRenderer } from '../PostProcessRenderer';
import { GammaCorrectionShader } from '../../resource/shader/GammaCorrectionShader';

export class GammaCorrectionRenderer extends PostProcessRenderer {

    private shader: GammaCorrectionShader;

    public constructor() {
        super('Gamma Correction Renderer');
        this.shader = new GammaCorrectionShader();
    }

    protected getShader(): GammaCorrectionShader {
        return this.shader;
    }

}