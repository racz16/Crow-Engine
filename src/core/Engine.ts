import { Time } from "./Time";
import { Gl } from "../webgl/Gl";
import { Scene } from "./Scene";
import { ResourceManager } from "../resource/ResourceManager";
import { RenderingPipeline } from "../rendering/RenderingPipeline";
import { Audio } from "../resource/Audio";

export class Engine {

    private static initialized = false;
    private static started = false;

    private constructor() { }

    public static initialize(canvas: HTMLCanvasElement): void {
        try {
            Gl.initialize(canvas);
            Audio.initialize();
            RenderingPipeline.initialize();
            Engine.initialized = true;
        } catch (error) {
            console.error(error);
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
    }

    private static createNextFrame(): void {
        try {
            Time.private_update();
            Scene.getGameObjects().private_updateComponents();
            RenderingPipeline.render();
            window.requestAnimationFrame(Engine.createNextFrame);
        } catch (error) {
            console.error(error);
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

