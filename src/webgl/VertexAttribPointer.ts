import { VertexAttribPointerType } from './enum/VertexAttribPointerType';

export class VertexAttribPointer {

    public readonly size: number;
    public readonly type: VertexAttribPointerType;
    public readonly normalized: boolean;
    public readonly offset: number;
    public readonly relativeOffset: number;

    public constructor(size = 4, type = VertexAttribPointerType.FLOAT, normalized = false, offset = 0, relativeOffset = 0) {
        this.size = size;
        this.type = type;
        this.normalized = normalized;
        this.offset = offset;
        this.relativeOffset = relativeOffset;
    }

}
