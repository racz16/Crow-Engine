import { Gl } from "./Gl";
import { Log } from "../utility/log/Log";
import { LogLevel } from "../utility/log/LogLevel";
import { LogType } from "../utility/log/LogType";

export class GlConstants {
    //general
    private static _VERSION: string;
    private static _VENDOR: string;
    private static _RENDERER: string;
    //buffer
    private static _MAX_UNIFORM_BUFFER_BINDINGS: number;
    private static _MAX_UNIFORM_BUFFER_BINDINGS_SAFE = 24;
    private static _MAX_VERTEX_ATTRIBS: number;
    private static _MAX_VERTEX_ATTRIBS_SAFE = 16;
    private static _MAX_UNIFORM_BLOCK_SIZE: number;
    private static _MAX_UNIFORM_BLOCK_SIZE_SAFE = 16384;
    //texture, RBO
    private static _MAX_TEXTURE_SIZE;
    private static _MAX_TEXTURE_SIZE_SAFE = 2048;
    private static _MAX_SAMPLES;
    private static _MAX_SAMPLES_SAFE = 4;
    private static _ANISOTROPIC_FILTER_EXTENSION: EXT_texture_filter_anisotropic;
    private static _ANISOTROPIC_FILTER_ENABLED: boolean;
    private static _MAX_ANISOTROPIC_FILTER_LEVEL;
    private static _MAX_RENDERBUFFER_SIZE;
    private static _MAX_RENDERBUFFER_SIZE_SAFE = 2048;
    private static _MAX_COMBINED_TEXTURE_IMAGE_UNITS;
    private static _MAX_COMBINED_TEXTURE_IMAGE_UNITS_SAFE = 32;
    //FBO
    public static _MAX_COLOR_ATTACHMENTS;
    public static _MAX_COLOR_ATTACHMENTS_SAFE = 4;
    public static _MAX_DRAW_BUFFERS;
    public static _MAX_DRAW_BUFFERS_SAFE = 4;

    private constructor() { }

    public static initialize(): void {
        const gl = Gl.gl;
        //generalG
        GlConstants._VERSION = gl.getParameter(gl.VERSION);
        GlConstants._VENDOR = gl.getParameter(gl.VENDOR);
        GlConstants._RENDERER = gl.getParameter(gl.RENDERER);
        //buffer
        GlConstants._MAX_UNIFORM_BUFFER_BINDINGS = gl.getParameter(gl.MAX_UNIFORM_BUFFER_BINDINGS);
        GlConstants._MAX_VERTEX_ATTRIBS = gl.getParameter(gl.MAX_VERTEX_ATTRIBS);
        GlConstants._MAX_UNIFORM_BLOCK_SIZE = gl.getParameter(gl.MAX_UNIFORM_BLOCK_SIZE);
        //texture, RBO
        GlConstants._MAX_SAMPLES = gl.getParameter(gl.MAX_SAMPLES);
        GlConstants._MAX_TEXTURE_SIZE = gl.getParameter(gl.MAX_TEXTURE_SIZE);
        GlConstants._MAX_RENDERBUFFER_SIZE = gl.getParameter(gl.MAX_RENDERBUFFER_SIZE);
        GlConstants._ANISOTROPIC_FILTER_EXTENSION = gl.getExtension('EXT_texture_filter_anisotropic');
        GlConstants._ANISOTROPIC_FILTER_ENABLED = !!GlConstants._ANISOTROPIC_FILTER_EXTENSION;
        GlConstants._MAX_ANISOTROPIC_FILTER_LEVEL = GlConstants._ANISOTROPIC_FILTER_EXTENSION ? gl.getParameter(GlConstants._ANISOTROPIC_FILTER_EXTENSION.MAX_TEXTURE_MAX_ANISOTROPY_EXT) : 0;
        GlConstants._MAX_COMBINED_TEXTURE_IMAGE_UNITS = gl.getParameter(gl.MAX_COMBINED_TEXTURE_IMAGE_UNITS);
        //FBO
        GlConstants._MAX_COLOR_ATTACHMENTS = gl.getParameter(gl.MAX_COLOR_ATTACHMENTS);
        GlConstants._MAX_DRAW_BUFFERS = gl.getParameter(gl.MAX_DRAW_BUFFERS);
        Log.logString(LogLevel.INFO_3, LogType.RESOURCES, 'WebGL constants initialized');
    }

