import { Log } from "../utility/log/Log";

export abstract class Renderer {

    private name: string;
    private active = true;
    private numberOfRenderedElements = 0;
    private numberOfRenderedFaces = 0;

    public constructor(name: string) {
        if (name == null) {
            name = 'Unnamed Renderer'
        }
        this.name = name;
    }

    public render(): void {
        try {
            Log.startGroup(this.name)
            this.renderUnsafe();
        } finally {
            Log.endGroup();
        }
    }

    protected abstract renderUnsafe(): void;

    public abstract release(): void;

    public abstract isUsable(): boolean;

    public abstract removeFromRenderingPipeline(): void;

    public isActive(): boolean {
        return this.active;
    }

    public setActive(active: boolean): void {
        this.active = active;
    }

    public getNumberOfRenderedElements(): number {
        return this.numberOfRenderedElements;
    }

    protected setNumberOfRenderedElements(count: number): void {
        this.numberOfRenderedElements = count;
    }

    public getNumberOfRenderedFaces(): number {
        return this.numberOfRenderedFaces;
    }

    protected setNumberOfRenderedFaces(count: number): void {
        this.numberOfRenderedFaces = count;
    }

}
