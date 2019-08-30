import { RenderableContainer } from '../core/RenderableContainer';
import { Gl } from '../webgl/Gl';
import { Scene } from '../core/Scene';
import { ParameterContainer } from '../utility/parameter/ParameterContainer';
import { ParameterKey } from '../utility/parameter/ParameterKey';
import { ITexture2D } from '../resource/texture/ITexture2D';
import { GlTexture2D } from '../webgl/texture/GlTexture2D';
import { Fbo } from '../webgl/fbo/Fbo';
import { FboAttachmentSlot } from '../webgl/enum/FboAttachmentSlot';
import { vec2, mat4 } from 'gl-matrix';
import { SkyBoxRenderer } from './renderer/SkyBoxRenderer';
import { BlinnPhongRenderer } from './renderer/BlinnPhongRenderer';
import { ScreenRenderer } from './ScreenRenderer';
import { Log } from '../utility/log/Log';
import { BindingPoint } from './BindingPoint';
import { LogLevel } from '../utility/log/LogLevel';
import { CameraStruct } from '../component/camera/CameraStruct';

export class RenderingPipeline {

    public static readonly SHADOWMAP = new ParameterKey<GlTexture2D>(GlTexture2D, 'SHADOWMAP');
    public static readonly SHADOW_PROJECTION_VIEW_MATRIX = new ParameterKey<mat4>(mat4, 'SHADOW_PROJECTION_VIEW_MATRIX');
    public static readonly GAMMA = new ParameterKey<Number>(Number, 'GAMMA');

    private static renderingScale = 1;
    private static renderables = new RenderableContainer();
    private static parameters = new ParameterContainer();
    private static blinnPhongRenderer: BlinnPhongRenderer;
    private static fbo: Fbo;
    private static screenRenderer: ScreenRenderer;
    private static skyboxRenderer: SkyBoxRenderer;

    public static readonly CAMERA_BINDING_POINT = new BindingPoint(1, 'Camera');
    public static readonly LIGHTS_BINDING_POINT = new BindingPoint(2, 'Lights');

    public static readonly WORK = new ParameterKey<ITexture2D>(GlTexture2D, 'WORK');

    private constructor() { }

    public static initialize(): void {
        //TODO: parameterts
        this.refresh();
        this.blinnPhongRenderer = new BlinnPhongRenderer();
        this.skyboxRenderer = new SkyBoxRenderer();
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
        //this.fbo.bind();
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
        const ext = Gl.gl.getExtension('EXT_color_buffer_float');
        if (!ext) {
            alert('need EXT_color_buffer_float');
            return;
        }
        this.refreshIfCanvasResized();
        /*if (!Utility.isUsable(this.fbo) ||
            this.getRenderingSize()[0] != this.getFboSize()[0] ||
            this.getRenderingSize()[1] != this.getFboSize()[1]) {
            if (this.fbo) {
                this.fbo.release();
            }
            this.fbo = new Fbo();
            const colorTexture1 = new GlTexture2D();
            colorTexture1.allocate(InternalFormat.RGBA16F, this.getRenderingSize(), false);
            this.fbo.getAttachmentContainer(FboAttachmentSlot.COLOR, 0).attachTexture2D(colorTexture1);
            const depthRbo = new Rbo();
            depthRbo.allocate(this.getRenderingSize(), InternalFormat.DEPTH32F, 1);
            this.fbo.getAttachmentContainer(FboAttachmentSlot.DEPTH, -1).attachRbo(depthRbo);
            if (!this.fbo.isDrawComplete()) {
                throw new Error();
            }
        }*/
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
        //this.bindFbo();
        this.blinnPhongRenderer.render();
        this.skyboxRenderer.render();
        //this.getParameters().set(this.WORK, new Parameter(this.fbo.getAttachmentContainer(FboAttachmentSlot.COLOR, 0).getTextureAttachment()));
        //post
        //Fbo.bindDefaultFrameBuffer();
        //Gl.clear(true, true, false);
        //this.screenRenderer.render();
        //this.getParameters().set(this.WORK, null);
        Log.endGroup();
    }

    private static beforeRender(): void {
        this.refresh();
        //this.bindFbo();
        Gl.clear(true, true, false);

        const mainCamera = Scene.getParameters().get(Scene.MAIN_CAMERA);
        if (!mainCamera || !mainCamera.isActive()) {
            throw new Error();
        }
        CameraStruct.getInstance().refreshUbo();
        CameraStruct.getInstance().useCameraMatricesUbo();
    }

    private static refreshIfCanvasResized(): void {
        const canvas = Gl.getCanvas();
        if (canvas.clientWidth !== canvas.width || canvas.clientHeight !== canvas.height) {
            canvas.width = canvas.clientWidth;
            canvas.height = canvas.clientHeight;
            const camera = Scene.getParameters().get(Scene.MAIN_CAMERA);
            if (camera) {
                camera.invalidate();
            }
        }
    }
}