import { vec3 } from "gl-matrix";
import { IAudioSourceComponent } from "../component/audio/IAudioSourceComponent";
import { Log } from "../utility/log/Log";
import { LogLevel } from "../utility/log/LogLevel";
import { LogType } from "../utility/log/LogType";

export class Audio {

    private static ctx: AudioContext;
    private static deprecated: boolean;
    private static volume = 1;
    private static audioSources = new Array<IAudioSourceComponent>();

    private constructor() { }

    public static initialize(): void {
        this.ctx = new AudioContext();
        this.deprecated = this.ctx.listener.positionX === undefined;
        Log.logString(LogLevel.INFO_2, LogType.RESOURCES, 'Web Audio API initialized');
    }

    private static add(audioSource: IAudioSourceComponent): void {
        if (!this.audioSources.includes(audioSource)) {
            this.audioSources.push(audioSource);
        }
    }

    public static getAudioSourceCount(): number {
        return this.audioSources.length;
    }

    public static getAudioSource(index: number): IAudioSourceComponent {
        return this.audioSources[index];
    }

    public static getAudioSourcesIterator(): IterableIterator<IAudioSourceComponent> {
        return this.audioSources.values();
    }

    public static get context(): AudioContext {
        return this.ctx;
    }

    public static getVolume(): number {
        return this.volume;
    }

    public static setVolume(volume: number): void {
        if (volume < 0) {
            throw new Error();
        }
        this.volume = volume;
        for (const audioSource of this.audioSources) {
            audioSource.invalidate();
        }
    }

    public static isContextUsable(): boolean {
        return this.ctx.state === 'running';
    }

    public static tryStartContext(): void {
        this.ctx.resume();
    }

    public static setAudioListenerToDefault(): void {
        const position = vec3.create();
        const forward = vec3.fromValues(0, 0, 1);
        const up = vec3.fromValues(0, 1, 0);
        this.setAudioListenerPosition(position);
        this.setAudioListenerDirections(forward, up);
    }

    public static setAudioListener(position: vec3, forward: vec3, up: vec3): void {
        this.setAudioListenerPosition(position);
        this.setAudioListenerDirections(forward, up);
    }

    private static setAudioListenerPosition(position: vec3): void {
        const listener = this.context.listener;
        if (this.deprecated) {
            listener.setPosition(position[0], position[1], position[2]);
        } else {
            listener.positionX.setValueAtTime(position[0], 0);
            listener.positionY.setValueAtTime(position[1], 0);
            listener.positionZ.setValueAtTime(position[2], 0);
        }
    }

    private static setAudioListenerDirections(forward: vec3, up: vec3): void {
        const listener = this.context.listener;
        if (this.deprecated) {
            listener.setOrientation(forward[0], forward[1], forward[2], up[0], up[1], up[2]);
        } else {
            this.setAudioListenerOrientation(listener, forward, up);
        }
    }

    private static setAudioListenerOrientation(listener: AudioListener, forward: vec3, up: vec3): void {
        listener.forwardX.setValueAtTime(forward[0], 0);
        listener.forwardY.setValueAtTime(forward[1], 0);
        listener.forwardZ.setValueAtTime(forward[2], 0);
        listener.upX.setValueAtTime(up[0], 0);
        listener.upY.setValueAtTime(up[1], 0);
        listener.upZ.setValueAtTime(up[2], 0);
    }
}