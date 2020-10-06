import { RenderableContainer } from '../core/RenderableContainer';
import { Gl } from '../webgl/Gl';
import { ParameterContainer } from '../utility/parameter/ParameterContainer';
import { ParameterKey } from '../utility/parameter/ParameterKey';
import { ITexture2D } from '../resource/texture/ITexture2D';
import { GlTexture2D } from '../webgl/texture/GlTexture2D';
import { GlFbo } from '../webgl/fbo/GlFbo';
import { GlFboAttachmentSlot } from '../webgl/enum/GlFboAttachmentSlot';
import { vec2, mat4, ReadonlyVec2, quat, vec3, vec4, } from 'gl-matrix';
import { SkyboxRenderer } from './renderer/SkyboxRenderer';
import { BlinnPhongRenderer } from './renderer/BlinnPhongRenderer';
import { ScreenRenderer } from './renderer/ScreenRenderer';
import { LogLevel } from '../utility/log/LogLevel';
import { CameraStruct } from '../component/camera/CameraStruct';
import { Engine } from '../core/Engine';
import { Utility } from '../utility/Utility';
import { GlInternalFormat } from '../webgl/enum/GlInternalFormat';
import { GlRbo } from '../webgl/fbo/GlRbo';
import { RendererContainer } from './RendererContainer';
import { GeometryRenderer } from './GeometryRenderer';
import { PostProcessRenderer } from './PostProcessRenderer';
import { Renderer } from './Renderer';
import { GammaCorrectionRenderer } from './renderer/GammaCorrectionRenderer';
import { ReinhardToneMappingRenderer } from './renderer/ReinhardToneMappingRenderer';
import { PbrRenderer } from './renderer/PbrRenderer';
import { CubeMapTexture } from '../resource/texture/CubeMapTexture';
import { GlWrap } from '../webgl/enum/GlWrap';
import { VarianceShadowRenderer } from './renderer/VarianceShadowRenderer';
import { ITexture2DArray } from '../resource/texture/ITexture2DArray';
import { DebugRenderer } from './renderer/DebugRenderer';
import { IRenderingPipeline } from './IRenderingPipeline';
import { IRenderableContainer } from '../core/IRenderableContainer';
import { GlMinificationFilter } from '../webgl/enum/GlMinificationFilter';
import { GlMagnificationFilter } from '../webgl/enum/GlMagnificationFIlter';
import { GlConstants } from '../webgl/GlConstants';
import { AtmosphericScatteringRenderer } from './renderer/AtmosphericScatteringRenderer';
import { GodrayRenderer } from './renderer/GodrayRenderer';
import { AcesToneMappingRenderer } from './renderer/AcesToneMappingRenderer';
import { GlTexture2DArray } from '../webgl/texture/GlTexture2DArray';
import { BloomRenderer } from './renderer/BloomRenderer';
import { DualDepthPeeling } from './DualDepthPeeling';

export class RenderingPipeline implements IRenderingPipeline {

    public static readonly SHADOWMAP = new ParameterKey<ITexture2DArray>('SHADOWMAP');
    public static readonly SHADOW_PROJECTION_VIEW_MATRICES = new ParameterKey<Array<mat4>>('SHADOW_PROJECTION_VIEW_MATRICES');
    public static readonly SHADOW_SPLITS = new ParameterKey<Array<number>>('SHADOW_SPLITS');
    public static readonly PBR_DIFFUSE_IBL_MAP = new ParameterKey<CubeMapTexture>('PBR_DIFFUSE_IBL_MAP');
    public static readonly PBR_SPECULAR_IBL_MAP = new ParameterKey<CubeMapTexture>('PBR_SPECULAR_IBL_MAP');
    public static readonly WORK = new ParameterKey<ITexture2D>('WORK');
    public static readonly DEBUG = new ParameterKey<ITexture2DArray>('DEBUG');
    public static readonly DEBUG_2 = new ParameterKey<ITexture2D>('DEBUG_2');
    public static readonly DEPTH = new ParameterKey<ITexture2D>('DEPTH');
    public static readonly DUAL_DEPTH = new ParameterKey<ITexture2D>('DUAL_DEPTH');
    public static readonly FRONT = new ParameterKey<ITexture2D>('FRONT');
    public static readonly GODRAY_OCCLUSION = new ParameterKey<ITexture2D>('GODRAY_OCCLUSION');
    public static readonly EMISSION = new ParameterKey<ITexture2DArray>('EMISSION');
    public static readonly DUAL_DEPTH_FBO = new ParameterKey<GlFbo>('DUAL_DEPTH_FBO');
    public static readonly DUAL_DEPTH_PEEL_PASS_COUNT = new ParameterKey<number>('DUAL_DEPTH_PEEL_PASS_COUNT');
    public static readonly PBR_USE_IBL = new ParameterKey<boolean>('PBR_USE_IBL');

