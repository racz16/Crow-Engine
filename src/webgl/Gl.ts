import { GlBlendFunc, GlBlendFuncResolver } from './enum/GlBlendFunc';
import { GlCullFace, GlCullFaceResolver } from './enum/GlCullFace';
import { GlConstants } from './GlConstants';
import { vec2, vec4 } from 'gl-matrix';
import { LogLevel } from '../utility/log/LogLevel';
import { GlTexture2D } from './texture/GlTexture2D';
import { GlInternalFormat } from './enum/GlInternalFormat';
import { Engine } from '../core/Engine';
import { GlCubeMapTexture } from './texture/GlCubeMapTexture';
import { GlTexture2DArray } from './texture/GlTexture2DArray';
import { GlPerformance, GlPerformanceResolver } from './enum/GlPerformance';
import { GlMinificationFilter } from './enum/GlMinificationFilter';
import { GlMagnificationFilter } from './enum/GlMagnificationFIlter';
import { GlFormat } from './enum/GlFormat';
import { GlTextureDataType } from './enum/GlTextureDataType';

export class Gl {

    private static context: WebGL2RenderingContext;
    private static canvas: HTMLCanvasElement;

    private constructor() { }

    public static initialize(canvas: HTMLCanvasElement): void {
        Gl.context = canvas.getContext('webgl2');
        if (!Gl.context) {
            throw new Error('WebGL 2.0 isn\'t supported in your browser');
        }
        Gl.canvas = canvas;
        this.initializeUnsafe();
        Engine.getLog().logString(LogLevel.INFO_1, 'WebGL initialized');
    }

    private static initializeUnsafe(): void {
        GlConstants.initialize();
        if (!GlConstants.COLOR_BUFFER_FLOAT_ENABLED) {
            throw new Error();
        }
        this.setGlDefaultStates();
        this.createBlackTexture2D();
        this.createWhiteTexture2D();
        this.createBlackTexture2DArray();
        this.createBlackCubeMapTexture();
    }

    private static setGlDefaultStates(): void {
        Gl.gl.pixelStorei(Gl.gl.UNPACK_COLORSPACE_CONVERSION_WEBGL, Gl.gl.NONE);
        Gl.setEnableCullFace(true);
        Gl.setCullFace(GlCullFace.BACK);
        Gl.setEnableBlend(true);
        Gl.setBlendFunc(GlBlendFunc.SRC_ALPHA, GlBlendFunc.ONE_MINUS_SRC_ALPHA);
        Gl.setEnableDepthTest(true);
    }

    private static createBlackTexture2D(): void {
        const texture = new GlTexture2D();
        texture.allocate(GlInternalFormat.RGBA8, vec2.fromValues(1, 1), false);
        texture.setMinificationFilter(GlMinificationFilter.NEAREST);
        texture.setMagnificationFilter(GlMagnificationFilter.NEAREST);
        Engine.getParameters().set(Engine.BLACK_TEXTURE_2D, texture);
    }

    private static createWhiteTexture2D(): void {
        const texture = new GlTexture2D();
        texture.allocate(GlInternalFormat.RGBA8, vec2.fromValues(1, 1), false);
        texture.storeFromBinary(new Uint8Array([255, 255, 255, 255]), vec2.fromValues(1, 1), GlFormat.RGBA, GlTextureDataType.UNSIGNED_BYTE)
        texture.setMinificationFilter(GlMinificationFilter.NEAREST);
        texture.setMagnificationFilter(GlMagnificationFilter.NEAREST);
        Engine.getParameters().set(Engine.WHITE_TEXTURE_2D, texture);
    }

    private static createBlackTexture2DArray(): void {
        const texture = new GlTexture2DArray();
        texture.allocate(GlInternalFormat.RGBA8, vec2.fromValues(1, 1), 1, false);
        texture.setMinificationFilter(GlMinificationFilter.NEAREST);
        texture.setMagnificationFilter(GlMagnificationFilter.NEAREST);
        Engine.getParameters().set(Engine.BLACK_TEXTURE_2D_ARRAY, texture);
    }

    private static createBlackCubeMapTexture(): void {
        const texture = new GlCubeMapTexture();
        texture.allocate(GlInternalFormat.RGBA8, vec2.fromValues(1, 1), false);
        texture.setMinificationFilter(GlMinificationFilter.NEAREST);
        texture.setMagnificationFilter(GlMagnificationFilter.NEAREST);
        Engine.getParameters().set(Engine.BLACK_CUBE_MAP_TEXTURE, texture);
    }

