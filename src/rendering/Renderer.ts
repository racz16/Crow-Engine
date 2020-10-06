import { Shader } from '../resource/shader/Shader';
import { Utility } from '../utility/Utility';
import { Engine } from '../core/Engine';
import { Gl } from '../webgl/Gl';
import { vec2 } from 'gl-matrix';
import { RenderingPipeline } from './RenderingPipeline';

export abstract class Renderer {

    private name: string;
    private active = true;
    protected opaque: boolean;
    private renderedElementCount = 0;
    private renderedFaceCount = 0;

    public constructor(name: string) {
        if (name == null) {
            name = 'Unnamed Renderer'
        }
        this.name = name;
    }

    public render(opaque = true): void {
        Engine.getLog().startGroup(this.name);
        this.opaque = opaque;
        this.beforeRendering();
        this.renderUnsafe();
        this.afterRendering();
        Engine.getLog().endGroup();
    }

    public getName(): string {
        return this.name;
    }

    protected beforeRendering(): void {
        this.getShader().start(this.opaque);
        if (this.opaque) {
            Engine.getRenderingPipeline().bindGeometryFbo();
            this.resetRenderedElementCount();
            this.resetRenderedFaceCount();
        } else {
            Engine.getRenderingPipeline().getParameters().get(RenderingPipeline.DUAL_DEPTH_FBO).bind();
        }
        Gl.setViewport(Engine.getRenderingPipeline().getRenderingSize(), vec2.create());
    }

    protected abstract renderUnsafe(): void;

    protected afterRendering(): void { }

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

    public getRenderedElementCount(): number {
        return this.renderedElementCount;
    }

    protected resetRenderedElementCount(): void {
        this.renderedElementCount = 0;
    }

    protected incrementRenderedElementCountBy(elementCount: number): void {
        this.renderedElementCount += elementCount;
    }

    public getRenderedFaceCount(): number {
        return this.renderedFaceCount;
    }

    protected resetRenderedFaceCount(): void {
        this.renderedFaceCount = 0;
    }

    protected incrementRenderedFaceCountBy(faceCount: number): void {
        this.renderedFaceCount += faceCount;
    }

    protected abstract getShader(): Shader;

}