    private parameters = new ParameterContainer();
    private geometryFbo: GlFbo;
    private postProcessFbo: GlFbo;
    private fboTextures = new Array<GlTexture2D>(2);
    private sampleCount = 2;
    private drawIndex = 0;
    private renderingScale = 1;
    private renderables = new RenderableContainer();
    private shadowRenderer: VarianceShadowRenderer;
    private geometryRenderers = new RendererContainer<GeometryRenderer>();
    private postProcessRenderers = new RendererContainer<PostProcessRenderer>();
    private debugRenderer = new DebugRenderer();
    private dualDepthPeeling: DualDepthPeeling;
    private screenRenderer: ScreenRenderer;

    public initialize(): void {
        if (!GlConstants.COLOR_BUFFER_FLOAT_ENABLED) {
            throw new Error();
        }
        this.shadowRenderer = new VarianceShadowRenderer();
        //this.geometryRenderers.addToTheEnd(new SkyboxRenderer());
        //this.geometryRenderers.addToTheEnd(new BlinnPhongRenderer());
        this.geometryRenderers.addToTheEnd(new PbrRenderer());
        this.getParameters().set(RenderingPipeline.PBR_USE_IBL, true);
        this.geometryRenderers.addToTheEnd(new AtmosphericScatteringRenderer());
        this.postProcessRenderers.addToTheEnd(new BloomRenderer());
        this.postProcessRenderers.addToTheEnd(new GodrayRenderer());
        this.postProcessRenderers.addToTheEnd(new ReinhardToneMappingRenderer());
        //this.postProcessRenderers.addToTheEnd(new AcesToneMappingRenderer());
        this.postProcessRenderers.addToTheEnd(new GammaCorrectionRenderer());
        this.dualDepthPeeling = new DualDepthPeeling();
        this.screenRenderer = new ScreenRenderer();
        this.refresh();
        Engine.getLog().logString(LogLevel.INFO_1, 'Rendering Pipeline initialized');
    }

    public getGeometryRendererContainer(): RendererContainer<GeometryRenderer> {
        return this.geometryRenderers;
    }

    public getPostProcessRendererContainer(): RendererContainer<PostProcessRenderer> {
        return this.postProcessRenderers;
    }

    public getRenderableContainer(): IRenderableContainer {
        return this.renderables;
    }

    public getParameters(): ParameterContainer {
        return this.parameters;
    }

    public getGeometryFbo(): GlFbo {
        return this.geometryFbo;
    }

    public getPostProcessFbo(): GlFbo {
        return this.postProcessFbo;
    }

    public getRenderingScale(): number {
        return this.renderingScale;
    }

    public setRenderingScale(renderingScale: number): void {
        if (renderingScale <= 0) {
            throw new Error();
        }
        this.renderingScale = renderingScale;
        this.refresh();
    }

    public getRenderingSize(): ReadonlyVec2 {
        const renderingSize = vec2.create();
        const canvas = Gl.getCanvas();
        renderingSize[0] = canvas.clientWidth * this.renderingScale;
        renderingSize[1] = canvas.clientHeight * this.renderingScale;
        return renderingSize;
    }

    public getRenderedFaceCount(): number {
        let count = 0;
        for (const renderer of this.geometryRenderers.getIterator()) {
            count += renderer.getRenderedFaceCount();
        }
        return count;
    }

    public getRenderedElementCount(): number {
        let count = 0;
        for (const renderer of this.geometryRenderers.getIterator()) {
            count += renderer.getRenderedElementCount();
        }
        return count;
    }

    //fbo
    public bindGeometryFbo(): void {
        this.geometryFbo.bind();
    }

