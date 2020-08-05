import { Renderer } from '../Renderer';
import { GlFbo } from '../../webgl/fbo/GlFbo';
import { GlFboAttachmentSlot } from '../../webgl/enum/GlFboAttachmentSlot';
import { Gl } from '../../webgl/Gl';
import { GlCullFace } from '../../webgl/enum/GlCullFace';
import { GlInternalFormat } from '../../webgl/enum/GlInternalFormat';
import { Utility } from '../../utility/Utility';
import { Engine } from '../../core/Engine';
import { RenderingPipeline } from '../RenderingPipeline';
import { IRenderableComponent } from '../../component/renderable/IRenderableComponent';
import { IRenderable } from '../../resource/IRenderable';
import { ICameraComponent } from '../../component/camera/ICameraComponent';
import { GlRbo } from '../../webgl/fbo/GlRbo';
import { VarianceShadowShader } from '../../resource/shader/VarianceShadowShader';
import { GaussianBlurShader } from '../../resource/shader/GaussianBlurShader';
import { QuadMesh } from '../../resource/mesh/QuadMesh';
import { mat4, vec2, vec4, vec3, quat } from 'gl-matrix';
import { GlTexture2DArray } from '../../webgl/texture/GlTexture2DArray';
import { GlWrap } from '../../webgl/enum/GlWrap';
import { FrustumCornerPointResolver } from '../../component/camera/frustum/FrustumCornerPoint';
import { BlinnPhongLightsStruct } from '../../component/light/blinnphong/BlinnPhongLightsStruct';
import { CameraType } from '../../component/camera/CameraType';
import { GlMinificationFilter } from '../../webgl/enum/GlMinificationFilter';
import { GlMagnificationFilter } from '../../webgl/enum/GlMagnificationFIlter';
import { Conventions } from '../../resource/Conventions';
import { GlConstants } from '../../webgl/GlConstants';
import { AlphaMode } from '../../material/AlphaMode';

export class VarianceShadowRenderer extends Renderer {

    private readonly projectionViewMatrices = new Array<mat4>();
    private shader: VarianceShadowShader;
    private gaussianBlurShader: GaussianBlurShader;
    private fbo: GlFbo;
    private fboTextures = new Array<GlTexture2DArray>();
    private readonly resolution = 1024;
    private readonly splitCount = 3;//if you change, also change in the shaders
    //private blur = 1.5;//TODO
    private lightDistance = 50;
    private readonly csSplitDistances = new Array<number>();
    private camera: ICameraComponent;
    private initialized = false;

