import { GlObject } from '../GlObject';
import { IGlFboAttachment } from './IGlFboAttachment';
import { vec2, ReadonlyVec2 } from 'gl-matrix';
import { GlInternalFormat, GlInternalFormatResolver } from '../enum/GlInternalFormat';
import { Gl } from '../Gl';

export class GlRbo extends GlObject implements IGlFboAttachment {

    private readonly size = vec2.create();
    private internalFormat: GlInternalFormat;
    private sampleCount = 1;
    private allocated = false;

    public constructor() {
        super();
        this.setId(this.createId());
    }

    private createId(): number {
        return Gl.gl.createRenderbuffer() as number;
    }

    private getTarget(): number {
        return Gl.gl.RENDERBUFFER;
    }

    public bind(): void {
        Gl.gl.bindRenderbuffer(this.getTarget(), this.getId());
    }

    public allocate(size: ReadonlyVec2, internalFormat: GlInternalFormat, sampleCount: number): void {
        this.allocationGeneral(size, internalFormat, sampleCount);
        this.bind();
        const glInternalFormat = GlInternalFormatResolver.enumToGl(this.internalFormat).getCode();
        if (this.isMultisampled()) {
            Gl.gl.renderbufferStorageMultisample(this.getTarget(), this.sampleCount, glInternalFormat, this.size[0], this.size[1])
        } else {
            Gl.gl.renderbufferStorage(this.getTarget(), glInternalFormat, this.size[0], this.size[1]);
        }
    }

    private allocationGeneral(size: ReadonlyVec2, internalFormat: GlInternalFormat, sampleCount: number): void {
        this.setInternalFormat(internalFormat);
        this.setSize(size);
        this.setSampleCount(sampleCount);
        this.setDataSize(this.computeDataSize());
        this.allocated = true;
    }

    public isAllocated(): boolean {
        return this.allocated;
    }

    private computeDataSize(): number {
        const pixelSizeInBits = GlInternalFormatResolver.enumToGl(this.getInternalFormat()).getBitDepth() * this.sampleCount;
        const numberOfPixels = this.size[0] * this.size[1];
        const dataSizeInBits = pixelSizeInBits * numberOfPixels;
        const dataSizeInBytes = dataSizeInBits / 8;
        return dataSizeInBytes;
    }

    public getInternalFormat(): GlInternalFormat {
        return this.internalFormat;
    }

    private setInternalFormat(internalFormat: GlInternalFormat): void {
        this.internalFormat = internalFormat;
    }

    public getSize(): ReadonlyVec2 {
        return this.size;
    }

    private setSize(size: ReadonlyVec2): void {
        vec2.copy(this.size, size);
    }

    public isMultisampled(): boolean {
        return this.sampleCount > 1;
    }

    public getSampleCount(): number {
        return this.sampleCount;
    }

    private setSampleCount(sampleCount: number): void {
        this.sampleCount = sampleCount;
    }

    public isSRgb(): boolean {
        return this.internalFormat === GlInternalFormat.SRGB8_A8 || this.internalFormat === GlInternalFormat.SRGB8;
    }

    public release(): void {
        Gl.gl.deleteRenderbuffer(this.getId());
        this.setId(GlObject.INVALID_ID);
        this.setDataSize(0);
        this.allocated = false;
    }

}