    public bindPostProcessFbo(): void {
        this.postProcessFbo.bind();
    }

    private getGeometryFboSize(): ReadonlyVec2 {
        return this.geometryFbo.getAttachmentContainer(GlFboAttachmentSlot.COLOR, 0).getAttachment().getSize();
    }

    private getPostProcessFboSize(): ReadonlyVec2 {
        return this.fboTextures[0].getSize();
    }

    private areFbosValid(): boolean {
        return Utility.isUsable(this.geometryFbo) &&
            this.getRenderingSize()[0] === this.getGeometryFboSize()[0] &&
            this.getRenderingSize()[1] === this.getGeometryFboSize()[1] &&
            Utility.isUsable(this.postProcessFbo) &&
            this.getRenderingSize()[0] === this.getPostProcessFboSize()[0] &&
            this.getRenderingSize()[1] === this.getPostProcessFboSize()[1];

    }

    private createGeomteryFbo(): void {
        if (Utility.isUsable(this.geometryFbo)) {
            this.geometryFbo.releaseAll();
        }
        this.geometryFbo = new GlFbo();
    }

    private createPostProcessFbo(): void {
        if (Utility.isUsable(this.postProcessFbo)) {
            this.postProcessFbo.releaseAll();
            Utility.releaseIfUsable(this.fboTextures[0]);
            Utility.releaseIfUsable(this.fboTextures[1]);
        }
        this.postProcessFbo = new GlFbo();
    }

    private addAttachmentsToTheGeometryFbo(): void {
        const colorRbo = new GlRbo();
        colorRbo.allocate(this.getRenderingSize(), GlInternalFormat.RGBA16F, this.sampleCount);
        this.geometryFbo.getAttachmentContainer(GlFboAttachmentSlot.COLOR, 0).attachRbo(colorRbo);

        const depthRbo = new GlRbo();
        depthRbo.allocate(this.getRenderingSize(), GlInternalFormat.DEPTH32F, this.sampleCount);
        this.geometryFbo.getAttachmentContainer(GlFboAttachmentSlot.DEPTH).attachRbo(depthRbo);

        const godrayOcclusionRbo = new GlRbo();
        godrayOcclusionRbo.allocate(this.getRenderingSize(), GlInternalFormat.RGB8, this.sampleCount);
        this.geometryFbo.getAttachmentContainer(GlFboAttachmentSlot.COLOR, 1).attachRbo(godrayOcclusionRbo);

        const emissionRbo = new GlRbo();
        emissionRbo.allocate(this.getRenderingSize(), GlInternalFormat.RGBA16F, this.sampleCount);
        this.geometryFbo.getAttachmentContainer(GlFboAttachmentSlot.COLOR, 2).attachRbo(emissionRbo);
    }

    private addAttachmentsToThePostProcessFbo(): void {
        this.fboTextures[0] = this.createFboTexture();
        this.fboTextures[1] = this.createFboTexture();
        this.postProcessFbo.getAttachmentContainer(GlFboAttachmentSlot.COLOR, 0).attachTexture2D(this.fboTextures[0]);
        this.createGodrayOcclusionTexture();
        this.createEmissionTexture();
    }

    private createFboTexture(): GlTexture2D {
        const colorTexture = new GlTexture2D();
        colorTexture.allocate(GlInternalFormat.RGBA16F, this.getRenderingSize(), false);
        colorTexture.setMinificationFilter(GlMinificationFilter.LINEAR);
        colorTexture.setMagnificationFilter(GlMagnificationFilter.LINEAR);
        colorTexture.setWrapU(GlWrap.CLAMP_TO_EDGE);
        colorTexture.setWrapV(GlWrap.CLAMP_TO_EDGE);
        return colorTexture;
    }

    private createGodrayOcclusionTexture(): void {
        const texture = new GlTexture2D();
        texture.allocate(GlInternalFormat.RGB8, this.getRenderingSize(), false);
        texture.setMinificationFilter(GlMinificationFilter.LINEAR);
        texture.setMagnificationFilter(GlMagnificationFilter.LINEAR);
        texture.setWrapU(GlWrap.CLAMP_TO_EDGE);
        texture.setWrapV(GlWrap.CLAMP_TO_EDGE);
        this.getParameters().set(RenderingPipeline.GODRAY_OCCLUSION, texture);
    }

