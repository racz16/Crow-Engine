import { TimeManager } from './TimeManager';
import { Gl } from '../webgl/Gl';
import { ResourceManager } from '../resource/ResourceManager';
import { RenderingPipeline } from '../rendering/RenderingPipeline';
import { Audio } from '../resource/Audio';
import { Log } from '../utility/log/Log';
import { LogLevel } from '../utility/log/LogLevel';
import { ParameterKey } from '../utility/parameter/ParameterKey';
import { AudioListenerComponent } from '../component/audio/AudioListenerComponent';
import { GameObjectContainer } from './GameObjectContainer';
import { ParameterContainer } from '../utility/parameter/ParameterContainer';
import { ICameraComponent } from '../component/camera/ICameraComponent';
import { ITexture2D } from '../resource/texture/ITexture2D';
import { ITexture2DArray } from '../resource/texture/ITexture2DArray';
import { ICubeMapTexture } from '../resource/texture/ICubeMapTexture';
import { ITimeManager } from './ITimeManager';
import { IGameObjectContainer } from './IGameObjectContainer';
import { IResourceManager } from '../resource/IResourceManager';
import { IRenderingPipeline } from '../rendering/IRenderingPipeline';

export class Engine {

    public static readonly MAIN_CAMERA = new ParameterKey<ICameraComponent>('MAIN_CAMERA');
    public static readonly MAIN_AUDIO_LISTENER = new ParameterKey<AudioListenerComponent>('MAIN_AUDIO_LISTENER');

    public static readonly GAMEOBJECT_CONTAINER = new ParameterKey<IGameObjectContainer>('GAMEOBJECT_CONTAINER');
    public static readonly TIME_MANAGER = new ParameterKey<ITimeManager>('TIME_MANAGER');
    public static readonly RESOURCE_MANAGER = new ParameterKey<IResourceManager>('RESOURCE_MANAGER');
    public static readonly RENDERING_PIPELINE = new ParameterKey<IRenderingPipeline>('RENDERING_PIPELINE');

    public static readonly BLACK_TEXTURE_2D = new ParameterKey<ITexture2D>('BLACK_TEXTURE_2D');
    public static readonly WHITE_TEXTURE_2D = new ParameterKey<ITexture2D>('WHITE_TEXTURE_2D');
    public static readonly DEFAULT_TEXTURE_2D_ARRAY = new ParameterKey<ITexture2DArray>('DEFAULT_TEXTURE_2D_ARRAY');
    public static readonly DEFAULT_CUBE_MAP_TEXTURE = new ParameterKey<ICubeMapTexture>('DEFAULT_CUBE_MAP_TEXTURE');

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
            this.getResourceManager().release();
        }
    }

    private static initializeUnsafe(canvas: HTMLCanvasElement, logLevel: LogLevel): void {
        Log.startGroup('initialization');
        Log.initialize(logLevel);
        this.addSystemsBeforeInitialize();
        Gl.initialize(canvas);
        Audio.initialize();
        this.addSystemsAfterInitialize();
        Engine.initialized = true;
        Log.endGroup();
    }

    private static addSystemsBeforeInitialize(): void {
        this.setResourceManager(new ResourceManager());
        this.setGameObjectContainer(new GameObjectContainer());
        this.setTimeManager(new TimeManager());
    }

    private static addSystemsAfterInitialize(): void {
        const renderingPipeline = new RenderingPipeline();
        this.setRenderingPipeline(renderingPipeline);
        renderingPipeline.initialize();
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

    public static getGameObjectContainer(): IGameObjectContainer {
        return this.PARAMETERS.get(this.GAMEOBJECT_CONTAINER);
    }

    public static setGameObjectContainer(gameObjectContainer: IGameObjectContainer): void {
        if (!gameObjectContainer) {
            Log.logString(LogLevel.WARNING, 'GameObject container set to null');
        }
        this.PARAMETERS.set(this.GAMEOBJECT_CONTAINER, gameObjectContainer);
    }

    public static getTimeManager(): ITimeManager {
        return this.PARAMETERS.get(this.TIME_MANAGER);
    }

    public static setTimeManager(timeManager: ITimeManager): void {
        if (!timeManager) {
            Log.logString(LogLevel.WARNING, 'Time Manager set to null');
        }
        this.PARAMETERS.set(this.TIME_MANAGER, timeManager);
    }

    public static getResourceManager(): IResourceManager {
        return this.PARAMETERS.get(this.RESOURCE_MANAGER);
    }

    public static setResourceManager(resourceManager: IResourceManager): void {
        if (!resourceManager) {
            Log.logString(LogLevel.WARNING, 'Resource Manager set to null');
        }
        this.PARAMETERS.set(this.RESOURCE_MANAGER, resourceManager);
    }

    public static getRenderingPipeline(): IRenderingPipeline {
        return this.PARAMETERS.get(this.RENDERING_PIPELINE);
    }

    public static setRenderingPipeline(renderingPipeline: IRenderingPipeline): void {
        if (!renderingPipeline) {
            Log.logString(LogLevel.WARNING, 'Rendering Pipeline set to null');
        }
        this.PARAMETERS.set(this.RENDERING_PIPELINE, renderingPipeline);
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

    private static createNextFrame(): void {
        try {
            if (Engine.started) {
                Engine.createNextFrameUnsafe();
            }
        } catch (error) {
            Log.logObject(LogLevel.ERROR, error);
            this.getResourceManager().release();
        }
    }

    private static createNextFrameUnsafe(): void {
        Log.startGroup(`frame ${this.getTimeManager().getFrameCount()}`);
        this.PARAMETERS.get(this.TIME_MANAGER).endFrame();
        this.getGameObjectContainer().update();
        this.getRenderingPipeline().render();
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
