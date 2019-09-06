import { Renderer } from '../Renderer';
import { mat4, vec2 } from 'gl-matrix';
import { ShadowShader } from '../../resource/shader/ShadowShader';
import { Fbo } from '../../webgl/fbo/Fbo';
import { RenderingPipeline } from '../RenderingPipeline';
import { FboAttachmentSlot } from '../../webgl/enum/FboAttachmentSlot';
import { Gl } from '../../webgl/Gl';
import { CullFace } from '../../webgl/enum/CullFace';
import { GlTexture2D } from '../../webgl/texture/GlTexture2D';
import { InternalFormat } from '../../webgl/enum/InternalFormat';
import { Utility } from '../../utility/Utility';

export class ShadowRenderer extends Renderer {

    private readonly projectionViewMatrix = mat4.create();
    private shader: ShadowShader;
    private fbo: Fbo;
    private resolution = 2048;
    private distance = 400;
    private nearDistance = 0.1;
    private farDistance = 10000;

    public constructor() {
        super('Shadow Renderer');
        this.shader = new ShadowShader();
    }

    public getResolution(): number {
        return this.resolution;
    }

    public setResolution(resolution: number): void {
        if (resolution <= 0) {
            throw new Error();
        }
        this.resolution = resolution;
    }

    public getShadowCameraDistance(): number {
        return this.distance;
    }

    public setShadowCameraDistance(shadowCameraDistance: number): void {
        if (shadowCameraDistance <= 0) {
            throw new Error();
        }
        this.distance = shadowCameraDistance;
    }

    public getShadowCameraNearDistance(): number {
        return this.nearDistance;
    }

    public setShadowCameraNearDistance(shadowCameraNearDistance: number): void {
        if (shadowCameraNearDistance <= 0) {
            throw new Error();
        }
        if (shadowCameraNearDistance > this.farDistance) {
            throw new Error();
        }
        this.nearDistance = shadowCameraNearDistance;
    }

    public getShadowCameraFarDistance(): number {
        return this.farDistance;
    }

    public setShadowCameraFarDistance(shadowCameraFarDistance: number): void {
        if (this.nearDistance > shadowCameraFarDistance) {
            throw new Error();
        }
        this.farDistance = shadowCameraFarDistance;
    }

    private refresh(): void {
        if (this.isActive()) {
            //this.projectionViewMatrix.set(Utility.computeShadowMapProjectionViewMatrix(Scene.getParameters()
            //.getValue(BlinnPhongRenderer.MAIN_DIRECTIONAL_LIGHT)
            //.getGameObject(), this.getShadowCameraDistance(), this.getShadowCameraNearDistance(), this.getShadowCameraFarDistance()));
            //RenderingPipeline.getParameters()
            //.set(RenderingPipeline.SHADOW_PROJECTION_VIEW_MATRIX, new Parameter<mat4>(mat4.from(this.projectionViewMatrix)));
            if (!Utility.isUsable(this.fbo) || this.getResolution() != this.fbo.getAttachmentContainer(FboAttachmentSlot.DEPTH).getAttachment().getSize()[0]) {
                this.releaseFbo();
                this.generateFbo();
            }
        } else {
            this.setNumberOfRenderedElements(0);
            this.setNumberOfRenderedFaces(0);
            this.releaseFbo();
        }

    }

    protected renderUnsafe(): void {
        this.refresh();

        this.beforeShader();
        this.shader.start();

        const renderables = RenderingPipeline.getRenderableContainer();
        for (const renderableComponent of renderables.getIterator()) {
            if (renderableComponent.isActive() && renderableComponent
                .isCastShadow()) {
                //beforeDrawMeshInstance(projectionViewMatrix, renderableComponent.getModelMatrix());
                renderableComponent.draw();
                this.setNumberOfRenderedElements(this.getNumberOfRenderedElements() + 1);
                this.setNumberOfRenderedFaces(this.getNumberOfRenderedFaces() + renderableComponent.getFaceCount());
            }
        }
        this.afterShader();
        RenderingPipeline.getParameters().set(RenderingPipeline.SHADOWMAP, this.fbo.getAttachmentContainer(FboAttachmentSlot.DEPTH).getTextureAttachment());
    }

    private beforeShader(): void {
        if (!Utility.isUsable(this.shader)) {
            this.shader = new ShadowShader();
        }
        //OpenGl.setViewport(this.fbo.getAttachmentContainer(FboAttachmentSlot.DEPTH, -1).getAttachment().getSize(), vec2.create());
        Gl.setCullFace(CullFace.FRONT);
        this.fbo.bind();
        //OpenGl.clear(false, true, false);
        this.setNumberOfRenderedElements(0);
        this.setNumberOfRenderedFaces(0);
    }

    private afterShader(): void {
        //OpenGl.setViewport(RenderingPipeline.getRenderingSize(), vec2.create());
        Gl.setCullFace(CullFace.BACK);
    }

    private beforeDrawMeshInstance(projectionViewMatrix: mat4, modelMatrix: mat4): void {
        const projectionViewModelMatrix = mat4.create();
        mat4.mul(projectionViewMatrix, modelMatrix, projectionViewModelMatrix);
        this.shader.loadProjectionViewModelMatrix(projectionViewModelMatrix);
    }

    private generateFbo(): void {
        if (!Utility.isUsable(this.fbo)) {
            this.fbo = new Fbo();
            //fbo.bind();
            const depthTexture = new GlTexture2D();
            depthTexture.allocate(InternalFormat.DEPTH16, vec2.fromValues(this.getResolution(), this.getResolution()), false);
            this.fbo.getAttachmentContainer(FboAttachmentSlot.DEPTH).attachTexture2D(depthTexture);
            //fbo.setActiveDraw(false, 0);
            //fbo.setReadBuffer(false, 0);
            this.fbo.setDrawBuffers();
            this.fbo.setReadBuffer(-1);
            if (!this.fbo.isDrawComplete()) {
                throw new Error();
            }
            //fbo.unbind();
        }
    }

    private releaseFbo(): void {
        if (this.fbo) {
            this.fbo.release();
            this.fbo = null;
        }
    }

    public release(): void {
        this.releaseFbo();
        this.shader.release();
    }

    public isUsable(): boolean {
        return true;
    }

    public setActive(active: boolean): void {
        if (this.isActive() != active) {
            super.setActive(active);
            this.refresh();
        }
    }

    public removeFromRenderingPipeline(): void {
        const shadowMap = RenderingPipeline.getParameters().get(RenderingPipeline.SHADOWMAP);
        if (shadowMap) {
            if (shadowMap.isUsable()) {
                shadowMap.release();
            }
            RenderingPipeline.getParameters().set(RenderingPipeline.SHADOWMAP, null);
        }
    }

}