    private createEmissionTexture(): void {
        const texture = new GlTexture2DArray();
        texture.allocate(GlInternalFormat.RGBA16F, this.getRenderingSize(), 1, false);
        texture.setMinificationFilter(GlMinificationFilter.LINEAR);
        texture.setMagnificationFilter(GlMagnificationFilter.LINEAR);
        texture.setWrapU(GlWrap.CLAMP_TO_EDGE);
        texture.setWrapV(GlWrap.CLAMP_TO_EDGE);
        this.getParameters().set(RenderingPipeline.EMISSION, texture);
    }

    private creatDepthexture(): void {
        const texture = new GlTexture2D();
        texture.allocate(GlInternalFormat.DEPTH32F, this.getRenderingSize(), false);
        texture.setMinificationFilter(GlMinificationFilter.NEAREST);
        texture.setMagnificationFilter(GlMagnificationFilter.NEAREST);
        texture.setWrapU(GlWrap.CLAMP_TO_EDGE);
        texture.setWrapV(GlWrap.CLAMP_TO_EDGE);
        this.getParameters().set(RenderingPipeline.DEPTH, texture);
    }

    protected throwErrorIfFboIsNotComplete(): void {
        if (!this.postProcessFbo.isDrawComplete() || !this.postProcessFbo.isReadComplete() ||
            !this.geometryFbo.isDrawComplete() || !this.geometryFbo.isReadComplete()) {
            throw new Error();
        }
    }

    //rendering

    public render(): void {
        //this.fbo.getAttachmentContainer(FboAttachmentSlot.COLOR, 0).attachTexture2D(this.fboTextures[0]);
        Engine.getLog().startGroup('rendering');



        this.beforePipeline();
        this.renderIfRendererIsUsableAndActive(this.shadowRenderer);
        this.renderGeometry();

        const tex = this.getParameters().get(RenderingPipeline.GODRAY_OCCLUSION);
        this.postProcessFbo.getAttachmentContainer(GlFboAttachmentSlot.COLOR, 1).attachTexture2D(tex as GlTexture2D);
        const tex2 = this.getParameters().get(RenderingPipeline.EMISSION) as GlTexture2DArray;
        this.postProcessFbo.getAttachmentContainer(GlFboAttachmentSlot.COLOR, 2).attachTexture2DArrayLayer(tex2.getLayer(0));
        const depth = this.getParameters().get(RenderingPipeline.DEPTH);
        this.postProcessFbo.getAttachmentContainer(GlFboAttachmentSlot.DEPTH).attachTexture2D(depth as GlTexture2D);

        this.geometryFbo.blitTo(this.postProcessFbo, vec2.create(), this.getRenderingSize(), vec2.create(), this.getRenderingSize(), GlFboAttachmentSlot.DEPTH);

        this.geometryFbo.setReadBuffer(this.geometryFbo.getAttachmentContainer(GlFboAttachmentSlot.COLOR, 0));
        this.postProcessFbo.setDrawBuffers(this.postProcessFbo.getAttachmentContainer(GlFboAttachmentSlot.COLOR, 0));
        this.geometryFbo.blitTo(this.postProcessFbo, vec2.create(), this.getRenderingSize(), vec2.create(), this.getRenderingSize(), GlFboAttachmentSlot.COLOR);

        this.geometryFbo.setReadBuffer(this.geometryFbo.getAttachmentContainer(GlFboAttachmentSlot.COLOR, 1));
        this.postProcessFbo.setDrawBuffers(
            null,
            this.postProcessFbo.getAttachmentContainer(GlFboAttachmentSlot.COLOR, 1)
        );
        this.geometryFbo.blitTo(this.postProcessFbo, vec2.create(), this.getRenderingSize(), vec2.create(), this.getRenderingSize(), GlFboAttachmentSlot.COLOR);

        this.geometryFbo.setReadBuffer(this.geometryFbo.getAttachmentContainer(GlFboAttachmentSlot.COLOR, 2));
        this.postProcessFbo.setDrawBuffers(
            null, null,
            this.postProcessFbo.getAttachmentContainer(GlFboAttachmentSlot.COLOR, 2)
        );
        this.geometryFbo.blitTo(this.postProcessFbo, vec2.create(), this.getRenderingSize(), vec2.create(), this.getRenderingSize(), GlFboAttachmentSlot.COLOR);

        this.geometryFbo.setReadBuffer(this.geometryFbo.getAttachmentContainer(GlFboAttachmentSlot.COLOR, 0));
        this.postProcessFbo.setDrawBuffers(this.postProcessFbo.getAttachmentContainer(GlFboAttachmentSlot.COLOR, 0));

        this.postProcessFbo.getAttachmentContainer(GlFboAttachmentSlot.COLOR, 1).detachAttachment();
        this.postProcessFbo.getAttachmentContainer(GlFboAttachmentSlot.COLOR, 2).detachAttachment();
        this.postProcessFbo.getAttachmentContainer(GlFboAttachmentSlot.DEPTH).detachAttachment();

        this.dualDepthPeeling.render(this.geometryRenderers);

        this.renderPostProcess();
        this.postProcessFbo.getAttachmentContainer(GlFboAttachmentSlot.COLOR, 0).detachAttachment();
        this.renderToScreen();
        this.afterPipeline();
        Engine.getLog().endGroup();
    }

