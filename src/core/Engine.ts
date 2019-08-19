import { Time } from "./Time";
import { Gl } from "../webgl/Gl";
import { Scene } from "./Scene";
import { ResourceManager } from "../resource/ResourceManager";
import { RenderingPipeline } from "../rendering/RenderingPipeline";
import { Audio } from "../resource/Audio";
import { Log } from "../utility/log/Log";
import { LogLevel } from "../utility/log/LogLevel";
import { LogType } from "../utility/log/LogType";

export class Engine {

    public static readonly DEBUG = true;
    private static initialized = false;
    private static started = false;

    private constructor() { }

    public static initialize(canvas: HTMLCanvasElement, logLevel = this.DEBUG ? LogLevel.WARNING : LogLevel.INFO_1): void {
        try {
            this.initializeUnsafe(canvas, logLevel);
        } catch (error) {
            Log.logObject(LogLevel.ERROR, LogType.ENGINE, error);
            ResourceManager.releaseResources();
        }
    }

    private static initializeUnsafe(canvas: HTMLCanvasElement, logLevel: LogLevel): void {
        Log.startGroup('initialization');
        Log.initialize(logLevel);
        Gl.initialize(canvas);
        Audio.initialize();
        RenderingPipeline.initialize();
        Engine.initialized = true;
        Log.logString(LogLevel.INFO_1, LogType.ENGINE, 'Engine initialized');
        Log.endGroup();
    }

    public static start(): void {
        if (!Engine.initialized) {
            throw new Error('The engine is not yet initialized');
        }
        if (Engine.started) {
            throw new Error('The engine is already started');
        }
        Engine.started = true;
        Log.logString(LogLevel.INFO_1, LogType.ENGINE, 'engine started');
        Engine.createNextFrame();
    }

    private static createNextFrame(): void {
        try {
            Engine.createNextFrameUnsafe();
        } catch (error) {
            Log.logObject(LogLevel.ERROR, LogType.ENGINE, error);
            ResourceManager.releaseResources();
        }
    }

    private static createNextFrameUnsafe(): void {
        Log.startGroup(`frame ${Time.getFrameCount()}`);
        (Time as any).update();
        (Scene.getGameObjects() as any).updateComponents();
        RenderingPipeline.render();
        Log.endGroup(); Log.endGroup();//ne kérdezd
        window.requestAnimationFrame(Engine.createNextFrame);
    }

    public static isInitialized(): boolean {
        return Engine.initialized;
    }

    public static isStarted(): boolean {
        return Engine.started;
    }

}

