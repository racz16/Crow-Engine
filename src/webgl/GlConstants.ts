import { Gl } from './Gl';

export class GlConstants {
    //general
    private static _VERSION: string;
    private static _SHADING_LANGUAGE_VERSION: string;
    private static _VENDOR: string;
    private static _RENDERER: string;
    private static _UNMASKED_VENDOR: string;
    private static _UNMASKED_RENDERER: string;
    private static _COLOR_BUFFER_FLOAT_ENABLED: boolean;
    private static _FLOAT_BLEND_ENABLED: boolean;
    private static _TEXTURE_FLOAT_ENABLED: boolean;
    private static _TEXTURE_FLOAT_LINEAR_ENABLED: boolean;
    //shader
    private static _DEBUG_SHADERS_EXTENSION: WEBGL_debug_shaders;
    //buffer
    private static _MAX_UNIFORM_BUFFER_BINDINGS: number;
    private static _MAX_UNIFORM_BUFFER_BINDINGS_SAFE = 24;
    private static _MAX_VERTEX_ATTRIBS: number;
    private static _MAX_VERTEX_ATTRIBS_SAFE = 16;
    private static _MAX_UNIFORM_BLOCK_SIZE: number;
    private static _MAX_UNIFORM_BLOCK_SIZE_SAFE = 16384;
    //texture, RBO
    private static _MAX_TEXTURE_SIZE: number;
    private static _MAX_TEXTURE_SIZE_SAFE = 2048;
    private static _MAX_CUBE_MAP_TEXTURE_SIZE: number;
    private static _MAX_CUBE_MAP_TEXTURE_SIZE_SAFE = 2048;
    private static _MAX_SAMPLES: number;
    private static _MAX_SAMPLES_SAFE = 4;
    private static _MAX_ARRAY_TEXTURE_LAYERS: number;
    private static _MAX_ARRAY_TEXTURE_LAYERS_SAFE = 256;
    private static _ANISOTROPIC_FILTER_EXTENSION: EXT_texture_filter_anisotropic;
    private static _ANISOTROPIC_FILTER_ENABLED: boolean;
    private static _MAX_ANISOTROPIC_FILTER_LEVEL: number;
    private static _MAX_RENDERBUFFER_SIZE: number;
    private static _MAX_RENDERBUFFER_SIZE_SAFE = 2048;
    private static _MAX_COMBINED_TEXTURE_IMAGE_UNITS: number;
    private static _MAX_COMBINED_TEXTURE_IMAGE_UNITS_SAFE = 32;
    //FBO
    public static _MAX_COLOR_ATTACHMENTS: number;
    public static _MAX_COLOR_ATTACHMENTS_SAFE = 4;
    public static _MAX_DRAW_BUFFERS: number;
    public static _MAX_DRAW_BUFFERS_SAFE = 4;

    private constructor() { }

    public static initialize(): void {
        const gl = Gl.gl;
        this.initializeGeneral(gl);
        this.initializeShadersAndTextures(gl);
        this.initializeBuffer(gl);
        this.initializeTextureRbo(gl);
        this.initializeFbo(gl);
    }

