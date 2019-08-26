import { Time } from './Time';
import { Gl } from '../webgl/Gl';
import { Scene } from './Scene';
import { ResourceManager } from '../resource/ResourceManager';
import { RenderingPipeline } from '../rendering/RenderingPipeline';
import { Audio } from '../resource/Audio';
import { Log } from '../utility/log/Log';
import { LogLevel } from '../utility/log/LogLevel';
import { LogType } from '../utility/log/LogType';
import { CameraComponent } from '../component/camera/CameraComponent';

export class Engine {

    public static readonly DEBUG = true;
    private static initialized = false;
    private static started = false;

    private constructor() { }

    public static initialize(canvas: HTMLCanvasElement, logLevel = this.DEBUG ? LogLevel.INFO_1 : LogLevel.WARNING): void {
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
        Log.logString(LogLevel.INFO_1, LogType.ENGINE, 'Engine started');
        Engine.createNextFrame();
    }

    public static stop(): void {
        if (Engine.started) {
            this.started = false;
            Log.logString(LogLevel.INFO_1, LogType.ENGINE, 'Engine stopped');
        }
    }

    public static release(): void {
        if (Engine.started) {
            throw Error();
        }
        ResourceManager.releaseResources();
    }

    private static createNextFrame(): void {
        try {
            if (Engine.started) {
                Engine.createNextFrameUnsafe();
            }
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
        Log.endGroup();
        window.requestAnimationFrame(Engine.createNextFrame);
    }

    public static isInitialized(): boolean {
        return Engine.initialized;
    }

    public static isStarted(): boolean {
        return Engine.started;
    }

}

