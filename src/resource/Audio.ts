import { IAudioSourceComponent } from '../component/audio/IAudioSourceComponent';
import { LogLevel } from '../utility/log/LogLevel';
import { Engine } from '../core/Engine';
import { ReadonlyVec3, vec3 } from 'gl-matrix';
import { Axis } from '../utility/Axis';

export class Audio {

    private static ctx: AudioContext;
    private static deprecated: boolean;
    private static volume = 1;
    private static audioSources = new Array<IAudioSourceComponent>();

    private constructor() { }

    public static initialize(): void {
        this.ctx = new AudioContext();
        this.deprecated = this.ctx.listener.positionX === undefined; // Firefox supports only the legacy API
        Engine.getLog().logString(LogLevel.INFO_1, 'Web Audio API initialized');
    }

    public static update(): void {
        const mainAudioListener = Engine.getMainAudioListener();
        if (!mainAudioListener || !mainAudioListener.isActive() || !mainAudioListener.getGameObject()) {
            this.setAudioListenerToDefault();
        }
    }

    private static setAudioListenerToDefault(): void {
        const position = vec3.create();
        const forward = Axis.Z_NEGATE;
        const up = Axis.Y;
        this.setAudioListenerPosition(position);
        this.setAudioListenerDirections(forward, up);
    }

    public static setAudioListener(position: ReadonlyVec3, forward: ReadonlyVec3, up: ReadonlyVec3): void {
        this.setAudioListenerPosition(position);
        this.setAudioListenerDirections(forward, up);
    }

    private static setAudioListenerPosition(position: ReadonlyVec3): void {
        const listener = Audio.context.listener;
        if (Audio.isDeprecated()) {
            listener.setPosition(position[0], position[1], position[2]);
        } else {
            listener.positionX.setValueAtTime(position[0], this.ctx.currentTime);
            listener.positionY.setValueAtTime(position[1], this.ctx.currentTime);
            listener.positionZ.setValueAtTime(position[2], this.ctx.currentTime);
        }
    }

    private static setAudioListenerDirections(forward: ReadonlyVec3, up: ReadonlyVec3): void {
        const listener = Audio.context.listener;
        if (Audio.isDeprecated()) {
            listener.setOrientation(forward[0], forward[1], forward[2], up[0], up[1], up[2]);
        } else {
            this.setAudioListenerOrientation(listener, forward, up);
        }
    }

    private static setAudioListenerOrientation(listener: AudioListener, forward: ReadonlyVec3, up: ReadonlyVec3): void {
        listener.forwardX.setValueAtTime(forward[0], this.ctx.currentTime);
        listener.forwardY.setValueAtTime(forward[1], this.ctx.currentTime);
        listener.forwardZ.setValueAtTime(forward[2], this.ctx.currentTime);
        listener.upX.setValueAtTime(up[0], this.ctx.currentTime);
        listener.upY.setValueAtTime(up[1], this.ctx.currentTime);
        listener.upZ.setValueAtTime(up[2], this.ctx.currentTime);
    }

    public static addAudioSource(audioSource: IAudioSourceComponent): void {
        if (!this.containsAudioSource(audioSource)) {
            this.audioSources.push(audioSource);
        }
    }

    public static containsAudioSource(audioSource: IAudioSourceComponent): boolean {
        return this.audioSources.includes(audioSource);
    }

    public static getAudioSourceCount(): number {
        return this.audioSources.length;
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

    public static resume(): void {
        this.ctx.resume();
    }

    public static isDeprecated(): boolean {
        return this.deprecated;
    }

}