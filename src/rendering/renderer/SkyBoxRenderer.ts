import { SkyBoxShader } from '../../resource/shader/SkyboxShader';
import { Gl } from '../../webgl/Gl';
import { GeometryRenderer } from '../GeometryRenderer';
import { IRenderableComponent } from '../../component/renderable/IRenderableComponent';
import { IRenderable } from '../../resource/IRenderable';
import { Utility } from '../../utility/Utility';

export class SkyboxRenderer extends GeometryRenderer {

    private shader: SkyBoxShader;

    public constructor() {
        super('SkyBox Renderer');
        this.shader = new SkyBoxShader();
    }

    protected drawPredicate(renderableComponent: IRenderableComponent<IRenderable>): boolean {
        return Utility.isUsable(renderableComponent.getRenderable()) && renderableComponent.isActive();
    }

    protected beforeRendering(): void {
        super.beforeRendering();
        Gl.gl.depthFunc(Gl.gl.LEQUAL);
    }

    protected afterRendering(): void {
        super.afterRendering();
        Gl.gl.depthFunc(Gl.gl.LESS);
    }

    public getShader(): SkyBoxShader {
        return this.shader;
    }

}