import { FboAttachmentSlot } from './FboAttachmentSlot';
import { Gl } from '../Gl';

export enum InternalFormat {
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

export class InternalFormatResolver {

    public static enumToGl(internalFOrmat: InternalFormat): GlInternalFormat {
        const gl = Gl.gl;
        switch (internalFOrmat) {
            case InternalFormat.R8: return new GlInternalFormat(gl.R8, 1, 8, FboAttachmentSlot.COLOR);
            case InternalFormat.RG8: return new GlInternalFormat(gl.RG8, 2, 16, FboAttachmentSlot.COLOR);
            case InternalFormat.RGB8: return new GlInternalFormat(gl.RGB8, 3, 24, FboAttachmentSlot.COLOR);
            case InternalFormat.RGB565: return new GlInternalFormat(gl.RGB565, 3, 16, FboAttachmentSlot.COLOR);
            case InternalFormat.RGBA4: return new GlInternalFormat(gl.RGBA4, 4, 16, FboAttachmentSlot.COLOR);
            case InternalFormat.RGB5_A1: return new GlInternalFormat(gl.RGB5_A1, 4, 16, FboAttachmentSlot.COLOR);
            case InternalFormat.RGBA8: return new GlInternalFormat(gl.RGBA8, 4, 32, FboAttachmentSlot.COLOR);
            case InternalFormat.RGB10_A2: return new GlInternalFormat(gl.RGB10_A2, 4, 32, FboAttachmentSlot.COLOR);
            case InternalFormat.RGB10_A2UI: return new GlInternalFormat(gl.RGB10_A2UI, 4, 32, FboAttachmentSlot.COLOR);
            case InternalFormat.SRGB8: return new GlInternalFormat(gl.SRGB8, 3, 24, FboAttachmentSlot.COLOR);
            case InternalFormat.SRGB8_A8: return new GlInternalFormat(gl.SRGB8_ALPHA8, 4, 32, FboAttachmentSlot.COLOR);
            case InternalFormat.R16F: return new GlInternalFormat(gl.R16F, 1, 16, FboAttachmentSlot.COLOR);
            case InternalFormat.RG16F: return new GlInternalFormat(gl.RG16F, 2, 32, FboAttachmentSlot.COLOR);
            case InternalFormat.RGB16F: return new GlInternalFormat(gl.RGB16F, 3, 48, FboAttachmentSlot.COLOR);
            case InternalFormat.RGBA16F: return new GlInternalFormat(gl.RGBA16F, 4, 64, FboAttachmentSlot.COLOR);
            case InternalFormat.R32F: return new GlInternalFormat(gl.R32F, 1, 32, FboAttachmentSlot.COLOR);
            case InternalFormat.RG32F: return new GlInternalFormat(gl.RG32F, 2, 64, FboAttachmentSlot.COLOR);
            case InternalFormat.RGB32F: return new GlInternalFormat(gl.RGB32F, 3, 96, FboAttachmentSlot.COLOR);
            case InternalFormat.RGBA32F: return new GlInternalFormat(gl.RGBA32F, 4, 128, FboAttachmentSlot.COLOR);
            case InternalFormat.R11F_G11F_B10F: return new GlInternalFormat(gl.R11F_G11F_B10F, 3, 32, FboAttachmentSlot.COLOR);
            case InternalFormat.RGB9_E5: return new GlInternalFormat(gl.RGB9_E5, 4, 32, FboAttachmentSlot.COLOR);
            case InternalFormat.R8I: return new GlInternalFormat(gl.R8I, 1, 8, FboAttachmentSlot.COLOR);
            case InternalFormat.R8UI: return new GlInternalFormat(gl.R8UI, 1, 8, FboAttachmentSlot.COLOR);
            case InternalFormat.R16I: return new GlInternalFormat(gl.R16I, 1, 16, FboAttachmentSlot.COLOR);
            case InternalFormat.R16UI: return new GlInternalFormat(gl.R16UI, 1, 16, FboAttachmentSlot.COLOR);
            case InternalFormat.R32I: return new GlInternalFormat(gl.R32I, 1, 32, FboAttachmentSlot.COLOR);
            case InternalFormat.R32UI: return new GlInternalFormat(gl.R32UI, 1, 32, FboAttachmentSlot.COLOR);
            case InternalFormat.RG8I: return new GlInternalFormat(gl.RG8I, 2, 16, FboAttachmentSlot.COLOR);
            case InternalFormat.RG8UI: return new GlInternalFormat(gl.RG8UI, 2, 16, FboAttachmentSlot.COLOR);
            case InternalFormat.RG16I: return new GlInternalFormat(gl.RG16I, 2, 32, FboAttachmentSlot.COLOR);
            case InternalFormat.RG16UI: return new GlInternalFormat(gl.RG16UI, 2, 32, FboAttachmentSlot.COLOR);
            case InternalFormat.RG32I: return new GlInternalFormat(gl.RG32I, 2, 64, FboAttachmentSlot.COLOR);
            case InternalFormat.RG32UI: return new GlInternalFormat(gl.RG32UI, 2, 64, FboAttachmentSlot.COLOR);
            case InternalFormat.RGB8I: return new GlInternalFormat(gl.RGB8I, 3, 24, FboAttachmentSlot.COLOR);
            case InternalFormat.RGB8UI: return new GlInternalFormat(gl.RGB8UI, 3, 24, FboAttachmentSlot.COLOR);
            case InternalFormat.RGB16I: return new GlInternalFormat(gl.RGB16I, 3, 48, FboAttachmentSlot.COLOR);
            case InternalFormat.RGB16UI: return new GlInternalFormat(gl.RGB16UI, 3, 48, FboAttachmentSlot.COLOR);
            case InternalFormat.RGB32I: return new GlInternalFormat(gl.RGB32I, 3, 96, FboAttachmentSlot.COLOR);
            case InternalFormat.RGB32UI: return new GlInternalFormat(gl.RGB32UI, 3, 96, FboAttachmentSlot.COLOR);
            case InternalFormat.RGBA8I: return new GlInternalFormat(gl.R8, 4, 32, FboAttachmentSlot.COLOR);
            case InternalFormat.RGBA8UI: return new GlInternalFormat(gl.RGBA8UI, 4, 32, FboAttachmentSlot.COLOR);
            case InternalFormat.RGBA16I: return new GlInternalFormat(gl.RGBA16I, 4, 64, FboAttachmentSlot.COLOR);
            case InternalFormat.RGBA16UI: return new GlInternalFormat(gl.RGBA16UI, 4, 64, FboAttachmentSlot.COLOR);
            case InternalFormat.RGBA32I: return new GlInternalFormat(gl.RGBA32I, 4, 128, FboAttachmentSlot.COLOR);
            case InternalFormat.RGBA32UI: return new GlInternalFormat(gl.RGBA32UI, 4, 128, FboAttachmentSlot.COLOR);
            case InternalFormat.DEPTH32F: return new GlInternalFormat(gl.DEPTH_COMPONENT32F, 1, 32, FboAttachmentSlot.DEPTH);
            case InternalFormat.DEPTH24: return new GlInternalFormat(gl.DEPTH_COMPONENT24, 1, 24, FboAttachmentSlot.DEPTH);
            case InternalFormat.DEPTH16: return new GlInternalFormat(gl.DEPTH_COMPONENT16, 1, 16, FboAttachmentSlot.DEPTH);
            case InternalFormat.DEPTH32F_STENCIL8: return new GlInternalFormat(gl.DEPTH32F_STENCIL8, 2, 40, FboAttachmentSlot.DEPTH_STENCIL);
            case InternalFormat.DEPTH24_STENCIL8: return new GlInternalFormat(gl.DEPTH24_STENCIL8, 2, 32, FboAttachmentSlot.DEPTH_STENCIL);
            case InternalFormat.STENCIL8: return new GlInternalFormat(gl.STENCIL_INDEX8, 1, 8, FboAttachmentSlot.STENCIL);
            default: throw new Error('Invalid enum InternalFormat');
        }
    }

}

export class GlInternalFormat {
    public readonly code: number;
    public readonly colorChannelCount: number;
    public readonly bitDepth: number;
    public readonly attachmentSlot: number;

    public constructor(code: number, colorChannelCount: number, bitDepth: number, attachmentSlot: FboAttachmentSlot) {
        this.code = code;
        this.colorChannelCount = colorChannelCount;
        this.bitDepth = bitDepth;
        this.attachmentSlot = attachmentSlot;
    }
}