import { Renderer } from "../Renderer";
import { SkyBoxShader } from "../../resource/shader/SkyBoxShader";
import { CubeMesh } from "../../resource/mesh/CubeMesh";
import { Utility } from "../../utility/Utility";
import { Scene } from "../../core/Scene";
import { CameraComponent } from "../../component/camera/CameraComponent";
import { RenderingPipeline } from "../RenderingPipeline";
import { Gl } from "../../webgl/Gl";
import { CubeMapTexture } from "../../resource/texture/CubeMapTexture";
import { vec2 } from "gl-matrix";
import { Log } from "../../utility/log/Log";

export class SkyBoxRenderer extends Renderer {

    private shader: SkyBoxShader;
    private box: CubeMesh;

    public constructor() {
        super();
        this.shader = new SkyBoxShader();
        this.box = CubeMesh.getInstance();
    }

    public render(): void {
        Log.renderingInfo('skybox renderer started');
        const skybox = Scene.getParameters().getValue(Scene.MAIN_SKYBOX) as CubeMapTexture;
        if (!skybox || !skybox.allResourcesLoaded()) {
            return;
        }
        this.prepare();

        this.shader.setUniforms();
        this.box.draw();

        Gl.gl.depthFunc(Gl.gl.LESS);
        Log.renderingInfo('skybox renderer started');
    }

    private prepare(): void {
        if (!this.isUsable()) {
            this.shader = new SkyBoxShader();
        }
        CameraComponent.refreshMatricesUbo();
        this.shader.start();
        //RenderingPipeline.bindFbo();
        Gl.gl.depthFunc(Gl.gl.LEQUAL);
        Gl.setViewport(RenderingPipeline.getRenderingSize(),vec2.create());
    }

    public release(): void {
        this.shader.release();
    }

    public isUsable(): boolean {
        return Utility.isUsable(this.shader);
    }

    public removeFromRenderingPipeline(): void {

    }

}