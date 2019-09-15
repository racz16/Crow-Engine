import { SkyBoxShader as SkyboxShader } from '../../resource/shader/SkyboxShader';
import { Gl } from '../../webgl/Gl';
import { GeometryRenderer } from '../GeometryRenderer';
import { IRenderableComponent } from '../../component/renderable/IRenderableComponent';
import { IRenderable } from '../../resource/IRenderable';

export class SkyboxRenderer extends GeometryRenderer {

    private shader: SkyboxShader;

    public constructor() {
        super('Skybox Renderer');
        this.shader = new SkyboxShader();
    }

    protected drawPredicate(renderableComponent: IRenderableComponent<IRenderable>): boolean {
        return renderableComponent.getRenderable().isUsable() && renderableComponent.isActive();
    }

    protected beforeRendering(): void {
        super.beforeRendering();
        Gl.gl.depthFunc(Gl.gl.LEQUAL);
    }

    protected afterRendering(): void {
        super.afterRendering();
        Gl.gl.depthFunc(Gl.gl.LESS);
    }

    public getShader(): SkyboxShader {
        return this.shader;
    }

}