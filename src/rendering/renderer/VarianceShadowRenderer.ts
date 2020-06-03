import { Renderer } from '../Renderer';
import { Fbo } from '../../webgl/fbo/Fbo';
import { FboAttachmentSlot } from '../../webgl/enum/FboAttachmentSlot';
import { Gl } from '../../webgl/Gl';
import { CullFace } from '../../webgl/enum/CullFace';
import { InternalFormat } from '../../webgl/enum/InternalFormat';
import { Utility } from '../../utility/Utility';
import { Engine } from '../../core/Engine';
import { RenderingPipeline } from '../RenderingPipeline';
import { IRenderableComponent } from '../../component/renderable/IRenderableComponent';
import { IRenderable } from '../../resource/IRenderable';
import { ICameraComponent } from '../../component/camera/ICameraComponent';
import { Rbo } from '../../webgl/fbo/Rbo';
import { VarianceShadowShader } from '../../resource/shader/VarianceShadowShader';
import { GaussianBlurShader } from '../../resource/shader/GaussianBlurShader';
import { QuadMesh } from '../../resource/mesh/QuadMesh';
import { mat4, vec2, vec4, vec3, quat } from 'gl-matrix';
import { GlTexture2DArray } from '../../webgl/texture/GlTexture2DArray';
import { TextureWrap } from '../../webgl/enum/TextureWrap';
import { FrustumCornerPointResolver } from '../../component/camera/frustum/FrustumCornerPoint';
import { BlinnPhongLightsStruct } from '../../component/light/blinnphong/BlinnPhongLightsStruct';
import { CameraType } from '../../component/camera/CameraType';
import { MinificationFilter } from '../../webgl/enum/MinificationFilter';
import { MagnificationFilter } from '../../webgl/enum/MagnificationFIlter';

export class VarianceShadowRenderer extends Renderer {

    private readonly projectionViewMatrices = new Array<mat4>();
    private shader: VarianceShadowShader;
    private gaussianBlurShader: GaussianBlurShader;
    private fbo: Fbo;
    private fboTextures = new Array<GlTexture2DArray>();
    private readonly resolution = 1024;
    private readonly splitCount = 3;//if you change, also change in the shaders
    private blur = 1.5;
    private readonly wsSplitDistances = new Array<number>();
    private camera: ICameraComponent;
    private initialized = false;

    public constructor() {
        super('Variance Shadow Renderer');
        this.shader = new VarianceShadowShader();
        this.gaussianBlurShader = new GaussianBlurShader();
        this.fboTextures = new Array<GlTexture2DArray>();
        this.createFbo();
        for (let i = 0; i < this.splitCount; i++) {
            this.projectionViewMatrices.push(mat4.create());
        }
    }

    private refreshDistances(): void {
        if (!this.initialized) {
            const lambda = 0.15;
            const n = this.camera.getNearPlaneDistance();
            const f = this.camera.getFarPlaneDistance();

            for (let i = 0; i < this.splitCount + 1; i++) {
                const cilog = n * Math.pow(f / n, i / this.splitCount);
                const ciuni = n + (f - n) * (i / this.splitCount)
                this.wsSplitDistances[i] = lambda * ciuni + (1 - lambda) * cilog;
            }
            this.initialized = true;
        }
    }

    private createFbo(): void {
        if (!Utility.isUsable(this.fbo)) {
            this.fbo = new Fbo();

            const tex1 = new GlTexture2DArray();
            tex1.allocate(InternalFormat.RGBA32F, vec2.fromValues(this.resolution, this.resolution), this.splitCount, false);
            tex1.setMinificationFilter(MinificationFilter.LINEAR);
            tex1.setMagnificationFilter(MagnificationFilter.LINEAR);
            tex1.setWrapU(TextureWrap.REPEAT);
            tex1.setWrapV(TextureWrap.REPEAT);
            this.fbo.getAttachmentContainer(FboAttachmentSlot.COLOR, 0).attachTexture2DArrayLayer(tex1.getLayer(0));
            this.fboTextures.push(tex1);
            Engine.getRenderingPipeline().getParameters().set(RenderingPipeline.SHADOWMAP, tex1);

            const tex2 = new GlTexture2DArray();
            tex2.allocate(InternalFormat.RGBA32F, vec2.fromValues(this.resolution, this.resolution), this.splitCount, false);
            tex2.setMinificationFilter(MinificationFilter.LINEAR);
            tex2.setMagnificationFilter(MagnificationFilter.LINEAR);
            tex2.setWrapU(TextureWrap.REPEAT);
            tex2.setWrapV(TextureWrap.REPEAT);
            this.fboTextures.push(tex2);

            const rbo = new Rbo();
            rbo.allocate(vec2.fromValues(this.resolution, this.resolution), InternalFormat.DEPTH32F, 1);
            this.fbo.getAttachmentContainer(FboAttachmentSlot.DEPTH).attachRbo(rbo);

            if (!this.fbo.isDrawComplete()) {
                throw new Error();
            }
        }
    }

