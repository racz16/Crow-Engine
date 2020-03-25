import { RenderableContainer } from '../core/RenderableContainer';
import { Gl } from '../webgl/Gl';
import { ParameterContainer } from '../utility/parameter/ParameterContainer';
import { ParameterKey } from '../utility/parameter/ParameterKey';
import { ITexture2D } from '../resource/texture/ITexture2D';
import { GlTexture2D } from '../webgl/texture/GlTexture2D';
import { Fbo } from '../webgl/fbo/Fbo';
import { FboAttachmentSlot } from '../webgl/enum/FboAttachmentSlot';
import { vec2, mat4, } from 'gl-matrix';
import { SkyboxRenderer } from './renderer/SkyboxRenderer';
import { BlinnPhongRenderer } from './renderer/BlinnPhongRenderer';
import { ScreenRenderer } from './renderer/ScreenRenderer';
import { Log } from '../utility/log/Log';
import { LogLevel } from '../utility/log/LogLevel';
import { CameraStruct } from '../component/camera/CameraStruct';
import { Engine } from '../core/Engine';
import { Utility } from '../utility/Utility';
import { InternalFormat } from '../webgl/enum/InternalFormat';
import { Rbo } from '../webgl/fbo/Rbo';
import { TextureFilter } from '../webgl/enum/TextureFilter';
import { RendererContainer } from './RendererContainer';
import { GeometryRenderer } from './GeometryRenderer';
import { PostProcessRenderer } from './PostProcessRenderer';
import { Renderer } from './Renderer';
import { GammaCorrectionRenderer } from './renderer/GammaCorrectionRenderer';
import { ReinhardToneMappingRenderer } from './renderer/ReinhardToneMappingRenderer';
import { PbrRenderer } from './renderer/PbrRenderer';
import { CubeMapTexture } from '../resource/texture/CubeMapTexture';
import { TextureWrap } from '../webgl/enum/TextureWrap';
import { VarianceShadowRenderer } from './renderer/VarianceShadowRenderer';
import { ITexture2DArray } from '../resource/texture/ITexture2DArray';
import { DebugRenderer } from './renderer/DebugRenderer';
import { IRenderingPipeline } from './IRenderingPipeline';
import { IRenderableContainer } from '../core/IRenderableContainer';

export class RenderingPipeline implements IRenderingPipeline {

    public static readonly SHADOWMAP = new ParameterKey<ITexture2DArray>('SHADOWMAP');
    public static readonly SHADOW_PROJECTION_VIEW_MATRICES = new ParameterKey<Array<mat4>>('SHADOW_PROJECTION_VIEW_MATRICES');
    public static readonly SHADOW_SPLITS = new ParameterKey<Array<number>>('SHADOW_SPLITS');
    public static readonly PBR_DIFFUSE_IBL_MAP = new ParameterKey<CubeMapTexture>('PBR_DIFFUSE_IBL_MAP');
    public static readonly PBR_SPECULAR_IBL_MAP = new ParameterKey<CubeMapTexture>('PBR_SPECULAR_IBL_MAP');
    public static readonly WORK = new ParameterKey<ITexture2D>('WORK');
    public static readonly DEBUG = new ParameterKey<ITexture2DArray>('DEBUG');

    private parameters = new ParameterContainer();
    private fbo: Fbo;
    private fboTextures = new Array<GlTexture2D>(2);
    private drawIndex = 0;
    private renderingScale = 1;
    private renderables = new RenderableContainer();
    private shadowRenderer: VarianceShadowRenderer;
    private geometryRenderers = new RendererContainer<GeometryRenderer>();
    private postProcessRenderers = new RendererContainer<PostProcessRenderer>();
    private debugRenderer = new DebugRenderer();
    private screenRenderer: ScreenRenderer;

