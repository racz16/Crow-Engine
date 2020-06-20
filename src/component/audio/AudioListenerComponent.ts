import { Component } from '../Component';
import { GameObject } from '../../core/GameObject';
import { Audio } from '../../resource/Audio';
import { Engine } from '../../core/Engine';
import { vec3 } from 'gl-matrix';
import { Axis } from '../../utility/Axis';

export class AudioListenerComponent extends Component {

    protected updateComponent(): void {
        const mainAudioListener = Engine.getMainAudioListener();
        if (this.isTheMainAudioListener() && !this.isValid() && this.getGameObject() && this.isActive()) {
            this.updateUnsafe();
        } else if (!mainAudioListener || !mainAudioListener.isActive() || !mainAudioListener.getGameObject()) {
            this.setAudioListenerToDefault();
        }
    }

    private updateUnsafe(): void {
        const position = this.getGameObject().getTransform().getAbsolutePosition();
        const forward = this.getGameObject().getTransform().getForwardVector();
        const up = this.getGameObject().getTransform().getUpVector();
        this.setAudioListener(position, forward, up);
        this.setValid(true);
    }

    private setAudioListenerToDefault(): void {
        const position = vec3.create();
        const forward = Axis.Z;
        const up = Axis.Y;
        this.setAudioListenerPosition(position);
        this.setAudioListenerDirections(forward, up);
    }

    public setAudioListener(position: vec3, forward: vec3, up: vec3): void {
        this.setAudioListenerPosition(position);
        this.setAudioListenerDirections(forward, up);
    }

    private setAudioListenerPosition(position: vec3): void {
        const listener = Audio.context.listener;
        if (Audio.isDeprecated()) {
            listener.setPosition(position[0], position[1], position[2]);
        } else {
            listener.positionX.setValueAtTime(position[0], 0);
            listener.positionY.setValueAtTime(position[1], 0);
            listener.positionZ.setValueAtTime(position[2], 0);
        }
    }

    private setAudioListenerDirections(forward: vec3, up: vec3): void {
        const listener = Audio.context.listener;
        if (Audio.isDeprecated()) {
            listener.setOrientation(forward[0], forward[1], forward[2], up[0], up[1], up[2]);
        } else {
            this.setAudioListenerOrientation(listener, forward, up);
        }
    }

    private setAudioListenerOrientation(listener: AudioListener, forward: vec3, up: vec3): void {
        listener.forwardX.setValueAtTime(forward[0], 0);
        listener.forwardY.setValueAtTime(forward[1], 0);
        listener.forwardZ.setValueAtTime(forward[2], 0);
        listener.upX.setValueAtTime(up[0], 0);
        listener.upY.setValueAtTime(up[1], 0);
        listener.upZ.setValueAtTime(up[2], 0);
    }

    public isTheMainAudioListener(): boolean {
        return Engine.getMainAudioListener() == this;
    }

    public setActive(active: boolean): void {
        super.setActive(active);
        if (!active && this.isTheMainAudioListener()) {
            this.setAudioListenerToDefault();
        }
    }

    protected handleAttach(attached: GameObject): void {
        attached.getTransform().getInvalidatables().add(this);
    }

    protected handleDetach(detached: GameObject): void {
        detached.getTransform().getInvalidatables().remove(this);
        if (this.isTheMainAudioListener()) {
            this.setAudioListenerToDefault();
        }
    }

}