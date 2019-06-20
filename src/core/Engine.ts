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
            Log.initialize(logLevel);
            Gl.initialize(canvas);
            Audio.initialize();
            RenderingPipeline.initialize();
            Engine.initialized = true;
            Log.lifeCycleInfo('engine initialized');
        } catch (error) {
            Log.error(error);
            ResourceManager.releaseResources();
        }
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
            Time.private_update();
            Log.lifeCycleInfo(`FRAME ${Time.getFrameCount()} started`);
            Scene.getGameObjects().private_updateComponents();
            RenderingPipeline.render();
            window.requestAnimationFrame(Engine.createNextFrame);
            Log.lifeCycleInfo(`FRAME ${Time.getFrameCount()} finished`);
        } catch (error) {
            Log.error(error);
            ResourceManager.releaseResources();
        }
    }

    public static isInitialized(): boolean {
        return Engine.initialized;
    }

    public static isStarted(): boolean {
        return Engine.started;
    }

}

