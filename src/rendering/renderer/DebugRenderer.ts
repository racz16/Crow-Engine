import { Renderer } from '../Renderer';
import { QuadMesh } from '../../resource/mesh/QuadMesh';
import { RenderingPipeline } from '../RenderingPipeline';
import { Gl } from '../../webgl/Gl';
import { vec2, mat4, ReadonlyMat4 } from 'gl-matrix';
import { Engine } from '../../core/Engine';
import { DebugShader } from '../../resource/shader/DebugShader';
import { Conventions } from '../../resource/Conventions';

export class DebugRenderer extends Renderer {

    private shader: DebugShader;
    private quad: QuadMesh;

    private readonly transformation = mat4.create();
    private layer: number;

    public constructor() {
        super('Debug Renderer');
        this.shader = new DebugShader();
        this.quad = QuadMesh.getInstance();
    }

    public setData(transformation: ReadonlyMat4, layer: number): void {
        mat4.copy(this.transformation, transformation);
        this.layer = layer;
    }

    protected renderUnsafe(): void {
        this.beforeRendering();
        this.beforeDraw();
        this.draw();
    }

    protected beforeRendering(): void {
        this.shader.start();
        this.shader.setUniforms({ transformation: this.transformation, layer: this.layer });

        const canvas = Gl.getCanvas();
        Gl.setViewport(vec2.fromValues(canvas.clientWidth, canvas.clientHeight), vec2.create());
    }

    protected beforeDraw(): void {
        const image = Engine.getRenderingPipeline().getParameters().get(RenderingPipeline.DEBUG);
        image.getNativeTexture().bindToTextureUnit(Conventions.TU_ZERO);
    }

    protected draw(): void {
        Gl.setEnableDepthTest(false);
        this.quad.draw();
        Gl.setEnableDepthTest(true);
    }

    public getShader(): DebugShader {
        return this.shader;
    }

}
