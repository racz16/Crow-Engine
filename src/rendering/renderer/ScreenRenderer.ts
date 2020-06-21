import { Renderer } from '../Renderer';
import { QuadMesh } from '../../resource/mesh/QuadMesh';
import { RenderingPipeline } from '../RenderingPipeline';
import { TexturedQuadShader } from '../../resource/Shader/TexturedQuadShader';
import { Gl } from '../../webgl/Gl';
import { vec2, mat4, ReadonlyMat4 } from 'gl-matrix';
import { Engine } from '../../core/Engine';
import { GlFbo } from '../../webgl/fbo/GlFbo';
import { Conventions } from '../../resource/Conventions';

export class ScreenRenderer extends Renderer {

    private shader: TexturedQuadShader;
    private quad: QuadMesh;

    private readonly transformation = mat4.create();

    public constructor() {
        super('Screen Renderer');
        this.shader = new TexturedQuadShader();
        this.quad = QuadMesh.getInstance();
    }

    public setTransformation(transformation: ReadonlyMat4): void {
        mat4.copy(this.transformation, transformation);
    }

    protected renderUnsafe(): void {
        //this.beforeRendering();
        this.beforeDraw();
        this.draw();
    }

    protected beforeRendering(): void {
        super.beforeRendering();
        GlFbo.bindDefaultFrameBuffer();
        Gl.clear(true, true, false);
        //this.shader.start();
        this.shader.setUniforms(this.transformation);

        const canvas = Gl.getCanvas();
        Gl.setViewport(vec2.fromValues(canvas.clientWidth, canvas.clientHeight), vec2.create());
    }

    protected beforeDraw(): void {
        const image = Engine.getRenderingPipeline().getParameters().get(RenderingPipeline.WORK);
        image.getNativeTexture().bindToTextureUnit(Conventions.TU_ZERO);
    }

    protected draw(): void {
        Gl.setEnableDepthTest(false);
        this.quad.draw();
        Gl.setEnableDepthTest(true);
    }

    public getShader(): TexturedQuadShader {
        return this.shader;
    }

}
