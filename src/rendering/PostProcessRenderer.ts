import { Renderer } from './Renderer';
import { Gl } from '../webgl/Gl';
import { QuadMesh } from '../resource/mesh/QuadMesh';
import { Engine } from '../core/Engine';
import { RenderingPipeline } from './RenderingPipeline';

export abstract class PostProcessRenderer extends Renderer {

    protected quad: QuadMesh;

    public constructor(name: string) {
        super(name);
        this.quad = QuadMesh.getInstance();
    }

    protected renderUnsafe(): void {
        const image = Engine.getRenderingPipeline().getParameters().get(RenderingPipeline.WORK);
        image.bindToTextureUnit(0);
        Gl.setEnableDepthTest(false);
        this.getShader().setUniforms();
        this.quad.draw();
        this.incrementRenderedElementCountBy(1);
        this.incrementRenderedFaceCountBy(this.quad.getFaceCount());
    }

}