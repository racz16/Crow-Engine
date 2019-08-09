import { Time } from "./Time";
import { Gl } from "../webgl/Gl";
import { Scene } from "./Scene";
import { ResourceManager } from "../resource/ResourceManager";
import { RenderingPipeline } from "../rendering/RenderingPipeline";
import { Audio } from "../resource/Audio";
import { Log } from "../utility/log/Log";
import { LogLevel } from "../utility/log/LogLevel";

export class Engine {

    public static readonly DEBUG = true;
    private static initialized = false;
    private static started = false;

    private constructor() { }

    public static initialize(canvas: HTMLCanvasElement, logLevel = this.DEBUG ? LogLevel.INFO : LogLevel.ERROR): void {
        try {
            this.initializeUnsafe(canvas, logLevel);
        } catch (error) {
            Log.error(error);
            ResourceManager.releaseResources();
        }
    }

    private static initializeUnsafe(canvas: HTMLCanvasElement, logLevel: LogLevel): void {
        Log.initialize(logLevel);
        Gl.initialize(canvas);
        Audio.initialize();
        RenderingPipeline.initialize();
        Engine.initialized = true;
        Log.lifeCycleInfo('engine initialized');
    }

    public static start(): void {
        if (!Engine.initialized) {
            throw new Error('The engine is not yet initialized');
        }
        if (Engine.started) {
            throw new Error('The engine is already started');
        }
        Engine.createNextFrame();
        Engine.started = true;
        Log.lifeCycleInfo('engine started');
    }

    private static createNextFrame(): void {
        try {
            Engine.createNextFrameUnsafe();
        } catch (error) {
            Log.error(error);
            ResourceManager.releaseResources();
        }
    }

    private static createNextFrameUnsafe(): void {
        Time.private_update();
        Log.lifeCycleInfo(`FRAME ${Time.getFrameCount()} started`);
        Scene.getGameObjects().private_updateComponents();
        RenderingPipeline.render();
        window.requestAnimationFrame(Engine.createNextFrame);
        Log.lifeCycleInfo(`FRAME ${Time.getFrameCount()} finished`);
    }

    public static isInitialized(): boolean {
        return Engine.initialized;
    }

    public static isStarted(): boolean {
        return Engine.started;
    }

}

