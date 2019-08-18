import { IResource } from "../resource/IResource";
import { ResourceManager } from "../resource/ResourceManager";

export abstract class GlObject implements IResource {

    protected static readonly INVALID_ID = -1;
    private dataSize = 0;
    private id = GlObject.INVALID_ID;

    public constructor() {
        (ResourceManager as any).add(this);
    }

    public getId(): number {
        return this.id;
    }

    protected setId(id: number): void {
        this.id = id;
    }

    public getDataSize(): number {
        return this.dataSize;
    }

    protected setDataSize(size: number): void {
        this.dataSize = size;
    }

    public isUsable(): boolean {
        return this.id !== GlObject.INVALID_ID;
    }

    public abstract release(): void;

}