    public initialize(): void {
        this.shadowRenderer = new VarianceShadowRenderer();
        this.geometryRenderers.addToTheEnd(new SkyboxRenderer());
        this.geometryRenderers.addToTheEnd(new BlinnPhongRenderer());
        this.geometryRenderers.addToTheEnd(new PbrRenderer());
        this.postProcessRenderers.addToTheEnd(new ReinhardToneMappingRenderer());
        this.postProcessRenderers.addToTheEnd(new GammaCorrectionRenderer());
        this.screenRenderer = new ScreenRenderer();
        this.refresh();
        Log.logString(LogLevel.INFO_1, 'Rendering Pipeline initialized');
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

    public getRenderingSize(): vec2 {
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

    public bindFbo(): void {
        this.fbo.bind();
    }

    private getFboSize(): vec2 {
        return this.fboTextures[0].getSize();
    }

    private isFboValid(): boolean {
        return Utility.isUsable(this.fbo) &&
            this.getRenderingSize()[0] === this.getFboSize()[0] &&
            this.getRenderingSize()[1] === this.getFboSize()[1]
    }

    private createFbo(): void {
        if (Utility.isUsable(this.fbo)) {
            Utility.releaseFboAndAttachments(this.fbo);
            Utility.releaseIfUsable(this.fboTextures[0]);
            Utility.releaseIfUsable(this.fboTextures[1]);
        }
        this.fbo = new Fbo();
    }

    private addAttachmentsToTheFbo(): void {
        this.fboTextures[0] = this.createFboTexture();
        this.fboTextures[1] = this.createFboTexture();
        this.fbo.getAttachmentContainer(FboAttachmentSlot.COLOR, 0).attachTexture2D(this.fboTextures[0]);
        this.addDepthAttachmentToTheFbo();
    }

    private createFboTexture(): GlTexture2D {
        const colorTexture = new GlTexture2D();
        colorTexture.allocate(InternalFormat.RGBA16F, this.getRenderingSize(), false);
        colorTexture.setMinificationFilter(TextureFilter.LINEAR);
        colorTexture.setMagnificationFilter(TextureFilter.LINEAR);
        colorTexture.setWrapU(TextureWrap.CLAMP_TO_EDGE);
        colorTexture.setWrapV(TextureWrap.CLAMP_TO_EDGE);
        return colorTexture;
    }

    private addDepthAttachmentToTheFbo(): void {
        const depthRbo = new Rbo();
        depthRbo.allocate(this.getRenderingSize(), InternalFormat.DEPTH32F, 1);
        this.fbo.getAttachmentContainer(FboAttachmentSlot.DEPTH).attachRbo(depthRbo);
    }

    protected throwErrorIfFboIsNotComplete(): void {
        if (!this.fbo.isDrawComplete() || !this.fbo.isReadComplete()) {
            throw new Error();
        }
    }

    //rendering

    public render(): void {
        //this.fbo.getAttachmentContainer(FboAttachmentSlot.COLOR, 0).attachTexture2D(this.fboTextures[0]);
        Log.startGroup('rendering');
        this.beforePipeline();
        this.renderIfRendererIsUsableAndActive(this.shadowRenderer);
        this.renderGeometry();
        this.renderPostProcess();
        this.fbo.getAttachmentContainer(FboAttachmentSlot.COLOR, 0).detachAttachment();
        this.renderToScreen();
        this.afterPipeline();
        Log.endGroup();
        //
    }

    protected beforePipeline(): void {
        this.refresh();
        this.bindFbo();
        this.fbo.getAttachmentContainer(FboAttachmentSlot.COLOR, 0).attachTexture2D(this.fboTextures[0]);
        this.getParameters().set(RenderingPipeline.WORK, this.fboTextures[0]);
        this.drawIndex = 0;
        Gl.clear(true, true, false);
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
        Fbo.bindDefaultFrameBuffer();
        Gl.clear(true, true, false);
        this.getParameters().set(RenderingPipeline.WORK, this.fboTextures[this.drawIndex]);
        this.screenRenderer.setTransformation(mat4.create());
        this.renderIfRendererIsUsableAndActive(this.screenRenderer);

        /*this.getParameters().set(RenderingPipeline.DEBUG, this.getParameters().get(RenderingPipeline.SHADOWMAP));
        const ar = 1 / (this.getRenderingSize()[0] / this.getRenderingSize()[1]);
        let trans = mat4.fromRotationTranslationScale(mat4.create(), quat.create(), vec3.fromValues(-0.5 + ar * 0.5, -0.5, 0), vec3.fromValues(0.25 * ar, 0.25, 1))
        this.debugRenderer.setData(trans, 0);
        this.renderIfRendererIsUsableAndActive(this.debugRenderer);

        trans = mat4.fromRotationTranslationScale(mat4.create(), quat.create(), vec3.fromValues(ar * 0.5, -0.5, 0), vec3.fromValues(0.25 * ar, 0.25, 1))
        this.debugRenderer.setData(trans, 1);
        this.renderIfRendererIsUsableAndActive(this.debugRenderer);

        trans = mat4.fromRotationTranslationScale(mat4.create(), quat.create(), vec3.fromValues(0.5 + ar * 0.5, -0.5, 0), vec3.fromValues(0.25 * ar, 0.25, 1))
        this.debugRenderer.setData(trans, 2);
        this.renderIfRendererIsUsableAndActive(this.debugRenderer);*/
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
        this.fbo.getAttachmentContainer(FboAttachmentSlot.COLOR, 0).attachTexture2D(this.fboTextures[this.drawIndex]);
    }

    protected logWarningIfRendererIsNotUsable(renderer: Renderer): void {
        if (!Utility.isUsable(renderer)) {
            Log.logString(LogLevel.WARNING, `The ${renderer.getName()} is not usable`);
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
        CameraStruct.getInstance().refreshUbo();
        CameraStruct.getInstance().useUbo();
    }

    private refresh(): void {
        this.refreshCameraAndCanvasIfResized();
        if (!this.isFboValid()) {
            this.createFbo();
            this.addAttachmentsToTheFbo();
            this.throwErrorIfFboIsNotComplete();
        }
    }

    private refreshCameraAndCanvasIfResized(): void {
        const canvas = Gl.getCanvas();
        if (canvas.clientWidth !== canvas.width || canvas.clientHeight !== canvas.height) {
            canvas.width = canvas.clientWidth;
            canvas.height = canvas.clientHeight;
            const camera = Engine.getMainCamera();
            if (camera) {
                camera.invalidate();
            }
        }
    }

}