    private refreshProjectionViewMatrices(): void {
        const light = BlinnPhongLightsStruct.getInstance().getShadowLightSource();//TODO
        const IV = this.computeInverseViewMatrix();
        const inverseRotation = quat.invert(quat.create(), light.getGameObject().getTransform().getAbsoluteRotation());
        const view = mat4.fromRotationTranslation(mat4.create(), inverseRotation, vec3.create());
        for (let i = 0; i < this.splitCount; i++) {
            let P: mat4;
            if (this.camera.getType() === CameraType.PERSPECTIVE) {
                P = Utility.computePerspectiveProjectionMatrix(
                    this.camera.getFov(),
                    this.camera.getAspectRatio(),
                    this.wsSplitDistances[i],
                    this.wsSplitDistances[i + 1]);
            } else {
                P = Utility.computeOrthographicProjectionMatrix(
                    -this.camera.getHorizontalScale(),
                    this.camera.getHorizontalScale(),
                    -this.camera.getVerticalalScale(),
                    this.camera.getVerticalalScale(),
                    this.wsSplitDistances[i],
                    this.wsSplitDistances[i + 1])
            }
            const IP = mat4.invert(mat4.create(), P);
            const cornerPoints = new Array<vec4>();
            for (let i = 0; i < 8; i++) {
                const cp = FrustumCornerPointResolver.get(i);
                const ndcPosition = FrustumCornerPointResolver.getNdcPosition(cp);
                cornerPoints.push(Utility.computeoWorldSpacePosition(ndcPosition, IP, IV));
            }

            const max = vec3.fromValues(Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY);
            const min = vec3.fromValues(Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY);
            for (const cp of cornerPoints) {
                const csp = vec4.transformMat4(vec4.create(), cp, view);
                for (let i = 0; i < 3; i++) {
                    min[i] = Math.min(min[i], csp[i]);
                    max[i] = Math.max(max[i], csp[i]);
                }
            }
            const projection = mat4.ortho(mat4.create(), min[0], max[0], min[1], max[1], -max[2], -min[2]);
            mat4.mul(this.projectionViewMatrices[i], projection, view);
            let mats = Engine.getRenderingPipeline().getParameters().get(RenderingPipeline.SHADOW_PROJECTION_VIEW_MATRICES);
            if (!mats) {
                mats = new Array<mat4>(this.splitCount);
                Engine.getRenderingPipeline().getParameters().set(RenderingPipeline.SHADOW_PROJECTION_VIEW_MATRICES, mats);
            }
            mats[i] = this.projectionViewMatrices[i];
        }
        for (let i = 0; i < this.splitCount + 1; i++) {
            let splits = Engine.getRenderingPipeline().getParameters().get(RenderingPipeline.SHADOW_SPLITS);
            if (!splits) {
                splits = new Array<number>(this.splitCount + 1);
                Engine.getRenderingPipeline().getParameters().set(RenderingPipeline.SHADOW_SPLITS, splits);
            }
            splits[i] = this.wsSplitDistances[i];
        }
    }

    private computeInverseViewMatrix(): mat4 {
        const transform = this.camera.getGameObject().getTransform();
        const position = transform.getAbsolutePosition();
        const rotation = transform.getAbsoluteRotation();
        return Utility.computeInverseViewMatrix(position, rotation);
    }

    private index: number;

    protected renderUnsafe(): void {
        for (let i = 0; i < this.splitCount; i++) {
            this.index = i;
            this.fbo.getAttachmentContainer(FboAttachmentSlot.COLOR, 0).attachTexture2DArrayLayer(this.fboTextures[0].getLayer(i));
            Gl.setViewport(this.fbo.getAttachmentContainer(FboAttachmentSlot.COLOR, 0).getAttachment().getSize(), vec2.create());
            Gl.setClearColor(vec4.fromValues(1, 1, 1, 1));
            Gl.clear(true, true, false);
            const renderables = Engine.getRenderingPipeline().getRenderableContainer();
            for (const renderableComponent of renderables.getIterator()) {
                this.renderRenderableComponent(renderableComponent);
            }
        }
    }

    protected renderRenderableComponent(renderableComponent: IRenderableComponent<IRenderable>): void {
        if (this.drawPredicate(renderableComponent)) {
            this.beforeDraw(renderableComponent);
            this.draw(renderableComponent);
        }
    }

