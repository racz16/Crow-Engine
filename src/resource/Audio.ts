import { IAudioSourceComponent } from '../component/audio/IAudioSourceComponent';
import { Log } from '../utility/log/Log';
import { LogLevel } from '../utility/log/LogLevel';

export class Audio {

    private static ctx: AudioContext;
    private static deprecated: boolean;
    private static volume = 1;
    private static audioSources = new Array<IAudioSourceComponent>();

    private constructor() { }

    public static initialize(): void {
        this.ctx = new AudioContext();
        this.deprecated = this.ctx.listener.positionX === undefined; // Firefox supports only the legacy API
        Log.logString(LogLevel.INFO_1, 'Web Audio API initialized');
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