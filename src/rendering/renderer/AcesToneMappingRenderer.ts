import { PostProcessRenderer } from '../PostProcessRenderer';
import { GlConstants } from '../../webgl/GlConstants';
import { AcesToneMappingShader } from '../../resource/shader/AcesToneMappingShader';

export class AcesToneMappingRenderer extends PostProcessRenderer {

    private shader: AcesToneMappingShader;

    public constructor() {
        super('ACES Tone Mapping Renderer');
        if (!GlConstants.COLOR_BUFFER_FLOAT_ENABLED) {
            throw new Error();
        }
        this.shader = new AcesToneMappingShader();
    }

    protected getShader(): AcesToneMappingShader {
        return this.shader;
    }

}