    protected beforeDraw(renderableComponent: IRenderableComponent<IRenderable>): void {
        this.incrementRenderedElementCountBy(1);
        this.incrementRenderedFaceCountBy(renderableComponent.getFaceCount());
        this.getShader().setShadowUniforms(renderableComponent, this.projectionViewMatrices[this.index]);
    }

    protected draw(renderableComponent: IRenderableComponent<IRenderable>): void {
        renderableComponent.draw();
    }

    protected drawPredicate(renderableComponent: IRenderableComponent<IRenderable>): boolean {
        return Utility.isUsable(renderableComponent.getRenderable()) &&
            renderableComponent.isActive() &&
            this.isVisible(renderableComponent, this.camera) &&
            renderableComponent.isCastShadow();
    }

    protected isVisible(renderableComponent: IRenderableComponent<IRenderable>, camera: ICameraComponent): boolean {
        const visibility = renderableComponent.getVisibilityInterval();
        if (visibility[0] === Number.NEGATIVE_INFINITY && visibility[1] === Number.POSITIVE_INFINITY) {
            return true;
        }
        const renderablePosition = renderableComponent.getGameObject().getTransform().getAbsolutePosition();
        const cameraPosition = camera.getGameObject().getTransform().getAbsolutePosition();
        const renderableDistanceFromCamera = vec3.distance(cameraPosition, renderablePosition);
        const positionInPercent = (renderableDistanceFromCamera - camera.getNearPlaneDistance()) / (camera.getFarPlaneDistance() - camera.getNearPlaneDistance()) * 100;
        return positionInPercent >= visibility[0] && positionInPercent < visibility[1];
    }

    protected beforeRendering(): void {
        super.beforeRendering();
        this.camera = Engine.getMainCamera();
        this.refreshDistances();
        this.refreshProjectionViewMatrices();
        //Gl.setCullFace(CullFace.FRONT);
        //Gl.setCullFace(CullFace.BACK);
        this.fbo.bind();
    }

    protected afterRendering(): void {
        Gl.setCullFace(CullFace.BACK);
        this.blurShadowMap();
        Gl.setViewport(Engine.getRenderingPipeline().getRenderingSize(), vec2.create());
    }

    private blurShadowMap(): void {
        Gl.setEnableDepthTest(false);
        for (let i = 0; i < this.splitCount; i++) {
            //const blurOffset = (this.blur * 25) / ((this.wsSplitDistances[i + 1] - this.wsSplitDistances[i]) * this.resolution);
            const blurOffset = this.blur / this.resolution;
            this.fbo.getAttachmentContainer(FboAttachmentSlot.COLOR, 0).attachTexture2DArrayLayer(this.fboTextures[1].getLayer(i));
            this.fboTextures[0].bindToTextureUnit(0);
            this.renderGaussianPass(true, i, blurOffset);

            this.fbo.getAttachmentContainer(FboAttachmentSlot.COLOR, 0).attachTexture2DArrayLayer(this.fboTextures[0].getLayer(i));
            this.fboTextures[1].bindToTextureUnit(0);
            this.renderGaussianPass(false, i, blurOffset);
        }

        Gl.setEnableDepthTest(true);
    }

    private renderGaussianPass(horizontal: boolean, layer: number, blurOffset: number): void {
        this.gaussianBlurShader.start();
        this.gaussianBlurShader.setHorizontal(horizontal);
        this.gaussianBlurShader.setLayer(layer);
        this.gaussianBlurShader.setBlurOffset(blurOffset);
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
        if (Utility.isUsable(this.fbo)) {
            const tex1 = this.fbo.getAttachmentContainer(FboAttachmentSlot.COLOR, 0).getTextureAttachment();
            if (Utility.isUsable(tex1)) {
                tex1.release();
            }
            const tex2 = this.fbo.getAttachmentContainer(FboAttachmentSlot.COLOR, 1).getTextureAttachment();
            if (Utility.isUsable(tex2)) {
                tex2.release();
            }
            const rbo = this.fbo.getAttachmentContainer(FboAttachmentSlot.DEPTH).getRboAttachment();
            if (rbo) {
                rbo.release();
            }
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

    public getShader(): VarianceShadowShader {
        return this.shader;
    }

    protected removedFromThePipeline(): void {
        const renderingPipeline = Engine.getRenderingPipeline();
        const shadowMap = renderingPipeline.getParameters().get(RenderingPipeline.SHADOWMAP);
        if (shadowMap) {
            if (Utility.isUsable(shadowMap)) {
                shadowMap.release();
            }
            Engine.getRenderingPipeline().getParameters().set(RenderingPipeline.SHADOWMAP, null);
        }
    }

}