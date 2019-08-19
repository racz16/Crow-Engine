import { Component } from "../Component";
import { Utility } from "../../utility/Utility";
import { PanningModelType, PanningModelTypeResolver } from "./enum/PanningModelType";
import { DistanceModelType, DistanceModelTypeResolver } from "./enum/DistanceModelType";
import { GameObject } from "../../core/GameObject";
import { Audio } from "../../resource/Audio";
import { IAudioSourceComponent } from "./IAudioSourceComponent";

export class AudioSourceComponent extends Component implements IAudioSourceComponent {

    private gain: GainNode;
    private panner: PannerNode;
    private bufferSource: AudioBufferSourceNode;
    private volume = 1;
    private loaded = false;

    public constructor(soundPath: string) {
        super();
        const ctx = Audio.context;
        this.bufferSource = ctx.createBufferSource();
        this.setAudioSource(soundPath);
        this.panner = ctx.createPanner();
        this.gain = ctx.createGain();
        this.bufferSource.connect(this.panner).connect(this.gain).connect(ctx.destination);
        this.gain.gain.value = this.volume;
        (Audio as any).add(this);
    }

    public static createAmbientAudioSourceComponent(soundPath: string): AudioSourceComponent {
        const asc = new AudioSourceComponent(soundPath);
        asc.setReductionSpeed(0);
        asc.setInnerAngle(360);
        asc.setOuterAngle(360);
        return asc;
    }

    public setAudioSource(soundPath: string): void {
        const ctx = Audio.context;
        Utility.loadResource<ArrayBuffer>(soundPath, (res) => {
            ctx.decodeAudioData(res, (data) => {
                this.bufferSource.buffer = data;
                this.loaded = true;
            });
        }, 'arraybuffer');
    }

    public start(): void {
        if (this.getGameObject() && this.isActive()) {
            this.bufferSource.start();
        }
    }

    public stop(): void {
        this.bufferSource.stop();
    }

    public getVolume(): number {
        return this.volume;
    }

    public setVolume(volume: number): void {
        if (volume < 0) {
            throw new Error();
        }
        this.volume = volume;
        this.gain.gain.setValueAtTime(volume * Audio.getVolume(), 0);
    }

    public isLoop(): boolean {
        return this.bufferSource.loop;
    }

    public setLoop(loop: boolean): void {
        this.bufferSource.loop = loop;
    }

    public getSpeed(): number {
        return this.bufferSource.playbackRate.value;
    }

    public setSpeed(speed: number): void {
        if (speed < 0) {
            throw new Error();
        }
        this.bufferSource.playbackRate.setValueAtTime(speed, 0);
    }

    public getPanningModel(): PanningModelType {
        return PanningModelTypeResolver.waToenum(this.panner.panningModel);
    }

    public setPanningModel(panningModelType: PanningModelType): void {
        const pmt = PanningModelTypeResolver.enumToWa(panningModelType);
        this.panner.panningModel = pmt;
    }

    public getDistanceModel(): DistanceModelType {
        return DistanceModelTypeResolver.waToEnum(this.panner.distanceModel);
    }

    public setDistanceModel(distanceModel: DistanceModelType): void {
        const dmt = DistanceModelTypeResolver.enumToWa(distanceModel);
        this.panner.distanceModel = dmt;
    }

    public getMinVolumeDistance(): number {
        return this.panner.refDistance;
    }

    public setMinVolumeDistance(distance: number): void {
        this.panner.refDistance = distance;
    }

    public getMaxVolumeDistance(): number {
        return this.panner.maxDistance;
    }

    public setMaxVolumeDistance(distance: number): void {
        this.panner.maxDistance = distance;
    }

    public getReductionSpeed(): number {
        return this.panner.rolloffFactor;
    }

    public setReductionSpeed(reductionSpeed: number): void {
        this.panner.rolloffFactor = reductionSpeed;
    }

    public getInnerAngle(): number {
        return this.panner.coneInnerAngle;
    }

    public setInnerAngle(angle: number): void {
        this.panner.coneInnerAngle = angle;
    }

    public getOuterAngle(): number {
        return this.panner.coneOuterAngle;
    }

    public setOuterAngle(angle: number): void {
        this.panner.coneOuterAngle = angle;
    }

    public getOuterAngleVolume(): number {
        return this.panner.coneOuterGain;
    }

    public setOuterAngleVolume(volume: number): void {
        if (volume > 0 || volume > 100) {
            throw new Error();
        }
        this.panner.coneOuterGain = volume;
    }

    protected updateComponent(): void {
        if (this.getGameObject() && !this.isValid() && this.isActive()) {
            this.updatePositionAndOrientationUnsafe();
            this.setVolume(this.volume);
            this.setValid(true);
        }
    }

    private updatePositionAndOrientationUnsafe(): void {
        const ctx = Audio.context;
        const position = this.getGameObject().getTransform().getAbsolutePosition();
        const forward = this.getGameObject().getTransform().getForwardVector();
        this.panner.positionX.setValueAtTime(position[0], ctx.currentTime);
        this.panner.positionY.setValueAtTime(position[1], ctx.currentTime);
        this.panner.positionZ.setValueAtTime(position[2], ctx.currentTime);
        this.panner.orientationX.setValueAtTime(forward[0], ctx.currentTime);
        this.panner.orientationY.setValueAtTime(forward[1], ctx.currentTime);
        this.panner.orientationZ.setValueAtTime(forward[2], ctx.currentTime);
    }

    public setActive(active: boolean): void {
        super.setActive(active);
        if (!active) {
            this.stop();
        }
    }

    public isUsable(): boolean {
        return this.loaded && this.getGameObject() && this.isActive();
    }

    protected attachToGameObject(gameObject: GameObject): void {
        super.attachToGameObject(gameObject);
        gameObject.getTransform().getInvalidatables().addInvalidatable(this);
    }

    protected detachFromGameObject(): void {
        this.getGameObject().getTransform().getInvalidatables().removeInvalidatable(this);
        super.detachFromGameObject();
        this.stop();
    }

}