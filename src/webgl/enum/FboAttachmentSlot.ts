import { Gl } from '../Gl';

export enum FboAttachmentSlot {
    COLOR = 1,
    DEPTH = 2,
    STENCIL = 4,
    DEPTH_STENCIL = 8,
}

export class AttachmentSlotResolver {

    public static enumToGl(attachmentSlot: FboAttachmentSlot): GlAttachmentSlot {
        const gl = Gl.gl;
        switch (attachmentSlot) {
            case FboAttachmentSlot.COLOR: return new GlAttachmentSlot(gl.COLOR_ATTACHMENT0, gl.COLOR, gl.COLOR_BUFFER_BIT);
            case FboAttachmentSlot.DEPTH: return new GlAttachmentSlot(gl.DEPTH_ATTACHMENT, gl.DEPTH, gl.DEPTH_BUFFER_BIT);
            case FboAttachmentSlot.STENCIL: return new GlAttachmentSlot(gl.STENCIL_ATTACHMENT, gl.STENCIL, gl.STENCIL_BUFFER_BIT);
            case FboAttachmentSlot.DEPTH_STENCIL: return new GlAttachmentSlot(gl.DEPTH_STENCIL_ATTACHMENT, gl.DEPTH_STENCIL, gl.DEPTH_BUFFER_BIT | gl.STENCIL_BUFFER_BIT);
            default: throw new Error('Invalid enum AttachmentSlot');
        }
    }

    public static enumFlagToGl(attachmentSlot: FboAttachmentSlot): number {
        const gl = Gl.gl;
        const color = attachmentSlot & FboAttachmentSlot.COLOR ? gl.COLOR_BUFFER_BIT : gl.NONE;
        const depth = attachmentSlot & FboAttachmentSlot.DEPTH ? gl.DEPTH_BUFFER_BIT : gl.NONE;
        const stencil = attachmentSlot & FboAttachmentSlot.STENCIL ? gl.STENCIL_BUFFER_BIT : gl.NONE;
        return color | depth | stencil;
    }

}

export class GlAttachmentSlot {
    public readonly attachmentPointCode: number;
    public readonly attachmentSlotCode: number;
    public readonly bitMask: number;

    public constructor(attachmentPointCode: number, attachmentSlotCode: number, bitMask: number) {
        this.attachmentPointCode = attachmentPointCode;
        this.attachmentSlotCode = attachmentSlotCode;
        this.bitMask = bitMask;
    }
}