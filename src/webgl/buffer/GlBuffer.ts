import { GlObject } from '../GlObject';
import { BufferObjectUsage, BufferObjectUsageResolver } from '../enum/BufferObjectUsage';
import { Gl } from '../Gl';

export abstract class GlBuffer extends GlObject {

    private allocated: boolean;
    private usage: BufferObjectUsage;

    public constructor() {
        super();
        this.setId(this.createId());
    }

    private createId(): number {
        return Gl.gl.createBuffer() as number;
    }

    protected abstract getTarget(): number;

    //
    //bind--------------------------------------------------------------
    //
    public bind(): void {
        Gl.gl.bindBuffer(this.getTarget(), this.getId());
    }

    public bindToRead(): void {
        Gl.gl.bindBuffer(Gl.gl.COPY_READ_BUFFER, this.getId());
    }

    public bindToWrite(): void {
        Gl.gl.bindBuffer(Gl.gl.COPY_WRITE_BUFFER, this.getId());
    }

    //
    //data allocation---------------------------------------------------
    //
    public isAllocated(): boolean {
        return this.allocated;
    }

    public allocate(size: number, usage: BufferObjectUsage): void {
        this.bind();
        this.allocationGeneral(size, usage);
        const glUsage = BufferObjectUsageResolver.enumToGl(usage);
        Gl.gl.bufferData(this.getTarget(), size, glUsage);
    }

    public allocateAndStore(data: Int8Array | Int16Array | Int32Array | Uint8Array | Uint16Array | Uint32Array | Float32Array |
        Float64Array, usage: BufferObjectUsage): void {
        this.bind();
        this.allocationGeneral(data.byteLength, usage);
        const glUsage = BufferObjectUsageResolver.enumToGl(usage);
        Gl.gl.bufferData(this.getTarget(), data, glUsage);
    }

    protected allocationGeneral(size: number, usage: BufferObjectUsage): void {
        this.setDataSize(size);
        this.usage = usage;
        this.allocated = true;
    }

    //
    //data store--------------------------------------------------------
    //
    public store(data: Int8Array | Int16Array | Int32Array | Uint8Array | Uint16Array | Uint32Array | Float32Array |
        Float64Array): void {
        this.storewithOffset(data, 0);
    }

    public storewithOffset(data: Int8Array | Int16Array | Int32Array | Uint8Array | Uint16Array | Uint32Array | Float32Array |
        Float64Array, offset: number): void {
        this.bind();
        Gl.gl.bufferSubData(this.getTarget(), offset, data, 0);
    }

    //
    //misc--------------------------------------------------------------
    //
    public copyBufferDataFrom(readSource: GlBuffer, readOffset: number, writeOffset: number, size: number): void {
        this.bindToRead();
        readSource.bindToWrite();
        Gl.gl.copyBufferSubData(Gl.gl.COPY_READ_BUFFER, Gl.gl.COPY_WRITE_BUFFER, readOffset, writeOffset, size);
    }

    public getUsage(): BufferObjectUsage {
        return this.usage;
    }

    public release(): void {
        Gl.gl.deleteBuffer(this.getId());
        this.setId(-1);
        this.setDataSize(0);
        this.allocated = false;
    }
}