    private static initializeGeneral(gl: WebGL2RenderingContext): void {
        this._VERSION = gl.getParameter(gl.VERSION);
        this._SHADING_LANGUAGE_VERSION = gl.getParameter(gl.SHADING_LANGUAGE_VERSION);
        this._VENDOR = gl.getParameter(gl.VENDOR);
        this._RENDERER = gl.getParameter(gl.RENDERER);
        const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
        this._UNMASKED_VENDOR = debugInfo ? gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL) : null;
        this._UNMASKED_RENDERER = debugInfo ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) : null;
    }

    private static initializeShadersAndTextures(gl: WebGL2RenderingContext): void {
        this._DEBUG_SHADERS_EXTENSION = gl.getExtension('WEBGL_debug_shaders');
        this._COLOR_BUFFER_FLOAT_ENABLED = !!gl.getExtension('EXT_color_buffer_float');
        this._FLOAT_BLEND_ENABLED = !!gl.getExtension('EXT_float_blend');
        this._TEXTURE_FLOAT_ENABLED = !!gl.getExtension('OES_texture_float');
        this._TEXTURE_FLOAT_LINEAR_ENABLED = !!gl.getExtension('OES_texture_float_linear');
    }

    private static initializeBuffer(gl: WebGL2RenderingContext): void {
        this._MAX_UNIFORM_BUFFER_BINDINGS = gl.getParameter(gl.MAX_UNIFORM_BUFFER_BINDINGS);
        this._MAX_VERTEX_ATTRIBS = gl.getParameter(gl.MAX_VERTEX_ATTRIBS);
        this._MAX_UNIFORM_BLOCK_SIZE = gl.getParameter(gl.MAX_UNIFORM_BLOCK_SIZE);
    }

    private static initializeTextureRbo(gl: WebGL2RenderingContext): void {
        this._MAX_SAMPLES = gl.getParameter(gl.MAX_SAMPLES);
        this._MAX_TEXTURE_SIZE = gl.getParameter(gl.MAX_TEXTURE_SIZE);
        this._MAX_CUBE_MAP_TEXTURE_SIZE = gl.getParameter(gl.MAX_CUBE_MAP_TEXTURE_SIZE);
        this._MAX_RENDERBUFFER_SIZE = gl.getParameter(gl.MAX_RENDERBUFFER_SIZE);
        this._MAX_ARRAY_TEXTURE_LAYERS = gl.getParameter(gl.MAX_ARRAY_TEXTURE_LAYERS);
        this._ANISOTROPIC_FILTER_EXTENSION = gl.getExtension('EXT_texture_filter_anisotropic');
        this._ANISOTROPIC_FILTER_ENABLED = !!this._ANISOTROPIC_FILTER_EXTENSION;
        this._MAX_ANISOTROPIC_FILTER_LEVEL = this._ANISOTROPIC_FILTER_EXTENSION ? gl.getParameter(this._ANISOTROPIC_FILTER_EXTENSION.MAX_TEXTURE_MAX_ANISOTROPY_EXT) : 0;
        this._MAX_COMBINED_TEXTURE_IMAGE_UNITS = gl.getParameter(gl.MAX_COMBINED_TEXTURE_IMAGE_UNITS);
    }

    private static initializeFbo(gl: WebGL2RenderingContext): void {
        this._MAX_COLOR_ATTACHMENTS = gl.getParameter(gl.MAX_COLOR_ATTACHMENTS);
        this._MAX_DRAW_BUFFERS = gl.getParameter(gl.MAX_DRAW_BUFFERS);
    }

    //general
    public static get VERSION(): string {
        return this._VERSION;
    }

    public static get SHADING_LANGUAGE_VERSION(): string {
        return this._SHADING_LANGUAGE_VERSION;
    }

    public static get VENDOR(): string {
        return this._VENDOR;
    }

    public static get RENDERER(): string {
        return this._RENDERER;
    }

    public static get UNMASKED_VENDOR(): string {
        return this._UNMASKED_VENDOR;
    }

    public static get UNMASKED_RENDERER(): string {
        return this._UNMASKED_RENDERER;
    }

    //texture
    public static get COLOR_BUFFER_FLOAT_ENABLED(): boolean {
        return this._COLOR_BUFFER_FLOAT_ENABLED;
    }

    public static get FLOAT_BLEND_ENABLED(): boolean {
        return this._FLOAT_BLEND_ENABLED;
    }

    public static get TEXTURE_FLOAT_ENABLED(): boolean {
        return this._TEXTURE_FLOAT_ENABLED;
    }

    public static get TEXTURE_FLOAT_LINEAR(): boolean {
        return this._TEXTURE_FLOAT_LINEAR_ENABLED;
    }

    //shader
    public static get DEBUG_SHADERS_EXTENSION(): WEBGL_debug_shaders {
        return this._DEBUG_SHADERS_EXTENSION;
    }

    //buffer
    public static get MAX_UNIFORM_BUFFER_BINDINGS(): number {
        return this._MAX_UNIFORM_BUFFER_BINDINGS;
    }

    public static get MAX_UNIFORM_BUFFER_BINDINGS_SAFE(): number {
        return this._MAX_UNIFORM_BUFFER_BINDINGS_SAFE;
    }

    public static get MAX_VERTEX_ATTRIBS(): number {
        return this._MAX_VERTEX_ATTRIBS;
    }

    public static get MAX_VERTEX_ATTRIBS_SAFE(): number {
        return this._MAX_VERTEX_ATTRIBS_SAFE;
    }

    public static get MAX_UNIFORM_BLOCK_SIZE(): number {
        return this._MAX_UNIFORM_BLOCK_SIZE;
    }

    public static get MAX_UNIFORM_BLOCK_SIZE_SAFE(): number {
        return this._MAX_UNIFORM_BLOCK_SIZE_SAFE;
    }

    //texture, rbo
    public static get MAX_TEXTURE_SIZE(): number {
        return this._MAX_TEXTURE_SIZE;
    }

    public static get MAX_TEXTURE_SIZE_SAFE(): number {
        return this._MAX_TEXTURE_SIZE_SAFE;
    }

    public static get MAX_CUBE_MAP_TEXTURE_SIZE(): number {
        return this._MAX_CUBE_MAP_TEXTURE_SIZE;
    }

    public static get MAX_CUBE_MAP_TEXTURE_SIZE_SAFE(): number {
        return this._MAX_CUBE_MAP_TEXTURE_SIZE_SAFE;
    }

    public static get MAX_ARRAY_TEXTURE_LAYERS(): number {
        return this._MAX_ARRAY_TEXTURE_LAYERS;
    }

    public static get MAX_ARRAY_TEXTURE_LAYERS_SAFE(): number {
        return this._MAX_ARRAY_TEXTURE_LAYERS_SAFE;
    }

    public static get MAX_SAMPLES(): number {
        return this._MAX_SAMPLES;
    }

    public static get MAX_SAMPLES_SAFE(): number {
        return this._MAX_SAMPLES_SAFE;
    }

    public static get MAX_RENDERBUFFER_SIZE(): number {
        return this._MAX_RENDERBUFFER_SIZE;
    }

    public static get MAX_RENDERBUFFER_SIZE_SAFE(): number {
        return this._MAX_RENDERBUFFER_SIZE_SAFE;
    }

    public static get MAX_COMBINED_TEXTURE_IMAGE_UNITS(): number {
        return this._MAX_COMBINED_TEXTURE_IMAGE_UNITS;
    }

    public static get MAX_COMBINED_TEXTURE_IMAGE_UNITS_SAFE(): number {
        return this._MAX_COMBINED_TEXTURE_IMAGE_UNITS_SAFE;
    }

    public static get ANISOTROPIC_FILTER_EXTENSION(): EXT_texture_filter_anisotropic {
        return this._ANISOTROPIC_FILTER_EXTENSION;
    }

    public static get ANISOTROPIC_FILTER_ENABLED(): boolean {
        return this._ANISOTROPIC_FILTER_ENABLED;
    }

    public static get MAX_ANISOTROPIC_FILTER_LEVEL(): number {
        return this._MAX_ANISOTROPIC_FILTER_LEVEL;
    }

    //fbo
    public static get MAX_COLOR_ATTACHMENTS(): number {
        return this._MAX_COLOR_ATTACHMENTS;
    }

    public static get MAX_COLOR_ATTACHMENTS_SAFE(): number {
        return this._MAX_COLOR_ATTACHMENTS_SAFE;
    }

    public static get MAX_DRAW_BUFFERS(): number {
        return this._MAX_DRAW_BUFFERS;
    }

    public static get MAX_DRAW_BUFFERS_SAFE(): number {
        return this._MAX_DRAW_BUFFERS_SAFE;
    }

}
