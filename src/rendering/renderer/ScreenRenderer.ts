import { Renderer } from '../Renderer';
import { QuadMesh } from '../../resource/mesh/QuadMesh';
import { RenderingPipeline } from '../RenderingPipeline';
import { Fbo } from '../../webgl/fbo/Fbo';
import { TexturedQuadShader } from '../../resource/Shader/TexturedQuadShader';
import { Gl } from '../../webgl/Gl';
import { vec2 } from 'gl-matrix';
import { Utility } from '../../utility/Utility';
import { Log } from '../../utility/log/Log';
import { LogLevel } from '../../utility/log/LogLevel';

export class ScreenRenderer extends Renderer {

    private shader: TexturedQuadShader;
    private quad: QuadMesh;

    public constructor() {
        super('Screen Renderer');
        this.shader = new TexturedQuadShader();
        this.quad = QuadMesh.getInstance();
    }

    protected renderUnsafe(): void {
        if (!Utility.isUsable(this.shader)) {
            Log.logString(LogLevel.WARNING, 'The Textured quad shader is not usable');
            return;
        }
        this.beforeShader();
        this.shader.start();
        this.beforeDrawQuad();
        Gl.setEnableDepthTest(false);
        this.quad.draw();
        Gl.setEnableDepthTest(true);
    }

    private beforeShader(): void {

        if (!Utility.isUsable(this.quad)) {
            this.quad = QuadMesh.getInstance();
        }
        Fbo.bindDefaultFrameBuffer();
        const canvas = Gl.getCanvas();
        Gl.setViewport(vec2.fromValues(canvas.clientWidth, canvas.clientHeight), vec2.create());
    }

    private beforeDrawQuad(): void {
        /**/
        const image = RenderingPipeline.getParameters().get(RenderingPipeline.WORK);
        if (image && image.isUsable()) {
            image.getNativeTexture().bindToTextureUnit(0);
        }
    }

    public release(): void {
        if (!this.shader.isUsable()) {
            this.shader.release();
        }
    }

    public getShader(): TexturedQuadShader {
        return this.shader;
    }

    public isUsable(): boolean {
        return true;
    }

}
