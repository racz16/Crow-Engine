import { Renderer } from '../Renderer';
import { SkyBoxShader } from '../../resource/shader/SkyBoxShader';
import { CubeMesh } from '../../resource/mesh/CubeMesh';
import { Utility } from '../../utility/Utility';
import { RenderingPipeline } from '../RenderingPipeline';
import { Gl } from '../../webgl/Gl';
import { CubeMapTexture } from '../../resource/texture/CubeMapTexture';
import { vec2 } from 'gl-matrix';
import { Log } from '../../utility/log/Log';
import { LogLevel } from '../../utility/log/LogLevel';
import { Engine } from '../../core/Engine';

export class SkyBoxRenderer extends Renderer {

    private shader: SkyBoxShader;
    private box: CubeMesh;

    public constructor() {
        super('SkyBox Renderer');
        this.shader = new SkyBoxShader();
        this.box = CubeMesh.getInstance();
    }

    protected renderUnsafe(): void {
        if (!Utility.isUsable(this.shader)) {
            Log.logString(LogLevel.WARNING, 'The SkyBox shader is not usable');
            return;
        }

        const skybox = Engine.getParameters().get(Engine.MAIN_SKYBOX) as CubeMapTexture;
        if (!skybox || !skybox.isUsable()) {
            return;
        }
        this.prepare();

        this.shader.setUniforms();
        this.box.draw();

        Gl.gl.depthFunc(Gl.gl.LESS);
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