    protected beforePipeline(): void {
        this.refresh();
        this.bindPostProcessFbo();
        this.postProcessFbo.getAttachmentContainer(GlFboAttachmentSlot.COLOR, 0).attachTexture2D(this.fboTextures[0]);
        this.bindGeometryFbo();
        this.getParameters().set(RenderingPipeline.WORK, this.fboTextures[0]);
        this.drawIndex = 0;

        this.geometryFbo.setDrawBuffers(
            this.geometryFbo.getAttachmentContainer(GlFboAttachmentSlot.COLOR, 0),
            this.geometryFbo.getAttachmentContainer(GlFboAttachmentSlot.COLOR, 1),
            this.geometryFbo.getAttachmentContainer(GlFboAttachmentSlot.COLOR, 2)
        );

        Gl.setClearColor(vec4.fromValues(0, 0, 0, 1));
        Gl.clear(true, true, false);

        this.geometryFbo.setDrawBuffers(this.geometryFbo.getAttachmentContainer(GlFboAttachmentSlot.COLOR, 0));

        this.useCameraUbo();
    }

    protected renderGeometry(): void {
        for (const renderer of this.geometryRenderers.getIterator()) {
            this.renderIfRendererIsUsableAndActive(renderer);
        }
    }

    protected renderPostProcess(): void {
        for (const renderer of this.postProcessRenderers.getIterator()) {
            this.renderIfPostProcessRendererIsUsableAndActive(renderer);
        }
    }

