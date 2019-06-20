import { BlendFunc, BlendFuncResolver } from "./enum/BlendFunc";
import { CullFace, CullFaceResolver } from "./enum/CullFace";
import { GlConstants } from "./GlConstants";
import { vec2 } from "gl-matrix";

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
        GlConstants.initialize();
        Gl.setEnableCullFace(true);
        Gl.setCullFace(CullFace.BACK);
        Gl.setEnableBlend(true);
        Gl.setBlendFunc(BlendFunc.SRC_ALPHA, BlendFunc.ONE_MINUS_SRC_ALPHA);
        Gl.setEnableDepthTest(true);
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

    public static getCullFace(): CullFace {
        return CullFaceResolver.glToEnum(Gl.context.getParameter(Gl.context.CULL_FACE_MODE));
    }

    public static setCullFace(cullFace: CullFace): void {
        const glCullFace = CullFaceResolver.enumToGl(cullFace);
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

    public static getBlendSourceFactor(): BlendFunc {
        return BlendFuncResolver.glToEnum(Gl.context.getParameter(Gl.context.BLEND_SRC_ALPHA));
    }

    public static getBlendDestinationFactor(): BlendFunc {
        return BlendFuncResolver.glToEnum(Gl.context.getParameter(Gl.context.BLEND_DST_ALPHA));
    }

    public static setBlendFunc(sFactor: BlendFunc, dFactor: BlendFunc): void {
        const glSFactor = BlendFuncResolver.enumToGl(sFactor);
        const glDFactor = BlendFuncResolver.enumToGl(dFactor);
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

    public static setViewport(size: vec2, offset: vec2): void {
        if (size[0] <= 0 || size[1] <= 0) {
            throw new Error();
        }
        Gl.gl.viewport(offset[0], offset[1], size[0], size[1]);
    }

    public static clear(color: boolean, depth: boolean, stencil: boolean): void {
        const colorBit = color ? Gl.gl.COLOR_BUFFER_BIT : 0;
        const depthBit = depth ? Gl.gl.DEPTH_BUFFER_BIT : 0;
        const stencilBit = stencil ? Gl.gl.STENCIL_BUFFER_BIT : 0;
        Gl.gl.clear(colorBit | depthBit | stencilBit);
    }

}