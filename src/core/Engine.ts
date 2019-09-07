import { TimeManager } from './TimeManager';
import { Gl } from '../webgl/Gl';
import { ResourceManager } from '../resource/ResourceManager';
import { RenderingPipeline } from '../rendering/RenderingPipeline';
import { Audio } from '../resource/Audio';
import { Log } from '../utility/log/Log';
import { LogLevel } from '../utility/log/LogLevel';
import { ParameterKey } from '../utility/parameter/ParameterKey';
import { ICubeMapTexture } from '../resource/texture/ICubeMapTexture';
import { AudioListenerComponent } from '../component/audio/AudioListenerComponent';
import { GameObjectContainer } from './GameObjectContainer';
import { ParameterContainer } from '../utility/parameter/ParameterContainer';
import { ICameraComponent } from '../component/camera/ICameraComponent';

export class Engine {

    public static readonly MAIN_CAMERA = new ParameterKey<ICameraComponent>('MAIN_CAMERA');
    public static readonly MAIN_SKYBOX = new ParameterKey<ICubeMapTexture>('MAIN_SKYBOX');
    public static readonly MAIN_AUDIO_LISTENER = new ParameterKey<AudioListenerComponent>('MAIN_AUDIO_LISTENER');
    public static readonly GAMEOBJECT_CONTAINER = new ParameterKey<GameObjectContainer>('GAMEOBJECT_CONTAINER');
    public static readonly TIME_MANAGER = new ParameterKey<TimeManager>('TIME_MANAGER');
    public static readonly RESOURCE_MANAGER = new ParameterKey<ResourceManager>('RESOURCE_MANAGER');

    private static readonly PARAMETERS = new ParameterContainer();

    public static readonly DEBUG = true;
    private static initialized = false;
    private static started = false;

    private constructor() { }

    public static initialize(canvas: HTMLCanvasElement, logLevel = this.DEBUG ? LogLevel.INFO_1 : LogLevel.WARNING): void {
        try {
            this.initializeUnsafe(canvas, logLevel);
        } catch (error) {
            Log.logObject(LogLevel.ERROR, error);
            this.getResourceManager().releaseResources();
        }
    }

    private static initializeUnsafe(canvas: HTMLCanvasElement, logLevel: LogLevel): void {
        Log.startGroup('initialization');
        Log.initialize(logLevel);
        this.initializeSystems();
        Gl.initialize(canvas);
        Audio.initialize();
        RenderingPipeline.initialize();
        Engine.initialized = true;
        Log.endGroup();
    }

    private static initializeSystems(): void {
        this.setGameObjectContainer(new GameObjectContainer());
        this.setTimeManager(new TimeManager());
        this.setResourceManager(new ResourceManager());
    }

    //
    //parameters
    //
    public static getParameters(): ParameterContainer {
        return this.PARAMETERS;
    }

    public static getMainCamera(): ICameraComponent {
        return this.PARAMETERS.get(this.MAIN_CAMERA);
    }

    public static setMainCamera(camera: ICameraComponent): void {
        if (!camera) {
            Log.logString(LogLevel.WARNING, 'Main camera set to null');
        }
        this.PARAMETERS.set(this.MAIN_CAMERA, camera);
    }

    public static getMainAudioListener(): AudioListenerComponent {
        return this.PARAMETERS.get(this.MAIN_AUDIO_LISTENER);
    }

    public static setMainAudioListener(audioListenerComponent: AudioListenerComponent): void {
        if (!audioListenerComponent) {
            Log.logString(LogLevel.WARNING, 'Main audio listener set to null');
        }
        this.PARAMETERS.set(this.MAIN_AUDIO_LISTENER, audioListenerComponent);
    }

    public static getGameObjectContainer(): GameObjectContainer {
        return this.PARAMETERS.get(this.GAMEOBJECT_CONTAINER);
    }

    public static setGameObjectContainer(gameObjectContainer: GameObjectContainer): void {
        if (!gameObjectContainer) {
            Log.logString(LogLevel.WARNING, 'GameObject container set to null');
        }
        this.PARAMETERS.set(this.GAMEOBJECT_CONTAINER, gameObjectContainer);
    }

    public static getTimeManager(): TimeManager {
        return this.PARAMETERS.get(this.TIME_MANAGER);
    }

    public static setTimeManager(timeManager: TimeManager): void {
        if (!timeManager) {
            Log.logString(LogLevel.WARNING, 'Time Manager set to null');
        }
        this.PARAMETERS.set(this.TIME_MANAGER, timeManager);
    }

    public static getResourceManager(): ResourceManager {
        return this.PARAMETERS.get(this.RESOURCE_MANAGER);
    }

    public static setResourceManager(resourceManager: ResourceManager): void {
        if (!resourceManager) {
            Log.logString(LogLevel.WARNING, 'Resource Manager set to null');
        }
        this.PARAMETERS.set(this.RESOURCE_MANAGER, resourceManager);
    }

    //
    //engine lifecycle
    //
    public static start(): void {
        if (!Engine.initialized) {
            throw new Error('The engine is not yet initialized');
        }
        if (Engine.started) {
            throw new Error('The engine is already started');
        }
        Engine.started = true;
        Log.logString(LogLevel.INFO_1, 'Engine started');
        Engine.createNextFrame();
    }

    public static stop(): void {
        if (Engine.started) {
            this.started = false;
            Log.logString(LogLevel.INFO_1, 'Engine stopped');
        }
    }

    public static release(): void {
        if (Engine.started) {
            throw Error();
        }
        this.getResourceManager().releaseResources();
    }

    private static createNextFrame(): void {
        try {
            if (Engine.started) {
                Engine.createNextFrameUnsafe();
            }
        } catch (error) {
            Log.logObject(LogLevel.ERROR, error);
            this.getResourceManager().releaseResources();
        }
    }

    private static createNextFrameUnsafe(): void {
        Log.startGroup(`frame ${this.getTimeManager().getFrameCount()}`);
        (this.getTimeManager() as any).update();
        (this.getGameObjectContainer() as any).updateComponents();
        RenderingPipeline.render();
        Log.endGroup();
        Log.endFrame();
        window.requestAnimationFrame(Engine.createNextFrame);
    }

    public static isInitialized(): boolean {
        return Engine.initialized;
    }

    public static isStarted(): boolean {
        return Engine.started;
    }

}