    public constructor() {
        super('Variance Shadow Renderer');
        if (!GlConstants.COLOR_BUFFER_FLOAT_ENABLED) {
            throw new Error();
        }
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
            const lambda = 0.5;
            const n = this.camera.getNearPlaneDistance();
            const f = this.camera.getFarPlaneDistance();

            for (let i = 0; i < this.splitCount + 1; i++) {
                const cilog = n * Math.pow(f / n, i / this.splitCount);
                const ciuni = n + (f - n) * (i / this.splitCount)
                this.csSplitDistances[i] = lambda * ciuni + (1 - lambda) * cilog;
            }
            this.initialized = true;
        }
    }

    private createFbo(): void {
        if (!Utility.isUsable(this.fbo)) {
            this.fbo = new GlFbo();

            const tex1 = new GlTexture2DArray();
            //TODO
            //miért rgba? nem rg-nek kéne lennie?
            //rémlik, hogy volt ezzel valami gond, kifagyott az egész
            //érdemes lenne ránézni
            tex1.allocate(GlInternalFormat.RGBA32F, vec2.fromValues(this.resolution, this.resolution), this.splitCount, false);
            tex1.setMinificationFilter(GlMinificationFilter.LINEAR);
            tex1.setMagnificationFilter(GlMagnificationFilter.LINEAR);
            tex1.setWrapU(GlWrap.REPEAT);
            tex1.setWrapV(GlWrap.REPEAT);
            this.fbo.getAttachmentContainer(GlFboAttachmentSlot.COLOR, 0).attachTexture2DArrayLayer(tex1.getLayer(0));
            this.fboTextures.push(tex1);
            Engine.getRenderingPipeline().getParameters().set(RenderingPipeline.SHADOWMAP, tex1);

            const tex2 = new GlTexture2DArray();
            tex2.allocate(GlInternalFormat.RGBA32F, vec2.fromValues(this.resolution, this.resolution), this.splitCount, false);
            tex2.setMinificationFilter(GlMinificationFilter.LINEAR);
            tex2.setMagnificationFilter(GlMagnificationFilter.LINEAR);
            tex2.setWrapU(GlWrap.REPEAT);
            tex2.setWrapV(GlWrap.REPEAT);
            this.fboTextures.push(tex2);

            const rbo = new GlRbo();
            rbo.allocate(vec2.fromValues(this.resolution, this.resolution), GlInternalFormat.DEPTH32F, 1);
            this.fbo.getAttachmentContainer(GlFboAttachmentSlot.DEPTH).attachRbo(rbo);

            if (!this.fbo.isDrawComplete()) {
                throw new Error();
            }
        }
    }

    private refreshProjectionViewMatrices(): void {
        const IV = this.computeInverseViewMatrix();
        for (let i = 0; i < this.splitCount; i++) {
            let P: mat4;
            if (this.camera.getType() === CameraType.PERSPECTIVE) {
                P = Utility.computePerspectiveProjectionMatrix(
                    this.camera.getFov(),
                    this.camera.getAspectRatio(),
                    this.csSplitDistances[i],
                    this.csSplitDistances[i + 1]);
            } else {
                P = Utility.computeOrthographicProjectionMatrix(
                    -this.camera.getHorizontalScale(),
                    this.camera.getHorizontalScale(),
                    -this.camera.getVerticalalScale(),
                    this.camera.getVerticalalScale(),
                    this.csSplitDistances[i],
                    this.csSplitDistances[i + 1]);
            }
            const IP = mat4.invert(mat4.create(), P);
            const cornerPoints = new Array<vec4>();
            for (let i = 0; i < 8; i++) {
                const cp = FrustumCornerPointResolver.get(i);
                const ndcPosition = FrustumCornerPointResolver.getNdcPosition(cp);
                cornerPoints.push(Utility.computeoWorldSpacePosition(ndcPosition, IP, IV));
            }

            const lightV = this.computeLightViewMatrix();
            const max = vec3.fromValues(Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY);
            const min = vec3.fromValues(Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY);
            for (const cp of cornerPoints) {
                const csp = vec4.transformMat4(vec4.create(), cp, lightV);
                for (let i = 0; i < 3; i++) {
                    min[i] = Math.min(min[i], csp[i]);
                    max[i] = Math.max(max[i], csp[i]);
                }
            }
            const projection = mat4.ortho(mat4.create(), min[0], max[0], min[1], max[1], -max[2] - this.lightDistance, -min[2]);
            mat4.mul(this.projectionViewMatrices[i], projection, lightV);
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
            const P = this.camera.getProjectionMatrix();
            const res = vec4.fromValues(0, 0, -this.csSplitDistances[i], 1);
            vec4.transformMat4(res, res, P);
            splits[i] = res[2] / res[3] * 0.5 + 0.5;
        }
    }

    private computeLightViewMatrix(): mat4 {
        const light = BlinnPhongLightsStruct.getInstance().getShadowLightSource();//TODO
        const inverseRotation = quat.invert(quat.create(), light.getGameObject().getTransform().getAbsoluteRotation());
        return mat4.fromRotationTranslation(mat4.create(), inverseRotation, vec3.create());
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
            this.fbo.getAttachmentContainer(GlFboAttachmentSlot.COLOR, 0).attachTexture2DArrayLayer(this.fboTextures[0].getLayer(i));
            Gl.setViewport(this.fbo.getAttachmentContainer(GlFboAttachmentSlot.COLOR, 0).getAttachment().getSize(), vec2.create());
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
        const alphaMode = renderableComponent.getMaterial().getParameters().get(Conventions.MP_ALPHA_MODE);
        this.setAlphaMode(renderableComponent, alphaMode);
    }

    protected setAlphaMode(renderableComponent: IRenderableComponent<IRenderable>, alphaMode: AlphaMode): void {
        this.getShader().getNativeShaderProgram().loadInt('alphaMode', alphaMode);
        if (alphaMode === AlphaMode.MASK) {
            const alphaCutoff = renderableComponent.getMaterial().getParameters().get(Conventions.MP_ALPHA_CUTOFF) ?? 0.5;
            this.getShader().getNativeShaderProgram().loadFloat('alphaCutoff', alphaCutoff);
        }
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
        //Gl.setCullFace(GlCullFace.FRONT);
        //Gl.setCullFace(GlCullFace.BACK);
        this.fbo.bind();
    }

    protected afterRendering(): void {
        Gl.setCullFace(GlCullFace.BACK);
        this.blurShadowMap();
        Gl.setViewport(Engine.getRenderingPipeline().getRenderingSize(), vec2.create());
    }

    private blurShadowMap(): void {
        Gl.setEnableDepthTest(false);
        for (let i = 0; i < this.splitCount; i++) {
            //const blurOffset = (this.blur * 25) / ((this.wsSplitDistances[i + 1] - this.wsSplitDistances[i]) * this.resolution);
            //const blurOffset = this.blur / this.resolution;
            this.fbo.getAttachmentContainer(GlFboAttachmentSlot.COLOR, 0).attachTexture2DArrayLayer(this.fboTextures[1].getLayer(i));
            this.getShader().loadTexture2DArray(this.fboTextures[0], Conventions.TU_ZERO);
            this.renderGaussianPass(true, i/*, blurOffset*/);

            this.fbo.getAttachmentContainer(GlFboAttachmentSlot.COLOR, 0).attachTexture2DArrayLayer(this.fboTextures[0].getLayer(i));
            this.getShader().loadTexture2DArray(this.fboTextures[1], Conventions.TU_ZERO);
            this.renderGaussianPass(false, i, /*blurOffset*/);
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
        if (Utility.isUsable(this.fbo)) {
            const tex1 = this.fbo.getAttachmentContainer(GlFboAttachmentSlot.COLOR, 0).getTextureAttachment();
            if (Utility.isUsable(tex1)) {
                tex1.release();
            }
            const tex2 = this.fbo.getAttachmentContainer(GlFboAttachmentSlot.COLOR, 1).getTextureAttachment();
            if (Utility.isUsable(tex2)) {
                tex2.release();
            }
            const rbo = this.fbo.getAttachmentContainer(GlFboAttachmentSlot.DEPTH).getRboAttachment();
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