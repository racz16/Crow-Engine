import { Gl } from '../Gl';

export enum GlFboAttachmentSlot {
    COLOR = 1,
    DEPTH = 2,
    STENCIL = 4,
    DEPTH_STENCIL = 8,
}

export class GlAttachmentSlotResolver {

    public static enumToGl(attachmentSlot: GlFboAttachmentSlot): GlFboAttachmentSlotInfo {
        const gl = Gl.gl;
        switch (attachmentSlot) {
            case GlFboAttachmentSlot.COLOR: return new GlFboAttachmentSlotInfo(gl.COLOR_ATTACHMENT0, gl.COLOR, gl.COLOR_BUFFER_BIT);
            case GlFboAttachmentSlot.DEPTH: return new GlFboAttachmentSlotInfo(gl.DEPTH_ATTACHMENT, gl.DEPTH, gl.DEPTH_BUFFER_BIT);
            case GlFboAttachmentSlot.STENCIL: return new GlFboAttachmentSlotInfo(gl.STENCIL_ATTACHMENT, gl.STENCIL, gl.STENCIL_BUFFER_BIT);
            case GlFboAttachmentSlot.DEPTH_STENCIL: return new GlFboAttachmentSlotInfo(gl.DEPTH_STENCIL_ATTACHMENT, gl.DEPTH_STENCIL, gl.DEPTH_BUFFER_BIT | gl.STENCIL_BUFFER_BIT);
            default: throw new Error('Invalid enum GlFboAttachmentSlot');
        }
    }

    public static enumFlagToGl(attachmentSlot: GlFboAttachmentSlot): number {
        const gl = Gl.gl;
        const color = attachmentSlot & GlFboAttachmentSlot.COLOR ? gl.COLOR_BUFFER_BIT : gl.NONE;
        const depth = attachmentSlot & GlFboAttachmentSlot.DEPTH ? gl.DEPTH_BUFFER_BIT : gl.NONE;
        const stencil = attachmentSlot & GlFboAttachmentSlot.STENCIL ? gl.STENCIL_BUFFER_BIT : gl.NONE;
        return color | depth | stencil;
    }

}

export class GlFboAttachmentSlotInfo {

    private readonly attachmentPointCode: number;
    private readonly attachmentSlotCode: number;
    private readonly bitMask: number;

    public constructor(attachmentPointCode: number, attachmentSlotCode: number, bitMask: number) {
        this.attachmentPointCode = attachmentPointCode;
        this.attachmentSlotCode = attachmentSlotCode;
        this.bitMask = bitMask;
    }

    public getAttachmentPointCode(): number {
        return this.attachmentPointCode;
    }

    public getAttachmentSlotCode(): number {
        return this.attachmentSlotCode;
    }

    public getBitMask(): number {
        return this.bitMask;
    }

}