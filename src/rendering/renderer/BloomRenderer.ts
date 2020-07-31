import { GlFbo } from '../../webgl/fbo/GlFbo';
import { GlFboAttachmentSlot } from '../../webgl/enum/GlFboAttachmentSlot';
import { Gl } from '../../webgl/Gl';
import { GlInternalFormat } from '../../webgl/enum/GlInternalFormat';
import { Utility } from '../../utility/Utility';
import { Engine } from '../../core/Engine';
import { RenderingPipeline } from '../RenderingPipeline';
import { GaussianBlurShader } from '../../resource/shader/GaussianBlurShader';
import { QuadMesh } from '../../resource/mesh/QuadMesh';
import { vec2 } from 'gl-matrix';
import { GlTexture2DArray } from '../../webgl/texture/GlTexture2DArray';
import { GlWrap } from '../../webgl/enum/GlWrap';
import { GlMinificationFilter } from '../../webgl/enum/GlMinificationFilter';
import { GlMagnificationFilter } from '../../webgl/enum/GlMagnificationFIlter';
import { Conventions } from '../../resource/Conventions';
import { PostProcessRenderer } from '../PostProcessRenderer';
import { BloomShader } from '../../resource/shader/BloomShader';

export class BloomRenderer extends PostProcessRenderer {

    private shader: BloomShader;
    private gaussianBlurShader: GaussianBlurShader;
    private fbo: GlFbo;
    private texture = new GlTexture2DArray();
    //private blur = 1;

    public constructor() {
        super('Bloom Renderer');
        this.shader = new BloomShader();
        this.gaussianBlurShader = new GaussianBlurShader();
        this.createFbo();
    }

    private createFbo(): void {
        if (!Utility.isUsable(this.fbo)) {
            this.fbo = new GlFbo();
            const resolution = Engine.getRenderingPipeline().getRenderingSize();
            this.texture = new GlTexture2DArray();
            this.texture.allocate(GlInternalFormat.RGBA16F, vec2.fromValues(resolution[0], resolution[1]), 1, false);
            this.texture.setMinificationFilter(GlMinificationFilter.LINEAR);
            this.texture.setMagnificationFilter(GlMagnificationFilter.LINEAR);
            this.texture.setWrapU(GlWrap.REPEAT);
            this.texture.setWrapV(GlWrap.REPEAT);
        }
    }

    protected renderUnsafe(): void {
        this.blurEmission();

        this.getShader().start();
        const emissionTexture = Engine.getRenderingPipeline().getParameters().get(RenderingPipeline.EMISSION) as GlTexture2DArray;
        this.getShader().loadTexture2DArray(emissionTexture, Conventions.TU_ONE);
        this.getShader().getNativeShaderProgram().connectTextureUnit('emission', Conventions.TU_ONE);
        Engine.getRenderingPipeline().bindFbo();

        super.renderUnsafe();
    }

    private blurEmission(): void {
        Gl.setEnableDepthTest(false);

        this.fbo.bind();
        const emissionTexture = Engine.getRenderingPipeline().getParameters().get(RenderingPipeline.EMISSION) as GlTexture2DArray;
        const resolution = Engine.getRenderingPipeline().getRenderingSize();
        //const blurOffset = this.blur / resolution[0];

        for (let i = 0; i < 5; i++) {
            this.fbo.getAttachmentContainer(GlFboAttachmentSlot.COLOR, 0).attachTexture2DArrayLayer(this.texture.getLayer(0));
            this.getShader().loadTexture2DArray(emissionTexture, Conventions.TU_ZERO);
            this.renderGaussianPass(true, 0/*, blurOffset*/);

            this.fbo.getAttachmentContainer(GlFboAttachmentSlot.COLOR, 0).attachTexture2DArrayLayer(emissionTexture.getLayer(0));
            this.getShader().loadTexture2DArray(this.texture, Conventions.TU_ZERO);
            this.renderGaussianPass(false, 0/*, blurOffset*/);
        }
        Gl.setEnableDepthTest(true);
    }

    private renderGaussianPass(horizontal: boolean, layer: number/*, blurOffset: number*/): void {
        this.gaussianBlurShader.start();
        this.gaussianBlurShader.setHorizontal(horizontal);
        this.gaussianBlurShader.setLayer(layer);
        //this.gaussianBlurShader.setBlurOffset(blurOffset);
        this.gaussianBlurShader.setUniforms();
        const quad = QuadMesh.getInstance();
        quad.draw();
        this.incrementRenderedElementCountBy(1);
        this.incrementRenderedFaceCountBy(quad.getFaceCount());
    }

    public release(): void {
        this.releaseFbo();
        this.releaseShader();
    }

    private releaseFbo(): void {
        if (Utility.isUsable(this.texture)) {
            this.fbo.getAttachmentContainer(GlFboAttachmentSlot.COLOR, 0).detachAttachment();
            this.texture.release();
        }
        if (Utility.isUsable(this.fbo)) {
            this.fbo.release();
            this.fbo = null;
        }
    }

    private releaseShader(): void {
        if (Utility.isUsable(this.shader)) {
            this.shader.release();
            this.shader = null;
        }
    }

    public getShader(): BloomShader {
        return this.shader;
    }

}