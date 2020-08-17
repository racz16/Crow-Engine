import { GeometryRenderer } from './GeometryRenderer';
import { GlFbo } from '../webgl/fbo/GlFbo';
import { GlTexture2D } from '../webgl/texture/GlTexture2D';
import { GlInternalFormat } from '../webgl/enum/GlInternalFormat';
import { Engine } from '../core/Engine';
import { vec2, vec4 } from 'gl-matrix';
import { Utility } from '../utility/Utility';
import { RenderingPipeline } from './RenderingPipeline';
import { GlFboAttachmentSlot } from '../webgl/enum/GlFboAttachmentSlot';
import { BlendShader } from '../resource/shader/BlendShader';
import { Gl } from '../webgl/Gl';
import { GlBlendEquation } from '../webgl/enum/GlBlendEquation';
import { Conventions } from '../resource/Conventions';
import { QuadMesh } from '../resource/mesh/QuadMesh';
import { RendererContainer } from './RendererContainer';
import { GlBlendFunc } from '../webgl/enum/GlBlendFunc';

export class DualDepthPeeling {

    private fbo: GlFbo;
    private frontTextures: Array<GlTexture2D>;
    private dualDepthTextures: Array<GlTexture2D>;
    private backTexture: GlTexture2D;

    private renderingSize: vec2;

    private blendShader: BlendShader;

    public constructor() {
        this.renderingSize = vec2.create();
        this.updateFboAndAttachments();
        this.blendShader = new BlendShader();
    }

    private updateFboAndAttachments(): void {
        const realRenderingSize = Engine.getRenderingPipeline().getRenderingSize()
        if (!Utility.isUsable(this.fbo) || this.renderingSize[0] !== realRenderingSize[0] || this.renderingSize[1] !== realRenderingSize[1]) {
            this.releaseResources();
            this.createFboAndAttachments();
        }
    }

    private releaseResources(): void {
        if (this.fbo) {
            Utility.releaseIfUsable(this.fbo);
            Utility.releaseIfUsable(this.frontTextures[0]);
            Utility.releaseIfUsable(this.frontTextures[1]);
            Utility.releaseIfUsable(this.dualDepthTextures[0]);
            Utility.releaseIfUsable(this.dualDepthTextures[1]);
            Utility.releaseIfUsable(this.backTexture);
        }
    }

    private createFboAndAttachments(): void {
        this.fbo = new GlFbo();
        Engine.getRenderingPipeline().getParameters().set(RenderingPipeline.DUAL_DEPTH_FBO, this.fbo);
        this.frontTextures = new Array<GlTexture2D>();
        this.frontTextures.push(this.createTexture(GlInternalFormat.RGBA16F));
        this.frontTextures.push(this.createTexture(GlInternalFormat.RGBA16F));
        this.dualDepthTextures = new Array<GlTexture2D>();
        this.dualDepthTextures.push(this.createTexture(GlInternalFormat.RG32F));
        this.dualDepthTextures.push(this.createTexture(GlInternalFormat.RG32F));
        this.backTexture = this.createTexture(GlInternalFormat.RGBA16F);
    }

    private createTexture(internalFormat: GlInternalFormat): GlTexture2D {
        const texture = new GlTexture2D();
        texture.allocate(internalFormat, Engine.getRenderingPipeline().getRenderingSize(), false);
        return texture;
    }

    public render(geometryRenderers: RendererContainer<GeometryRenderer>): void {
        this.updateFboAndAttachments();
        this.beforeRender();

        this.fbo.setDrawBuffers(this.fbo.getAttachmentContainer(GlFboAttachmentSlot.COLOR, 0));
        this.fbo.getAttachmentContainer(GlFboAttachmentSlot.COLOR, 0).attachTexture2D(this.dualDepthTextures[1]);
        Gl.setClearColor(vec4.fromValues(-0, 1, 0, 0));
        Gl.clear(true, false, false);
        this.fbo.getAttachmentContainer(GlFboAttachmentSlot.COLOR, 0).detachAttachment();

        let writeIndex: number;
        const passCount = Engine.getRenderingPipeline().getParameters().get(RenderingPipeline.DUAL_DEPTH_PEEL_PASS_COUNT) || 4;
        for (let i = 0; i < passCount; i++) {
            writeIndex = i % 2;
            this.dualDepthPeelPass(writeIndex, geometryRenderers);
            this.backBlendPass();
        }
        this.backFrontBlendPass(writeIndex);

        this.afterRender();
    }

