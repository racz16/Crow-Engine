import { GlObject } from '../GlObject';
import { FboAttachmentContainer } from './FboAttachmentContainer';
import { Gl } from '../Gl';
import { GlConstants } from '../GlConstants';
import { FboAttachmentSlot, AttachmentSlotResolver } from '../enum/FboAttachmentSlot';
import { FboCompleteness, FboCompletenessResolver } from '../enum/FboCompleteness';
import { vec2 } from 'gl-matrix';

export class Fbo extends GlObject {

    private readonly color: FboAttachmentContainer[] = new Array<FboAttachmentContainer>(Fbo.getMaxColorAttachments());
    private readonly depth = new FboAttachmentContainer(this, FboAttachmentSlot.DEPTH, 0);
    private readonly stencil = new FboAttachmentContainer(this, FboAttachmentSlot.STENCIL, 0);
    private readonly depthStencil = new FboAttachmentContainer(this, FboAttachmentSlot.DEPTH_STENCIL, 0);
    private readBuffer: number;

    public constructor() {
        super();
        this.setId(this.createId());
        for (let i = 0; i < this.color.length; i++) {
            this.color[i] = new FboAttachmentContainer(this, FboAttachmentSlot.COLOR, i);
        }
    }

    private createId(): number {
        return Gl.gl.createFramebuffer() as number;
    }

    private getTarget(): number {
        return Gl.gl.FRAMEBUFFER;
    }

    private getReadTarget(): number {
        return Gl.gl.READ_FRAMEBUFFER;
    }

    private getDrawTarget(): number {
        return Gl.gl.DRAW_FRAMEBUFFER;
    }

    //attachments-------------------------------------------------------------------------------------------------------
    public getAttachmentContainer(slot: FboAttachmentSlot, index = -1): FboAttachmentContainer {
        switch (slot) {
            case FboAttachmentSlot.COLOR:
                return this.color[index];
            case FboAttachmentSlot.DEPTH:
                return this.depth;
            case FboAttachmentSlot.STENCIL:
                return this.stencil;
            case FboAttachmentSlot.DEPTH_STENCIL:
                return this.depthStencil;
        }
        throw new Error();
    }

    public static getMaxColorAttachments(): number {
        return GlConstants.MAX_COLOR_ATTACHMENTS;
    }

    public static getMaxColorAttachmentsSafe(): number {
        return GlConstants.MAX_COLOR_ATTACHMENTS_SAFE;
    }

    //read buffer-------------------------------------------------------------------------------------------------------
    public getReadBufferIndex(): number {
        return this.readBuffer;
    }

    public getReadBuffer(): FboAttachmentContainer {
        return this.color[this.readBuffer];
    }

    public setReadBuffer(index: number): void {
        this.bindToRead();
        if (index < 0) {
            this.readBuffer = -1;
            Gl.gl.readBuffer(Gl.gl.NONE);
        } else {
            this.readBuffer = index;
            Gl.gl.readBuffer(Gl.gl.COLOR_ATTACHMENT0 + index);
        }
    }

    //draw buffers------------------------------------------------------------------------------------------------------
    public getDrawBufferIndicesIterator(): IterableIterator<number> {
        const result = new Array<number>();
        for (const fac of this.color) {
            if (fac.isDrawBuffer()) {
                result.push(fac.getIndex());
            }
        }
        return result.values();
    }

    public getDrawBuffersIterator(): IterableIterator<FboAttachmentContainer> {
        const result = new Array<FboAttachmentContainer>();
        for (const fac of this.color) {
            if (fac.isDrawBuffer()) {
                result.push(fac);
            }
        }
        return result.values();
    }

    public setDrawBuffers(...indices: Array<number>): void {
        const attachments = new Array<number>();
        for (const fac of this.color) {
            const drawAttachment = indices.includes(fac.getIndex());
            (fac as any).setDrawBuffer(drawAttachment);
            if (drawAttachment) {
                attachments.push(Gl.gl.COLOR_ATTACHMENT0 + fac.getIndex());
            }
        }
        this.setDrawBuffersUnsafe(attachments);
    }

    private setDrawBuffersUnsafe(attachments: Array<number>): void {
        if (attachments.length === 0) {
            attachments.push(Gl.gl.NONE);
        }
        Gl.gl.drawBuffers(attachments);
    }

    public static getMaxDrawBuffers(): number {
        return GlConstants.MAX_DRAW_BUFFERS;
    }

    public static getMaxDrawBuffersSafe(): number {
        return GlConstants.MAX_DRAW_BUFFERS_SAFE;
    }

    //status------------------------------------------------------------------------------------------------------------
    public isReadComplete(): boolean {
        return this.getReadStatus() === FboCompleteness.COMPLETE;
    }

    public isDrawComplete(): boolean {
        return this.getDrawStatus() === FboCompleteness.COMPLETE;
    }

    public getReadStatus(): FboCompleteness {
        this.bindToRead();
        const code = Gl.gl.checkFramebufferStatus(this.getReadTarget());
        return FboCompletenessResolver.glToEnum(code);
    }

    public getDrawStatus(): FboCompleteness {
        this.bindToDraw();
        const code = Gl.gl.checkFramebufferStatus(this.getDrawTarget());
        return FboCompletenessResolver.glToEnum(code);
    }

    //bind--------------------------------------------------------------------------------------------------------------
    public static bindDefaultFrameBuffer(): void {
        Gl.gl.bindFramebuffer(Gl.gl.FRAMEBUFFER, null);
    }

    public bind(): void {
        Gl.gl.bindFramebuffer(this.getTarget(), this.getId());
    }

    public bindToRead(): void {
        Gl.gl.bindFramebuffer(this.getReadTarget(), this.getId());
    }

    public bindToDraw(): void {
        Gl.gl.bindFramebuffer(this.getDrawTarget(), this.getId());
    }

    //blit--------------------------------------------------------------------------------------------------------------
    public blitTo(destination: Fbo, fromOffset: vec2, fromSize: vec2, toOffset: vec2, toSize: vec2, slots: FboAttachmentSlot): void {
        this.bindToRead();
        destination.bindToDraw();
        Gl.gl.blitFramebuffer(fromOffset[0], fromOffset[1], fromSize[0], fromSize[1], toOffset[0], toOffset[1], toSize[0], toSize[1], AttachmentSlotResolver.enumFlagToGl(slots), Gl.gl.NEAREST);
    }

    //misc--------------------------------------------------------------------------------------------------------------
    public readRgbaPixels(offset: vec2, size: vec2): Uint8Array {
        return this.readPixelsUnsafe(offset, size, 4);
    }

    public readRgbPixels(offset: vec2, size: vec2): Uint8Array {
        return this.readPixelsUnsafe(offset, size, 3);
    }

    private readPixelsUnsafe(offset: vec2, size: vec2, components: number): Uint8Array {
        const glType = components === 3 ? Gl.gl.RGB : Gl.gl.RGBA;
        const destination = new Uint8Array(size[0] * size[1] * components);
        this.bind();
        Gl.gl.readPixels(offset[0], offset[1], size[0], size[1], Gl.gl.RGB, glType, destination);
        return destination;
    }

    public release(): void {
        Gl.gl.deleteFramebuffer(this.getId());
        this.setId(GlObject.INVALID_ID);
    }

}
