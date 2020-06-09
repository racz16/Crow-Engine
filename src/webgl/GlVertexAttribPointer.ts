import { GlVertexAttribPointerType } from './enum/GlVertexAttribPointerType';

export class GlVertexAttribPointer {

    private readonly size: number;
    private readonly type: GlVertexAttribPointerType;
    private readonly normalized: boolean;
    private readonly offset: number;
    private readonly stride: number;

    public constructor(size = 4, type = GlVertexAttribPointerType.FLOAT, normalized = false, offset = 0, stride = 0) {
        this.size = size;
        this.type = type;
        this.normalized = normalized;
        this.offset = offset;
        this.stride = stride;
    }

    public getSize(): number {
        return this.size;
    }

    public getType(): GlVertexAttribPointerType {
        return this.type;
    }

    public isNormalized(): boolean {
        return this.normalized;
    }

    public getOffset(): number {
        return this.offset;
    }

    public getStride(): number {
        return this.stride;
    }

}