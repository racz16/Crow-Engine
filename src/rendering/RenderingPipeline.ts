import { RenderableContainer } from '../core/RenderableContainer';
import { Gl } from '../webgl/Gl';
import { ParameterContainer } from '../utility/parameter/ParameterContainer';
import { ParameterKey } from '../utility/parameter/ParameterKey';
import { ITexture2D } from '../resource/texture/ITexture2D';
import { GlTexture2D } from '../webgl/texture/GlTexture2D';
import { Fbo } from '../webgl/fbo/Fbo';
import { FboAttachmentSlot } from '../webgl/enum/FboAttachmentSlot';
import { vec2, mat4 } from 'gl-matrix';
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

export class RenderingPipeline {

    public static readonly SHADOWMAP = new ParameterKey<ITexture2D>('SHADOWMAP');
    public static readonly SHADOW_PROJECTION_VIEW_MATRIX = new ParameterKey<mat4>('SHADOW_PROJECTION_VIEW_MATRIX');
    public static readonly GAMMA = new ParameterKey<number>('GAMMA');
    public static readonly WORK = new ParameterKey<ITexture2D>('WORK');

    private parameters = new ParameterContainer();

    private fbo: Fbo;
    private renderingScale = 1;
    private renderables = new RenderableContainer();
    private geometryRenderers = new RendererContainer<GeometryRenderer>();
    private postProcessRenderers = new RendererContainer<PostProcessRenderer>();
    private screenRenderer: ScreenRenderer;

    public constructor() {
        this.geometryRenderers.addToTheEnd(new BlinnPhongRenderer());
        this.geometryRenderers.addToTheEnd(new SkyboxRenderer());
        this.screenRenderer = new ScreenRenderer();
        Log.logString(LogLevel.INFO_1, 'Rendering Pipeline initialized');
    }

    public getGeometryRendererContainer(): RendererContainer<GeometryRenderer> {
        return this.geometryRenderers;
    }

    public getPostProcessRendererContainer(): RendererContainer<PostProcessRenderer> {
        return this.postProcessRenderers;
    }

    public getRenderableContainer(): RenderableContainer {
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

    public bindFbo(): void {
        this.fbo.bind();
    }

    public getRenderingSize(): vec2 {
        const renderingSize = vec2.create();
        const canvas = Gl.getCanvas();
        renderingSize[0] = canvas.clientWidth * this.renderingScale;
        renderingSize[1] = canvas.clientHeight * this.renderingScale;
        return renderingSize;
    }

    private getFboSize(): vec2 {
        return this.fbo.getAttachmentContainer(FboAttachmentSlot.COLOR, 0).getAttachment().getSize();
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

    private refresh(): void {
        this.refreshCameraAndCanvasIfResized();
        if (!this.isFboValid()) {
            this.createFbo();
            this.addColorAttachmentToTheFbo();
            this.addDepthAttachmentToTheFbo();
            this.throwErrorIfFboIsNotComplete();
        }
    }

    protected throwErrorIfFboIsNotComplete(): void {
        if (!this.fbo.isDrawComplete() || !this.fbo.isReadComplete()) {
            throw new Error();
        }
    }

    private createFbo(): void {
        if (Utility.isUsable(this.fbo)) {
            Utility.releaseFboAndAttachments(this.fbo);
        }
        this.fbo = new Fbo();
    }

    private addColorAttachmentToTheFbo(): void {
        const colorTexture1 = new GlTexture2D();
        colorTexture1.allocate(InternalFormat.RGBA16F, this.getRenderingSize(), false);
        colorTexture1.setMinificationFilter(TextureFilter.NEAREST);
        colorTexture1.setMagnificationFilter(TextureFilter.NEAREST);
        this.fbo.getAttachmentContainer(FboAttachmentSlot.COLOR, 0).attachTexture2D(colorTexture1);
    }

    private addDepthAttachmentToTheFbo(): void {
        const depthRbo = new Rbo();
        depthRbo.allocate(this.getRenderingSize(), InternalFormat.DEPTH32F, 1);
        this.fbo.getAttachmentContainer(FboAttachmentSlot.DEPTH).attachRbo(depthRbo);
    }

    private isFboValid(): boolean {
        return Utility.isUsable(this.fbo) &&
            this.getRenderingSize()[0] === this.getFboSize()[0] &&
            this.getRenderingSize()[1] === this.getFboSize()[1]
    }

    public render(): void {
        Log.startGroup('rendering');
        this.beforePipeline();
        this.renderGeometry();
        this.renderPostProcess();
        this.renderToScreen();
        this.afterPipeline();
        Log.endGroup();
    }

    protected renderGeometry(): void {
        for (const renderer of this.geometryRenderers.getIterator()) {
            this.logWarningIfRendererIsNotUsable(renderer);
            this.renderIfRendererIsUsableAndActive(renderer);
        }
        this.getParameters().set(RenderingPipeline.WORK, this.fbo.getAttachmentContainer(FboAttachmentSlot.COLOR, 0).getTextureAttachment());
    }

    protected renderPostProcess(): void {
        //TODO
    }

    protected renderToScreen(): void {
        this.logWarningIfRendererIsNotUsable(this.screenRenderer);
        this.renderIfRendererIsUsableAndActive(this.screenRenderer);
    }

    protected renderIfRendererIsUsableAndActive(renderer: Renderer): void {
        if (renderer.isUsable() && renderer.isActive()) {
            renderer.render();
        }
    }

    protected logWarningIfRendererIsNotUsable(renderer: Renderer): void {
        if (!renderer.isUsable()) {
            Log.logString(LogLevel.WARNING, `The ${renderer.getName()} is not usable`);
        }
    }

    protected beforePipeline(): void {
        this.refresh();
        this.bindFbo();
        Gl.clear(true, true, false);
        this.useCameraUbo();
    }

    private useCameraUbo(): void {
        const mainCamera = Engine.getMainCamera();
        if (!mainCamera || !mainCamera.isActive()) {
            throw new Error();
        }
        CameraStruct.getInstance().refreshUbo();
        CameraStruct.getInstance().useUbo();
    }

    protected afterPipeline(): void {
        this.getParameters().set(RenderingPipeline.WORK, null);
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