    //general
    public static get VERSION(): string {
        return GlConstants._VERSION;
    }

    public static get VENDOR(): string {
        return GlConstants._VENDOR;
    }

    public static get RENDERER(): string {
        return GlConstants._RENDERER;
    }

    //buffer
    public static get MAX_UNIFORM_BUFFER_BINDINGS(): number {
        return GlConstants._MAX_UNIFORM_BUFFER_BINDINGS;
    }

    public static get MAX_UNIFORM_BUFFER_BINDINGS_SAFE(): number {
        return GlConstants._MAX_UNIFORM_BUFFER_BINDINGS_SAFE;
    }

    public static get MAX_VERTEX_ATTRIBS(): number {
        return GlConstants._MAX_VERTEX_ATTRIBS;
    }

    public static get MAX_VERTEX_ATTRIBS_SAFE(): number {
        return GlConstants._MAX_VERTEX_ATTRIBS_SAFE;
    }

    public static get MAX_UNIFORM_BLOCK_SIZE(): number {
        return GlConstants._MAX_UNIFORM_BLOCK_SIZE;
    }

    public static get MAX_UNIFORM_BLOCK_SIZE_SAFE(): number {
        return GlConstants._MAX_UNIFORM_BLOCK_SIZE_SAFE;
    }

    //texture, rbo
    public static get MAX_TEXTURE_SIZE(): number {
        return GlConstants._MAX_TEXTURE_SIZE;
    }

    public static get MAX_TEXTURE_SIZE_SAFE(): number {
        return GlConstants._MAX_TEXTURE_SIZE_SAFE;
    }

    public static get MAX_SAMPLES(): number {
        return GlConstants._MAX_SAMPLES;
    }

    public static get MAX_SAMPLES_SAFE(): number {
        return GlConstants._MAX_SAMPLES_SAFE;
    }

    public static get MAX_RENDERBUFFER_SIZE(): number {
        return GlConstants._MAX_RENDERBUFFER_SIZE;
    }

    public static get MAX_RENDERBUFFER_SIZE_SAFE(): number {
        return GlConstants._MAX_RENDERBUFFER_SIZE_SAFE;
    }

    public static get MAX_COMBINED_TEXTURE_IMAGE_UNITS(): number {
        return GlConstants._MAX_COMBINED_TEXTURE_IMAGE_UNITS;
    }

    public static get MAX_COMBINED_TEXTURE_IMAGE_UNITS_SAFE(): number {
        return GlConstants._MAX_COMBINED_TEXTURE_IMAGE_UNITS_SAFE;
    }

    public static get ANISOTROPIC_FILTER_EXTENSION(): EXT_texture_filter_anisotropic {
        return GlConstants._ANISOTROPIC_FILTER_EXTENSION;
    }

    public static get ANISOTROPIC_FILTER_ENABLED(): boolean {
        return GlConstants._ANISOTROPIC_FILTER_ENABLED;
    }

    public static get MAX_ANISOTROPIC_FILTER_LEVEL(): number {
        return GlConstants._MAX_ANISOTROPIC_FILTER_LEVEL;
    }

    //fbo
    public static get MAX_COLOR_ATTACHMENTS(): number {
        return GlConstants._MAX_COLOR_ATTACHMENTS;
    }

    public static get MAX_COLOR_ATTACHMENTS_SAFE(): number {
        return GlConstants._MAX_COLOR_ATTACHMENTS_SAFE;
    }

    public static get MAX_DRAW_BUFFERS(): number {
        return GlConstants._MAX_DRAW_BUFFERS;
    }

    public static get MAX_DRAW_BUFFERS_SAFE(): number {
        return GlConstants._MAX_DRAW_BUFFERS_SAFE;
    }

}