    public static get gl(): WebGL2RenderingContext {
        return Gl.context;
    }

    public static getCanvas(): HTMLCanvasElement {
        return Gl.canvas;
    }

    public static isFaceCulling(): boolean {
        return Gl.context.isEnabled(Gl.context.CULL_FACE);
    }

    public static setEnableCullFace(enable: boolean): void {
        if (enable) {
            Gl.context.enable(Gl.context.CULL_FACE);
        } else {
            Gl.context.disable(Gl.context.CULL_FACE);
        }
    }

    public static getCullFace(): GlCullFace {
        return GlCullFaceResolver.glToEnum(Gl.context.getParameter(Gl.context.CULL_FACE_MODE));
    }

    public static setCullFace(cullFace: GlCullFace): void {
        const glCullFace = GlCullFaceResolver.enumToGl(cullFace);
        Gl.context.cullFace(glCullFace);
    }

    public static isAlphaBlend(): boolean {
        return Gl.context.isEnabled(Gl.context.BLEND);
    }

    public static setEnableBlend(enable: boolean): void {
        if (enable) {
            Gl.context.enable(Gl.context.BLEND);
        } else {
            Gl.context.disable(Gl.context.BLEND);
        }
    }

    public static getBlendSourceFactor(): GlBlendFunc {
        return GlBlendFuncResolver.glToEnum(Gl.context.getParameter(Gl.context.BLEND_SRC_ALPHA));
    }

    public static getBlendDestinationFactor(): GlBlendFunc {
        return GlBlendFuncResolver.glToEnum(Gl.context.getParameter(Gl.context.BLEND_DST_ALPHA));
    }

    public static setBlendFunc(sFactor: GlBlendFunc, dFactor: GlBlendFunc): void {
        const glSFactor = GlBlendFuncResolver.enumToGl(sFactor);
        const glDFactor = GlBlendFuncResolver.enumToGl(dFactor);
        Gl.context.blendFunc(glSFactor, glDFactor);
    }

    public static isDepthTest(): boolean {
        return Gl.context.isEnabled(Gl.context.DEPTH_TEST);
    }

    public static setEnableDepthTest(enable: boolean): void {
        if (enable) {
            Gl.context.enable(Gl.context.DEPTH_TEST);
        } else {
            Gl.context.disable(Gl.context.DEPTH_TEST);
        }
    }

    public static getViewportSize(): vec2 {
        const viewport = Gl.gl.getParameter(Gl.gl.VIEWPORT);
        return vec2.fromValues(viewport[2], viewport[3]);
    }

    public static getViewportOffset(): vec2 {
        const viewport = Gl.gl.getParameter(Gl.gl.VIEWPORT);
        return vec2.fromValues(viewport[0], viewport[1]);
    }

    public static setViewport(size: vec2, offset: vec2): void {
        if (size[0] <= 0 || size[1] <= 0) {
            throw new Error();
        }
        Gl.gl.viewport(offset[0], offset[1], size[0], size[1]);
    }

    public static getClearColor(): vec4 {
        const clearColor: Float32Array = Gl.gl.getParameter(Gl.gl.COLOR_CLEAR_VALUE);
        return vec4.fromValues(clearColor[0], clearColor[1], clearColor[2], clearColor[3]);
    }

    public static setClearColor(color: vec4): void {
        Gl.gl.clearColor(color[0], color[1], color[2], color[3]);
    }

    public static clear(color: boolean, depth: boolean, stencil: boolean): void {
        const colorBit = color ? Gl.gl.COLOR_BUFFER_BIT : 0;
        const depthBit = depth ? Gl.gl.DEPTH_BUFFER_BIT : 0;
        const stencilBit = stencil ? Gl.gl.STENCIL_BUFFER_BIT : 0;
        Gl.gl.clear(colorBit | depthBit | stencilBit);
    }

    public static setMipmapPerformance(performance: GlPerformance): void {
        Gl.gl.hint(Gl.gl.GENERATE_MIPMAP_HINT, GlPerformanceResolver.enumToGl(performance))
    }

    public static setDerivativePerformance(performance: GlPerformance): void {
        Gl.gl.hint(Gl.gl.FRAGMENT_SHADER_DERIVATIVE_HINT, GlPerformanceResolver.enumToGl(performance))
    }

}