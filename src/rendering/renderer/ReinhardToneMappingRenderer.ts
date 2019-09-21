import { PostProcessRenderer } from '../PostProcessRenderer';
import { ReinhardToneMappingShader } from '../../resource/shader/ReinhardToneMappingShader';

export class ReinhardToneMappingRenderer extends PostProcessRenderer {

    private shader: ReinhardToneMappingShader;

    public constructor() {
        super('Reinhard Tone Mapping Renderer');
        this.shader = new ReinhardToneMappingShader();
    }

    protected getShader(): ReinhardToneMappingShader {
        return this.shader;
    }

}