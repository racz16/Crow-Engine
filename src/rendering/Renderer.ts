import { Log } from '../utility/log/Log';
import { LogLevel } from '../utility/log/LogLevel';
import { Shader } from '../resource/shader/Shader';
import { Utility } from '../utility/Utility';

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
            if (!this.isUsable()) {
                Log.logString(LogLevel.WARNING, `The ${this.name} is not usable`);
                return;
            }
            this.renderUnsafe();
        } finally {
            Log.endGroup();
        }
    }

    public getName(): string {
        return this.name;
    }

    protected abstract renderUnsafe(): void;

    public release(): void {
        if (this.isUsable()) {
            this.getShader().release();
        }
    }

    public isUsable(): boolean {
        return Utility.isUsable(this.getShader());
    }

    protected addedToThePipeline(): void { }

    protected removedFromThePipeline(): void { }

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

    protected abstract getShader(): Shader;

}
