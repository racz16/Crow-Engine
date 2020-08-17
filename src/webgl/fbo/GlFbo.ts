import { GlObject } from '../GlObject';
import { GlFboAttachmentContainer } from './GlFboAttachmentContainer';
import { Gl } from '../Gl';
import { GlFboAttachmentSlot, GlAttachmentSlotResolver } from '../enum/GlFboAttachmentSlot';
import { GlFboCompleteness, GlFboCompletenessResolver } from '../enum/GlFboCompleteness';
import { ReadonlyVec2 } from 'gl-matrix';
import { GlConstants } from '../GlConstants';
import { Utility } from '../../utility/Utility';

export class GlFbo extends GlObject {

    private readonly color: GlFboAttachmentContainer[] = new Array<GlFboAttachmentContainer>(GlConstants.MAX_COLOR_ATTACHMENTS);
    private readonly depth = new GlFboAttachmentContainer(this, GlFboAttachmentSlot.DEPTH);
    private readonly stencil = new GlFboAttachmentContainer(this, GlFboAttachmentSlot.STENCIL);
    private readonly depthStencil = new GlFboAttachmentContainer(this, GlFboAttachmentSlot.DEPTH_STENCIL);
    private readBuffer: GlFboAttachmentContainer;
    private drawBuffers: Array<GlFboAttachmentContainer>;

    public constructor() {
        super();
        this.setId(this.createId());
        for (let i = 0; i < this.color.length; i++) {
            this.color[i] = new GlFboAttachmentContainer(this, GlFboAttachmentSlot.COLOR, i);
        }
        this.drawBuffers = [this.color[0]];
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

    //attachments
    public getAttachmentContainer(slot: GlFboAttachmentSlot, index = 0): GlFboAttachmentContainer {
        switch (slot) {
            case GlFboAttachmentSlot.COLOR:
                return this.color[index];
            case GlFboAttachmentSlot.DEPTH:
                return this.depth;
            case GlFboAttachmentSlot.STENCIL:
                return this.stencil;
            case GlFboAttachmentSlot.DEPTH_STENCIL:
                return this.depthStencil;
        }
    }

    //read buffer
    public getReadBuffer(): GlFboAttachmentContainer {
        return this.readBuffer;
    }

    public setReadBuffer(fac: GlFboAttachmentContainer): void {
        this.bind();
        if (!fac) {
            this.readBuffer = null;
            Gl.gl.readBuffer(Gl.gl.NONE);
        } else {
            this.readBuffer = fac;
            Gl.gl.readBuffer(GlAttachmentSlotResolver.enumToGl(fac.getSlot()).getAttachmentPointCode() + fac.getIndex());
        }
    }

    //draw buffers
    public getDrawBuffersIterator(): IterableIterator<GlFboAttachmentContainer> {
        return this.drawBuffers.values();
    }

    public getDrawBufferCount(): number {
        return this.drawBuffers.length;
    }

    public getDrawBuffer(index: number): GlFboAttachmentContainer {
        return this.drawBuffers[index];
    }

    public setDrawBuffers(...drawBuffers: Array<GlFboAttachmentContainer>): void {
        const indices = drawBuffers.map(fac => fac ? fac.getId() : Gl.gl.NONE);
        this.drawBuffers = drawBuffers;
        this.bind();
        Gl.gl.drawBuffers(indices);
    }

    //status
    public isReadComplete(): boolean {
        return this.getReadStatus() === GlFboCompleteness.COMPLETE;
    }

    public isDrawComplete(): boolean {
        return this.getDrawStatus() === GlFboCompleteness.COMPLETE;
    }

    public getReadStatus(): GlFboCompleteness {
        this.bindToRead();
        const code = Gl.gl.checkFramebufferStatus(this.getReadTarget());
        return GlFboCompletenessResolver.glToEnum(code);
    }

    public getDrawStatus(): GlFboCompleteness {
        this.bindToDraw();
        const code = Gl.gl.checkFramebufferStatus(this.getDrawTarget());
        return GlFboCompletenessResolver.glToEnum(code);
    }

    //bind
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

    //blit
    public blitTo(destination: GlFbo, fromOffset: ReadonlyVec2, fromSize: ReadonlyVec2, toOffset: ReadonlyVec2, toSize: ReadonlyVec2, slots: GlFboAttachmentSlot): void {
        this.bindToRead();
        destination.bindToDraw();
        Gl.gl.blitFramebuffer(fromOffset[0], fromOffset[1], fromSize[0], fromSize[1], toOffset[0], toOffset[1], toSize[0], toSize[1], GlAttachmentSlotResolver.enumFlagToGl(slots), Gl.gl.NEAREST);
    }

    //misc
    public getAllDataSize(): number {
        let size = 0;
        size += this.depth.getAttachment()?.getDataSize();
        size += this.stencil.getAttachment()?.getDataSize();
        size += this.depthStencil.getAttachment()?.getDataSize();
        for (const fac of this.color) {
            size += fac.getAttachment()?.getDataSize() ?? 0;
        }
        return size;
    }

    public readRgbaPixels(offset: ReadonlyVec2, size: ReadonlyVec2): Uint8Array {
        return this.readPixelsUnsafe(offset, size, 4);
    }

    public readRgbPixels(offset: ReadonlyVec2, size: ReadonlyVec2): Uint8Array {
        return this.readPixelsUnsafe(offset, size, 3);
    }

    private readPixelsUnsafe(offset: ReadonlyVec2, size: ReadonlyVec2, components: number): Uint8Array {
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

    public releaseAll(): void {
        if (this.isUsable()) {
            this.releaseAttachment(this.getAttachmentContainer(GlFboAttachmentSlot.DEPTH));
            this.releaseAttachment(this.getAttachmentContainer(GlFboAttachmentSlot.STENCIL));
            this.releaseAttachment(this.getAttachmentContainer(GlFboAttachmentSlot.DEPTH_STENCIL));
            for (let i = 0; i < GlConstants.MAX_COLOR_ATTACHMENTS; i++) {
                this.releaseAttachment(this.getAttachmentContainer(GlFboAttachmentSlot.COLOR, i));
            }
            this.release();
        }
    }

    private releaseAttachment(attachmentContainer: GlFboAttachmentContainer): void {
        Utility.releaseIfUsable(attachmentContainer.getTextureAttachment());
        Utility.releaseIfUsable(attachmentContainer.getRboAttachment());
    }

}
