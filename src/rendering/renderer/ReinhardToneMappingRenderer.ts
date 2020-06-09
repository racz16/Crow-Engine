import { PostProcessRenderer } from '../PostProcessRenderer';
import { ReinhardToneMappingShader } from '../../resource/shader/ReinhardToneMappingShader';
import { GlConstants } from '../../webgl/GlConstants';

export class ReinhardToneMappingRenderer extends PostProcessRenderer {

    private shader: ReinhardToneMappingShader;

    public constructor() {
        super('Reinhard Tone Mapping Renderer');
        if (!GlConstants.COLOR_BUFFER_FLOAT_ENABLED) {
            throw new Error();
        }
        this.shader = new ReinhardToneMappingShader();
    }

    protected getShader(): ReinhardToneMappingShader {
        return this.shader;
    }

}