    protected renderToScreen(): void {
        GlFbo.bindDefaultFrameBuffer();
        Gl.clear(true, true, false);
        this.getParameters().set(RenderingPipeline.WORK, this.fboTextures[this.drawIndex]);
        this.screenRenderer.setTransformation(mat4.create());
        this.renderIfRendererIsUsableAndActive(this.screenRenderer);

        /*this.getParameters().set(RenderingPipeline.DEBUG, this.getParameters().get(RenderingPipeline.SHADOWMAP));
        const ar = 1 / (this.getRenderingSize()[0] / this.getRenderingSize()[1]);
        let trans = mat4.fromRotationTranslationScale(mat4.create(), quat.create(), vec3.fromValues(ar * 0 + 0.25 + ar * 0.5, 0.5, 0), vec3.fromValues(0.25 * ar, 0.25, 1))
        this.debugRenderer.setData(trans, 0);
        this.renderIfRendererIsUsableAndActive(this.debugRenderer);

        trans = mat4.fromRotationTranslationScale(mat4.create(), quat.create(), vec3.fromValues(ar * -0.5 + ar * 0.5, 0.5, 0), vec3.fromValues(0.25 * ar, 0.25, 1))
        this.debugRenderer.setData(trans, 1);
        this.renderIfRendererIsUsableAndActive(this.debugRenderer);

        trans = mat4.fromRotationTranslationScale(mat4.create(), quat.create(), vec3.fromValues(ar * -1 - 0.25 + ar * 0.5, 0.5, 0), vec3.fromValues(0.25 * ar, 0.25, 1))
        this.debugRenderer.setData(trans, 2);
        this.renderIfRendererIsUsableAndActive(this.debugRenderer);*/


        /*const ar = 1;// / (this.getRenderingSize()[0] / this.getRenderingSize()[1]);
        const trans = mat4.fromRotationTranslationScale(mat4.create(), quat.create(), vec3.fromValues(ar * -1 - 0.25 + ar * 0.5, 0.5, 0), vec3.fromValues(0.25 * ar, 0.25, 1))
        this.debugRenderer.setData(trans, 0);
        this.getParameters().set(RenderingPipeline.DEBUG, this.getParameters().get(RenderingPipeline.EMISSION));
        this.renderIfRendererIsUsableAndActive(this.debugRenderer);*/

        // const ar = 1 //(this.getRenderingSize()[0] / this.getRenderingSize()[1]);
        // const trans = mat4.fromRotationTranslationScale(mat4.create(), quat.create(), vec3.fromValues(0, 0.5, 0), vec3.fromValues(0.25 * ar, 0.25, 1))
        // this.debugRenderer.setData(trans, 0);
        // this.getParameters().set(RenderingPipeline.DEBUG_2, this.getParameters().get(RenderingPipeline.DEPTH));
        // this.renderIfRendererIsUsableAndActive(this.debugRenderer);

        // const ar = 1 //(this.getRenderingSize()[0] / this.getRenderingSize()[1]);
        // const trans = mat4.fromRotationTranslationScale(mat4.create(), quat.create(), vec3.fromValues(0, 0.5, 0), vec3.fromValues(0.25 * ar, 0.25, 1))
        // this.debugRenderer.setData(trans, 0);
        // this.getParameters().set(RenderingPipeline.DEBUG_2, this.getParameters().get(RenderingPipeline.FRONT));
        // this.renderIfRendererIsUsableAndActive(this.debugRenderer);
    }

    protected renderIfRendererIsUsableAndActive(renderer: Renderer): void {
        this.logWarningIfRendererIsNotUsable(renderer);
        if (Utility.isUsable(renderer) && renderer.isActive()) {
            renderer.render();
        }
    }

    protected renderIfPostProcessRendererIsUsableAndActive(renderer: PostProcessRenderer): void {
        this.logWarningIfRendererIsNotUsable(renderer);
        if (Utility.isUsable(renderer) && renderer.isActive()) {
            this.pingPong();
            renderer.render();
        }
    }

    protected pingPong(): void {
        this.getParameters().set(RenderingPipeline.WORK, this.fboTextures[this.drawIndex]);
        this.drawIndex = 1 - this.drawIndex;
        this.postProcessFbo.getAttachmentContainer(GlFboAttachmentSlot.COLOR, 0).attachTexture2D(this.fboTextures[this.drawIndex]);
    }

    protected logWarningIfRendererIsNotUsable(renderer: Renderer): void {
        if (!Utility.isUsable(renderer)) {
            Engine.getLog().logString(LogLevel.WARNING, `The ${renderer.getName()} is not usable`);
        }
    }

    protected afterPipeline(): void {
        this.getParameters().set(RenderingPipeline.WORK, null);
    }

    //utility

    private useCameraUbo(): void {
        const mainCamera = Engine.getMainCamera();
        if (!mainCamera || !mainCamera.getGameObject() || !mainCamera.isActive()) {
            throw new Error();
        }
        CameraStruct.getInstance().useUbo();
    }

    private refresh(): void {
        this.refreshCameraAndCanvasIfResized();
        if (!this.areFbosValid()) {
            this.createGeomteryFbo();
            this.addAttachmentsToTheGeometryFbo();
            this.createPostProcessFbo();
            this.addAttachmentsToThePostProcessFbo();
            this.throwErrorIfFboIsNotComplete();
            Utility.releaseIfUsable(this.parameters.get(RenderingPipeline.DEPTH));
            this.creatDepthexture();
        }
    }

    private refreshCameraAndCanvasIfResized(): void {
        const canvas = Gl.getCanvas();
        if (canvas.clientWidth !== canvas.width || canvas.clientHeight !== canvas.height) {
            canvas.width = canvas.clientWidth;
            canvas.height = canvas.clientHeight;
            const camera = Engine.getMainCamera();
            camera?.invalidate();
        }
    }

}