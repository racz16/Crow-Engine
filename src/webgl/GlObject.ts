import { IResource } from '../resource/IResource';
import { Engine } from '../core/Engine';
import { TagContainer } from '../core/TagContainer';

export abstract class GlObject implements IResource {

    protected static readonly INVALID_ID = -1;

    private id = GlObject.INVALID_ID;
    private tagContainer = new TagContainer();
    private dataSize = 0;

    public constructor() {
        Engine.getResourceManager().add(this);
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

    public getAllDataSize(): number {
        return this.dataSize;
    }

    public isUsable(): boolean {
        return this.id !== GlObject.INVALID_ID;
    }

    public abstract release(): void;

}