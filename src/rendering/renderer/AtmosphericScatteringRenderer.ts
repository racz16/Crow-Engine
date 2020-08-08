import { GeometryRenderer } from '../GeometryRenderer';
import { Shader } from '../../resource/shader/Shader';
import { AtmosphericScatteringShader } from '../../resource/shader/AtmosphericScatteringShader';
import { QuadMesh } from '../../resource/mesh/QuadMesh';
import { Gl } from '../../webgl/Gl';
import { PbrLightsStruct } from '../../component/light/pbr/PbrLightsStruct';
import { Engine } from '../../core/Engine';
import { GlFboAttachmentSlot } from '../../webgl/enum/GlFboAttachmentSlot';

export class AtmosphericScatteringRenderer extends GeometryRenderer {

    private shader = new AtmosphericScatteringShader();
    private quad: QuadMesh;

    public constructor() {
        super('Atmospheric Scattering Renderer');
        this.quad = QuadMesh.getInstance();
    }

    protected renderUnsafe(): void {
        if (!this.opaque) {
            return;
        }
        const viewport = Gl.getViewportSize();
        this.getShader().getNativeShaderProgram().loadVector2('u_viewport', viewport);

        const lightDirection = PbrLightsStruct.getInstance().getShadowLightSource().getGameObject().getTransform().getForwardVector();
        this.getShader().getNativeShaderProgram().loadVector3('u_lightDirection', lightDirection);

        this.quad.draw();
    }

    protected beforeRendering(): void {
        super.beforeRendering();
        Gl.setEnableDepthTest(true);
        Gl.gl.depthFunc(Gl.gl.LEQUAL);

        const fbo = Engine.getRenderingPipeline().getGeometryFbo();
        fbo.setDrawBuffers(fbo.getAttachmentContainer(GlFboAttachmentSlot.COLOR, 0), fbo.getAttachmentContainer(GlFboAttachmentSlot.COLOR, 1));
    }

    protected afterRendering(): void {
        super.afterRendering();
        Gl.gl.depthFunc(Gl.gl.LESS);
        const fbo = Engine.getRenderingPipeline().getGeometryFbo();
        fbo.setDrawBuffers(fbo.getAttachmentContainer(GlFboAttachmentSlot.COLOR, 0));
    }

    protected getShader(): Shader {
        return this.shader;
    }

}