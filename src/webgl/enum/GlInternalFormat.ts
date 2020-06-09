import { GlFboAttachmentSlot } from './GlFboAttachmentSlot';
import { Gl } from '../Gl';

export enum GlInternalFormat {
    R8,
    RG8,
    RGB8,
    RGB565,
    RGBA4,
    RGB5_A1,
    RGBA8,
    RGB10_A2,
    RGB10_A2UI,
    SRGB8,
    SRGB8_A8,
    R16F,
    RG16F,
    RGB16F,
    RGBA16F,
    R32F,
    RG32F,
    RGB32F,
    RGBA32F,
    R11F_G11F_B10F,
    RGB9_E5,
    R8I,
    R8UI,
    R16I,
    R16UI,
    R32I,
    R32UI,
    RG8I,
    RG8UI,
    RG16I,
    RG16UI,
    RG32I,
    RG32UI,
    RGB8I,
    RGB8UI,
    RGB16I,
    RGB16UI,
    RGB32I,
    RGB32UI,
    RGBA8I,
    RGBA8UI,
    RGBA16I,
    RGBA16UI,
    RGBA32I,
    RGBA32UI,
    DEPTH32F,
    DEPTH24,
    DEPTH16,
    DEPTH32F_STENCIL8,
    DEPTH24_STENCIL8,
    STENCIL8,
}

export class GlInternalFormatResolver {

