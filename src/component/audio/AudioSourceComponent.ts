import { Component } from '../Component';
import { PanningModelType, PanningModelTypeResolver } from './enum/PanningModelType';
import { DistanceModelType, DistanceModelTypeResolver } from './enum/DistanceModelType';
import { GameObject } from '../../core/GameObject';
import { Audio } from '../../resource/Audio';
import { IAudioSourceComponent } from './IAudioSourceComponent';

export class AudioSourceComponent extends Component implements IAudioSourceComponent {

    private gain: GainNode;
    private panner: PannerNode;
    private bufferSource: AudioBufferSourceNode;
    private volume = 1;
    private ctx: AudioContext;
    private loaded = false;

    public constructor(soundPath: string) {
        super();
        this.ctx = Audio.context;
        this.bufferSource = this.ctx.createBufferSource();
        this.setAudioSource(soundPath);
        this.panner = this.ctx.createPanner();
        this.gain = this.ctx.createGain();
        this.bufferSource.connect(this.panner).connect(this.gain).connect(this.ctx.destination);
        this.gain.gain.value = this.volume;
    }

    public static createAmbientAudioSourceComponent(soundPath: string): AudioSourceComponent {
        const asc = new AudioSourceComponent(soundPath);
        asc.setReductionSpeed(0);
        asc.setInnerAngle(360);
        asc.setOuterAngle(360);
        return asc;
    }

    public async setAudioSource(soundPath: string): Promise<void> {
        const response = await fetch(soundPath);
        const arrayBuffer = await response.arrayBuffer();
        const audioBuffer = await this.ctx.decodeAudioData(arrayBuffer);
        this.bufferSource.buffer = audioBuffer;
        this.loaded = true;
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
        this.gain.gain.setValueAtTime(volume * Audio.getVolume(), this.ctx.currentTime);
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
        this.bufferSource.playbackRate.setValueAtTime(speed, this.ctx.currentTime);
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
        if (reductionSpeed < 0) {
            throw new Error();
        }
        this.panner.rolloffFactor = reductionSpeed;
    }

    public getInnerAngle(): number {
        return this.panner.coneInnerAngle;
    }

    public setInnerAngle(angle: number): void {
        if (angle > this.getInnerAngle()) {
            throw new Error();
        }
        this.panner.coneInnerAngle = angle;
    }

    public getOuterAngle(): number {
        return this.panner.coneOuterAngle;
    }

    public setOuterAngle(angle: number): void {
        if (angle > 360 || angle < this.getInnerAngle()) {
            throw new Error();
        }
        this.panner.coneOuterAngle = angle;
    }

    public getOuterAngleVolume(): number {
        return this.panner.coneOuterGain;
    }

    public setOuterAngleVolume(volume: number): void {
        if (volume > 0 || volume > 1) {
            throw new Error();
        }
        this.panner.coneOuterGain = volume;
    }

    public updateComponent(): void {
        if (this.getGameObject() && !this.isValid() && this.isActive()) {
            this.updatePositionAndOrientationUnsafe();
            this.setVolume(this.volume);
            this.setValid(true);
        }
    }

    private updatePositionAndOrientationUnsafe(): void {
        const position = this.getGameObject().getTransform().getAbsolutePosition();
        const forward = this.getGameObject().getTransform().getForwardVector();
        this.panner.positionX.setValueAtTime(position[0], this.ctx.currentTime);
        this.panner.positionY.setValueAtTime(position[1], this.ctx.currentTime);
        this.panner.positionZ.setValueAtTime(position[2], this.ctx.currentTime);
        this.panner.orientationX.setValueAtTime(forward[0], this.ctx.currentTime);
        this.panner.orientationY.setValueAtTime(forward[1], this.ctx.currentTime);
        this.panner.orientationZ.setValueAtTime(forward[2], this.ctx.currentTime);
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

    public isLoaded(): boolean {
        return this.loaded;
    }

    protected handleAttach(attached: GameObject): void {
        attached.getTransform().getInvalidatables().add(this);
        Audio.addAudioSource(this);
    }

    protected handleDetach(detached: GameObject): void {
        detached.getTransform().getInvalidatables().remove(this);
        this.stop();
        Audio.removeAudioSource(this);
    }

}