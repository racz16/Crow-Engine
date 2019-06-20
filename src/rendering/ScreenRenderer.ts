import { Renderer } from "./Renderer";
import { QuadMesh } from "../resource/mesh/QuadMesh";
import { RenderingPipeline } from "./RenderingPipeline";
import { Fbo } from "../webgl/fbo/Fbo";
import { TexturedQuadShader } from "../resource/Shader/TexturedQuadShader";
import { Gl } from "../webgl/Gl";
import { vec2 } from "gl-matrix";
import { TestSceneBuilder } from "../test";

export class ScreenRenderer extends Renderer {

    private shader: TexturedQuadShader;
    private quad: QuadMesh;

    public constructor() {
        super();
        this.shader = new TexturedQuadShader();
        this.quad = QuadMesh.getInstance();
    }

    public render(): void {
        this.beforeShader();
        this.shader.start();
        this.beforeDrawQuad();
        //Gl.setEnableDepthTest(false);
        this.quad.draw();
        //Gl.setEnableDepthTest(true);
    }

    private beforeShader(): void {
        if (this.shader == null || this.shader.isReleased()) {
            this.shader = new TexturedQuadShader();
        }
        if (this.quad == null || this.quad.isReleased()) {
            this.quad = QuadMesh.getInstance();
        }
        Fbo.bindDefaultFrameBuffer();
        const canvas = Gl.getCanvas();
        Gl.setViewport(vec2.fromValues(canvas.clientWidth, canvas.clientHeight), vec2.create());
    }

    private beforeDrawQuad(): void {
        /*const image = RenderingPipeline.getParameters().getValue(RenderingPipeline.WORK);
        image.bindToTextureUnit(0);*/
        const image = TestSceneBuilder.diffuse;
        if(image != null && image.loaded){
            image.bindToTextureUnit(0);
        }
    }

    public release(): void {
        if (!this.shader.isReleased()) {
            this.shader.release();
        }
    }

    public removeFromRenderingPipeline(): void {

    }

    public isUsable(): boolean {
        return true;
    }

}