    public static enumToGl(internalFormat: GlInternalFormat): GlInternalFormatInfo {
        const gl = Gl.gl;
        switch (internalFormat) {
            case GlInternalFormat.R8: return new GlInternalFormatInfo(gl.R8, 1, 8, GlFboAttachmentSlot.COLOR);
            case GlInternalFormat.RG8: return new GlInternalFormatInfo(gl.RG8, 2, 16, GlFboAttachmentSlot.COLOR);
            case GlInternalFormat.RGB8: return new GlInternalFormatInfo(gl.RGB8, 3, 24, GlFboAttachmentSlot.COLOR);
            case GlInternalFormat.RGB565: return new GlInternalFormatInfo(gl.RGB565, 3, 16, GlFboAttachmentSlot.COLOR);
            case GlInternalFormat.RGBA4: return new GlInternalFormatInfo(gl.RGBA4, 4, 16, GlFboAttachmentSlot.COLOR);
            case GlInternalFormat.RGB5_A1: return new GlInternalFormatInfo(gl.RGB5_A1, 4, 16, GlFboAttachmentSlot.COLOR);
            case GlInternalFormat.RGBA8: return new GlInternalFormatInfo(gl.RGBA8, 4, 32, GlFboAttachmentSlot.COLOR);
            case GlInternalFormat.RGB10_A2: return new GlInternalFormatInfo(gl.RGB10_A2, 4, 32, GlFboAttachmentSlot.COLOR);
            case GlInternalFormat.RGB10_A2UI: return new GlInternalFormatInfo(gl.RGB10_A2UI, 4, 32, GlFboAttachmentSlot.COLOR);
            case GlInternalFormat.SRGB8: return new GlInternalFormatInfo(gl.SRGB8, 3, 24, GlFboAttachmentSlot.COLOR);
            case GlInternalFormat.SRGB8_A8: return new GlInternalFormatInfo(gl.SRGB8_ALPHA8, 4, 32, GlFboAttachmentSlot.COLOR);
            case GlInternalFormat.R16F: return new GlInternalFormatInfo(gl.R16F, 1, 16, GlFboAttachmentSlot.COLOR);
            case GlInternalFormat.RG16F: return new GlInternalFormatInfo(gl.RG16F, 2, 32, GlFboAttachmentSlot.COLOR);
            case GlInternalFormat.RGB16F: return new GlInternalFormatInfo(gl.RGB16F, 3, 48, GlFboAttachmentSlot.COLOR);
            case GlInternalFormat.RGBA16F: return new GlInternalFormatInfo(gl.RGBA16F, 4, 64, GlFboAttachmentSlot.COLOR);
            case GlInternalFormat.R32F: return new GlInternalFormatInfo(gl.R32F, 1, 32, GlFboAttachmentSlot.COLOR);
            case GlInternalFormat.RG32F: return new GlInternalFormatInfo(gl.RG32F, 2, 64, GlFboAttachmentSlot.COLOR);
            case GlInternalFormat.RGB32F: return new GlInternalFormatInfo(gl.RGB32F, 3, 96, GlFboAttachmentSlot.COLOR);
            case GlInternalFormat.RGBA32F: return new GlInternalFormatInfo(gl.RGBA32F, 4, 128, GlFboAttachmentSlot.COLOR);
            case GlInternalFormat.R11F_G11F_B10F: return new GlInternalFormatInfo(gl.R11F_G11F_B10F, 3, 32, GlFboAttachmentSlot.COLOR);
            case GlInternalFormat.RGB9_E5: return new GlInternalFormatInfo(gl.RGB9_E5, 4, 32, GlFboAttachmentSlot.COLOR);
            case GlInternalFormat.R8I: return new GlInternalFormatInfo(gl.R8I, 1, 8, GlFboAttachmentSlot.COLOR);
            case GlInternalFormat.R8UI: return new GlInternalFormatInfo(gl.R8UI, 1, 8, GlFboAttachmentSlot.COLOR);
            case GlInternalFormat.R16I: return new GlInternalFormatInfo(gl.R16I, 1, 16, GlFboAttachmentSlot.COLOR);
            case GlInternalFormat.R16UI: return new GlInternalFormatInfo(gl.R16UI, 1, 16, GlFboAttachmentSlot.COLOR);
            case GlInternalFormat.R32I: return new GlInternalFormatInfo(gl.R32I, 1, 32, GlFboAttachmentSlot.COLOR);
            case GlInternalFormat.R32UI: return new GlInternalFormatInfo(gl.R32UI, 1, 32, GlFboAttachmentSlot.COLOR);
            case GlInternalFormat.RG8I: return new GlInternalFormatInfo(gl.RG8I, 2, 16, GlFboAttachmentSlot.COLOR);
            case GlInternalFormat.RG8UI: return new GlInternalFormatInfo(gl.RG8UI, 2, 16, GlFboAttachmentSlot.COLOR);
            case GlInternalFormat.RG16I: return new GlInternalFormatInfo(gl.RG16I, 2, 32, GlFboAttachmentSlot.COLOR);
            case GlInternalFormat.RG16UI: return new GlInternalFormatInfo(gl.RG16UI, 2, 32, GlFboAttachmentSlot.COLOR);
            case GlInternalFormat.RG32I: return new GlInternalFormatInfo(gl.RG32I, 2, 64, GlFboAttachmentSlot.COLOR);
            case GlInternalFormat.RG32UI: return new GlInternalFormatInfo(gl.RG32UI, 2, 64, GlFboAttachmentSlot.COLOR);
            case GlInternalFormat.RGB8I: return new GlInternalFormatInfo(gl.RGB8I, 3, 24, GlFboAttachmentSlot.COLOR);
            case GlInternalFormat.RGB8UI: return new GlInternalFormatInfo(gl.RGB8UI, 3, 24, GlFboAttachmentSlot.COLOR);
            case GlInternalFormat.RGB16I: return new GlInternalFormatInfo(gl.RGB16I, 3, 48, GlFboAttachmentSlot.COLOR);
            case GlInternalFormat.RGB16UI: return new GlInternalFormatInfo(gl.RGB16UI, 3, 48, GlFboAttachmentSlot.COLOR);
            case GlInternalFormat.RGB32I: return new GlInternalFormatInfo(gl.RGB32I, 3, 96, GlFboAttachmentSlot.COLOR);
            case GlInternalFormat.RGB32UI: return new GlInternalFormatInfo(gl.RGB32UI, 3, 96, GlFboAttachmentSlot.COLOR);
            case GlInternalFormat.RGBA8I: return new GlInternalFormatInfo(gl.R8, 4, 32, GlFboAttachmentSlot.COLOR);
            case GlInternalFormat.RGBA8UI: return new GlInternalFormatInfo(gl.RGBA8UI, 4, 32, GlFboAttachmentSlot.COLOR);
            case GlInternalFormat.RGBA16I: return new GlInternalFormatInfo(gl.RGBA16I, 4, 64, GlFboAttachmentSlot.COLOR);
            case GlInternalFormat.RGBA16UI: return new GlInternalFormatInfo(gl.RGBA16UI, 4, 64, GlFboAttachmentSlot.COLOR);
            case GlInternalFormat.RGBA32I: return new GlInternalFormatInfo(gl.RGBA32I, 4, 128, GlFboAttachmentSlot.COLOR);
            case GlInternalFormat.RGBA32UI: return new GlInternalFormatInfo(gl.RGBA32UI, 4, 128, GlFboAttachmentSlot.COLOR);
            case GlInternalFormat.DEPTH32F: return new GlInternalFormatInfo(gl.DEPTH_COMPONENT32F, 1, 32, GlFboAttachmentSlot.DEPTH);
            case GlInternalFormat.DEPTH24: return new GlInternalFormatInfo(gl.DEPTH_COMPONENT24, 1, 24, GlFboAttachmentSlot.DEPTH);
            case GlInternalFormat.DEPTH16: return new GlInternalFormatInfo(gl.DEPTH_COMPONENT16, 1, 16, GlFboAttachmentSlot.DEPTH);
            case GlInternalFormat.DEPTH32F_STENCIL8: return new GlInternalFormatInfo(gl.DEPTH32F_STENCIL8, 2, 40, GlFboAttachmentSlot.DEPTH_STENCIL);
            case GlInternalFormat.DEPTH24_STENCIL8: return new GlInternalFormatInfo(gl.DEPTH24_STENCIL8, 2, 32, GlFboAttachmentSlot.DEPTH_STENCIL);
            case GlInternalFormat.STENCIL8: return new GlInternalFormatInfo(gl.STENCIL_INDEX8, 1, 8, GlFboAttachmentSlot.STENCIL);
            default: throw new Error('Invalid enum GlInternalFormat');
        }
    }

}

export class GlInternalFormatInfo {

    private readonly code: number;
    private readonly colorChannelCount: number;
    private readonly bitDepth: number;
    private readonly attachmentSlot: number;

    public constructor(code: number, colorChannelCount: number, bitDepth: number, attachmentSlot: GlFboAttachmentSlot) {
        this.code = code;
        this.colorChannelCount = colorChannelCount;
        this.bitDepth = bitDepth;
        this.attachmentSlot = attachmentSlot;
    }

    public getCode(): number {
        return this.code;
    }

    public getColorChannelCount(): number {
        return this.colorChannelCount
    }

    public getBitDepth(): number {
        return this.bitDepth
    }

    public getAttachmentSlot(): number {
        return this.attachmentSlot
    }

}