export abstract class Renderer {

    private active = true;
    private numberOfRenderedElements = 0;
    private numberOfRenderedFaces = 0;

    public abstract render(): void;

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
