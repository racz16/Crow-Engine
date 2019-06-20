import { vec3 } from "gl-matrix";

export class Audio {
    private static ctx: AudioContext;
    private static muted = true;

    private constructor() { }

    public static initialize(): void {
        Audio.ctx = new AudioContext();
        this.ctx.suspend();
    }

    public static get context(): AudioContext {
        return Audio.ctx;
    }

    public static isMuted(): boolean {
        return Audio.muted;
    }

    public static setMuted(muted: boolean): void {
        Audio.muted = muted;
        if (!Audio.isMuted()) {
            this.ctx.resume();
        }
    }

    public static setAudioListenerToDefault(): void {
        const position = vec3.create();
        const forward = vec3.fromValues(0, 0, 1);
        const up = vec3.fromValues(0, 1, 0);
        this.setAudioListenerPosition(position);
        this.setAudioListenerDirections(forward, up);
    }

    public static setAudioListener(position: vec3, forward: vec3, up: vec3): void {
        Audio.setAudioListenerPosition(position);
        Audio.setAudioListenerDirections(forward, up);
    }

    private static setAudioListenerPosition(position: vec3): void {
        const listener = Audio.context.listener;
        listener.positionX.setValueAtTime(position[0], 0);
        listener.positionY.setValueAtTime(position[1], 0);
        listener.positionZ.setValueAtTime(position[2], 0);
    }

    private static setAudioListenerDirections(forward: vec3, up: vec3): void {
        const listener = Audio.context.listener;
        listener.forwardX.setValueAtTime(forward[0], 0);
        listener.forwardY.setValueAtTime(forward[1], 0);
        listener.forwardZ.setValueAtTime(forward[2], 0);
        listener.upX.setValueAtTime(up[0], 0);
        listener.upY.setValueAtTime(up[1], 0);
        listener.upZ.setValueAtTime(up[2], 0);
    }
}