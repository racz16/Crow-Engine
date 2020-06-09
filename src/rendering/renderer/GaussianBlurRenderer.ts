import { PostProcessRenderer } from '../PostProcessRenderer';
import { GaussianBlurShader } from '../../resource/shader/GaussianBlurShader';
import { Engine } from '../../core/Engine';
import { RenderingPipeline } from '../RenderingPipeline';
import { Gl } from '../../webgl/Gl';
import { Conventions } from '../../resource/Conventions';

export class GaussianBlurRenderer extends PostProcessRenderer {

    private readonly shader: GaussianBlurShader;
    private readonly horizontal: boolean;
    private readonly layer: number;

    public constructor(horizontal: boolean, layer: number) {
        super('Gaussian Blur Renderer');
        this.shader = new GaussianBlurShader();
        this.horizontal = horizontal;
        this.layer = layer;
    }

    protected renderUnsafe(): void {
        const image = Engine.getRenderingPipeline().getParameters().get(RenderingPipeline.WORK);
        image.getNativeTexture().bindToTextureUnit(Conventions.ZERO_TEXTURE_UNIT);
        Gl.setEnableDepthTest(false);
        this.renderGaussianPass();
    }

    private renderGaussianPass(): void {
        this.getShader().setHorizontal(this.horizontal);
        this.getShader().setUniforms();
        this.quad.draw();
        this.incrementRenderedElementCountBy(1);
        this.incrementRenderedFaceCountBy(this.quad.getFaceCount());
    }

    public getShader(): GaussianBlurShader {
        return this.shader;
    }

}