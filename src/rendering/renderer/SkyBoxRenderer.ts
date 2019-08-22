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
import { LogLevel } from "../../utility/log/LogLevel";
import { LogType } from "../../utility/log/LogType";

export class SkyBoxRenderer extends Renderer {

    private shader: SkyBoxShader;
    private box: CubeMesh;

    public constructor() {
        super();
        this.shader = new SkyBoxShader();
        this.box = CubeMesh.getInstance();
    }

    public render(): void {
        if (!Utility.isUsable(this.shader)) {
            Log.logString(LogLevel.WARNING, LogType.RESOURCES, 'The SkyBox shader is not usable');
            return;
        }
        Log.startGroup('SkyBox renderer');
        const skybox = Scene.getParameters().get(Scene.MAIN_SKYBOX) as CubeMapTexture;
        if (!skybox || !skybox.allResourcesLoaded()) {
            return;
        }

        this.prepare();

        this.shader.setUniforms();
        this.box.draw();

        Gl.gl.depthFunc(Gl.gl.LESS);
        Log.logString(LogLevel.INFO_2, LogType.RENDERING, 'SkyBox finished rendering');
        Log.endGroup();
    }

    private prepare(): void {
        if (!this.isUsable()) {
            //this.shader = new SkyBoxShader();
        }
        this.shader.start();
        //RenderingPipeline.bindFbo();
        Gl.gl.depthFunc(Gl.gl.LEQUAL);
        Gl.setViewport(RenderingPipeline.getRenderingSize(), vec2.create());
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