    private beforeRender(): void {
        Gl.setEnableBlend(true);
        Gl.setDepthWrite(false);
        Gl.setEnableCullFace(false);
    }

    private dualDepthPeelPass(textureIndex: number, geometryRenderers: RendererContainer<GeometryRenderer>): void {
        Gl.setEnableDepthTest(true);
        Gl.setBlendEquation(GlBlendEquation.MAX);

        Engine.getRenderingPipeline().getParameters().set(RenderingPipeline.DUAL_DEPTH, this.dualDepthTextures[1 - textureIndex]);
        Engine.getRenderingPipeline().getParameters().set(RenderingPipeline.FRONT, this.frontTextures[1 - textureIndex]);

        const depth = Engine.getRenderingPipeline().getParameters().get(RenderingPipeline.DEPTH);
        this.fbo.getAttachmentContainer(GlFboAttachmentSlot.COLOR, 0).detachAttachment();
        this.fbo.getAttachmentContainer(GlFboAttachmentSlot.COLOR, 1).detachAttachment();
        this.fbo.getAttachmentContainer(GlFboAttachmentSlot.COLOR, 2).detachAttachment();
        this.fbo.getAttachmentContainer(GlFboAttachmentSlot.COLOR, 3).attachTexture2D(this.dualDepthTextures[textureIndex]);
        this.fbo.getAttachmentContainer(GlFboAttachmentSlot.COLOR, 4).attachTexture2D(this.frontTextures[textureIndex]);
        this.fbo.getAttachmentContainer(GlFboAttachmentSlot.COLOR, 5).attachTexture2D(this.backTexture);
        this.fbo.getAttachmentContainer(GlFboAttachmentSlot.DEPTH).attachTexture2D(depth as GlTexture2D);

        this.fbo.setDrawBuffers(null, null, null,
            this.fbo.getAttachmentContainer(GlFboAttachmentSlot.COLOR, 3)
        );
        Gl.setClearColor(vec4.fromValues(-9999.0, -9999.0, 0, 0));
        Gl.clear(true, false, false);

        for (const renderer of geometryRenderers.getIterator()) {
            renderer.render(false);
        }
    }

    private backBlendPass(): void {
        Gl.setEnableDepthTest(false);
        Gl.setBlendEquation(GlBlendEquation.FUNC_ADD);

        const texture = Engine.getRenderingPipeline().getParameters().get(RenderingPipeline.WORK);
        this.fbo.getAttachmentContainer(GlFboAttachmentSlot.COLOR, 0).attachTexture2D(texture as GlTexture2D);
        this.fbo.getAttachmentContainer(GlFboAttachmentSlot.COLOR, 3).detachAttachment();
        this.fbo.getAttachmentContainer(GlFboAttachmentSlot.COLOR, 4).detachAttachment();
        this.fbo.getAttachmentContainer(GlFboAttachmentSlot.COLOR, 5).detachAttachment();
        this.fbo.getAttachmentContainer(GlFboAttachmentSlot.DEPTH).detachAttachment();
        this.fbo.setDrawBuffers(this.fbo.getAttachmentContainer(GlFboAttachmentSlot.COLOR, 0));

        this.blendShader.start();
        this.blendShader.getNativeShaderProgram().connectTextureUnit('image', Conventions.TU_ZERO);
        this.blendShader.getNativeShaderProgram().loadTexture(Conventions.TU_ZERO, this.backTexture);
        QuadMesh.getInstance().draw();
    }

    private backFrontBlendPass(textureIndex: number): void {
        this.blendShader.start();
        this.blendShader.getNativeShaderProgram().connectTextureUnit('image', Conventions.TU_ZERO);
        this.blendShader.getNativeShaderProgram().loadTexture(Conventions.TU_ZERO, this.frontTextures[textureIndex]);
        QuadMesh.getInstance().draw();
    }

    private afterRender(): void {
        Gl.setEnableBlend(false);
        Gl.setDepthWrite(true);
        Gl.setEnableCullFace(true);
    }

}