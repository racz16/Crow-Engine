import { GameObjectContainer } from "./GameObjectContainer";
import { ParameterContainer } from "../utility/parameter/ParameterContainer";
import { ParameterKey } from "../utility/parameter/ParameterKey";
import { ICameraComponent } from "../component/camera/ICameraComponent";
import { CameraComponent } from "../component/camera/CameraComponent";
import { AudioListenerComponent } from "../component/audio/AudioListenerComponent";
import { CubeMapTexture } from "../resource/texture/CubeMapTexture";
import { ICubeMapTexture } from "../resource/texture/ICubeMapTexture";

export class Scene {

    public static readonly MAIN_CAMERA = new ParameterKey<ICameraComponent>(CameraComponent, 'MAIN_CAMERA');
    public static readonly MAIN_SKYBOX = new ParameterKey<ICubeMapTexture>(CubeMapTexture, 'MAIN_SKYBOX');
    public static readonly MAIN_AUDIO_LISTENER = new ParameterKey<AudioListenerComponent>(AudioListenerComponent, 'MAIN_AUDIO_LISTENER');
    private static readonly GAMEOBJECTS = new GameObjectContainer();
    private static readonly PARAMETERS = new ParameterContainer();

    private constructor() { }

    public static getGameObjects(): GameObjectContainer {
        return Scene.GAMEOBJECTS;
    }

    public static getParameters(): ParameterContainer {
        return Scene.PARAMETERS;
    }

}