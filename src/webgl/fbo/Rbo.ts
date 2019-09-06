import { GlObject } from '../GlObject';
import { IFboAttachment } from './IFboAttachment';
import { vec2 } from 'gl-matrix';
import { InternalFormat, InternalFormatResolver } from '../enum/InternalFormat';
import { Gl } from '../Gl';
import { GlConstants } from '../GlConstants';

export class Rbo extends GlObject implements IFboAttachment {

    private size = vec2.create();
    private internalFormat: InternalFormat;
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

    public allocate(size: vec2, internalFormat: InternalFormat, sampleCount: number): void {
        this.allocationGeneral(size, internalFormat, sampleCount);
        this.bind();
        if (this.isMultisampled()) {
            Gl.gl.renderbufferStorageMultisample(this.getTarget(), this.sampleCount, InternalFormatResolver.enumToGl(this.internalFormat).code, this.size[0], this.size[1])
        } else {
            Gl.gl.renderbufferStorage(this.getTarget(), InternalFormatResolver.enumToGl(this.internalFormat).code, this.size[0], this.size[1]);
        }
    }

    private allocationGeneral(size: vec2, internalFormat: InternalFormat, sampleCount: number): void {
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
        const pixelSizeInBits = InternalFormatResolver.enumToGl(this.getInternalFormat()).bitDepth * this.sampleCount;
        const numberOfPixels = this.size[0] * this.size[1];
        const dataSizeInBits = pixelSizeInBits * numberOfPixels;
        const dataSizeInBytes = dataSizeInBits / 8;
        return dataSizeInBytes;
    }

    public getInternalFormat(): InternalFormat {
        return this.internalFormat;
    }

    private setInternalFormat(internalFormat: InternalFormat): void {
        this.internalFormat = internalFormat;
    }

    public getSize(): vec2 {
        return vec2.clone(this.size);
    }

    private setSize(size: vec2): void {
        this.size.set(size);
    }

    public static getMaxSize(): number {
        return GlConstants.MAX_RENDERBUFFER_SIZE;
    }

    public static getMaxSizeSafe(): number {
        return GlConstants.MAX_RENDERBUFFER_SIZE_SAFE;
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

    public static getMaxSampleCount(): number {
        return GlConstants.MAX_SAMPLES;
    }

    public static getMaxSampleCountSafe(): number {
        return GlConstants.MAX_SAMPLES_SAFE;
    }

    public issRgb(): boolean {
        return this.internalFormat === InternalFormat.SRGB8_A8 || this.internalFormat === InternalFormat.SRGB8;
    }

    public release(): void {
        Gl.gl.deleteRenderbuffer(this.getId());
        this.setId(GlObject.INVALID_ID);
        this.setDataSize(0);
        this.allocated = false;
    }

}
