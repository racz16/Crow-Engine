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

export class RenderingPipeline {

    public static readonly SHADOWMAP = new ParameterKey<ITexture2D>('SHADOWMAP');
    public static readonly SHADOW_PROJECTION_VIEW_MATRIX = new ParameterKey<mat4>('SHADOW_PROJECTION_VIEW_MATRIX');
    public static readonly GAMMA = new ParameterKey<number>('GAMMA');
    public static readonly WORK = new ParameterKey<ITexture2D>('WORK');

    private static parameters = new ParameterContainer();


    private static fbo: Fbo;
    private static renderingScale = 1;
    private static renderables = new RenderableContainer();

    private static geometryRenderers = new RendererContainer<GeometryRenderer>();
    private static postProcessRenderers = new RendererContainer<PostProcessRenderer>();

    private static blinnPhongRenderer: BlinnPhongRenderer;
    private static skyboxRenderer: SkyboxRenderer;
    private static screenRenderer: ScreenRenderer;


    private constructor() { }

    public static initialize(): void {
        //TODO: parameterts
        this.refresh();
        this.blinnPhongRenderer = new BlinnPhongRenderer();
        this.skyboxRenderer = new SkyboxRenderer();
        this.screenRenderer = new ScreenRenderer();
        Log.logString(LogLevel.INFO_1, 'Rendering Pipeline initialized');
    }

    public static getRenderableContainer(): RenderableContainer {
        return RenderingPipeline.renderables;
    }

    public static getParameters(): ParameterContainer {
        return RenderingPipeline.parameters;
    }

    public static getRenderingScale(): number {
        return this.renderingScale;
    }

    public static setRenderingScale(renderingScale: number): void {
        if (renderingScale <= 0) {
            throw new Error();
        }
        RenderingPipeline.renderingScale = renderingScale;
        this.refresh();
    }

    public static bindFbo(): void {
        this.fbo.bind();
    }

    public static getRenderingSize(): vec2 {
        const renderingSize = vec2.create();
        const canvas = Gl.getCanvas();
        renderingSize[0] = canvas.clientWidth * this.renderingScale;
        renderingSize[1] = canvas.clientHeight * this.renderingScale;
        return renderingSize;
    }

    private static getFboSize(): vec2 {
        return this.fbo.getAttachmentContainer(FboAttachmentSlot.COLOR, 0).getAttachment().getSize();
    }

    private static refresh(): void {
        this.refreshIfCanvasResized();
        if (!Utility.isUsable(this.fbo) ||
            this.getRenderingSize()[0] != this.getFboSize()[0] ||
            this.getRenderingSize()[1] != this.getFboSize()[1]) {
            if (this.fbo) {
                this.fbo.release();
            }
            this.fbo = new Fbo();
            const colorTexture1 = new GlTexture2D();
            colorTexture1.allocate(InternalFormat.RGBA16F, this.getRenderingSize(), false);
            colorTexture1.setMinificationFilter(TextureFilter.NEAREST);
            colorTexture1.setMagnificationFilter(TextureFilter.NEAREST);
            this.fbo.getAttachmentContainer(FboAttachmentSlot.COLOR, 0).attachTexture2D(colorTexture1);
            const depthRbo = new Rbo();
            depthRbo.allocate(this.getRenderingSize(), InternalFormat.DEPTH32F, 1);
            this.fbo.getAttachmentContainer(FboAttachmentSlot.DEPTH).attachRbo(depthRbo);
            if (!this.fbo.isDrawComplete() || !this.fbo.isReadComplete()) {
                throw new Error();
            }
        }
        /*if (!Utility.isUsable(this.screenRenderer)) {
            this.screenRenderer = new ScreenRenderer();
        }
        if (!Utility.isUsable(this.skyboxRenderer)) {
            this.skyboxRenderer = new SkyBoxRenderer();
        }*/
    }

    public static render(): void {
        Log.startGroup('rendering');
        this.beforeRender();
        Gl.setEnableDepthTest(true);
        //prepare  
        this.bindFbo();
        Engine.getParameters().get(Engine.DEFAULT_TEXTURE_2D).getNativeTexture().bindToTextureUnit(0);
        Gl.clear(true, true, false);
        this.blinnPhongRenderer.render();
        this.skyboxRenderer.render();
        this.getParameters().set(this.WORK, this.fbo.getAttachmentContainer(FboAttachmentSlot.COLOR, 0).getTextureAttachment());
        //post
        Fbo.bindDefaultFrameBuffer();
        Gl.clear(true, true, false);
        this.screenRenderer.render();
        this.getParameters().set(this.WORK, null);
        Log.endGroup();
    }

    private static beforeRender(): void {
        this.refresh();
        //this.bindFbo();
        Gl.clear(true, true, false);

        const mainCamera = Engine.getMainCamera();
        if (!mainCamera || !mainCamera.isActive()) {
            throw new Error();
        }
        CameraStruct.getInstance().refreshUbo();
        CameraStruct.getInstance().useUbo();
    }

    private static refreshIfCanvasResized(): void {
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