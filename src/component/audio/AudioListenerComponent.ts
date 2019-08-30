import { Component } from '../Component';
import { GameObject } from '../../core/GameObject';
import { Scene } from '../../core/Scene';
import { Audio } from '../../resource/Audio';

export class AudioListenerComponent extends Component {

    protected updateComponent(): void {
        if (this.isTheMainAudioListener() && !this.isValid() && this.getGameObject() && this.isActive()) {
            const position = this.getGameObject().getTransform().getAbsolutePosition();
            const forward = this.getGameObject().getTransform().getForwardVector();
            const up = this.getGameObject().getTransform().getUpVector();
            Audio.setAudioListener(position, forward, up);
            this.setValid(true);
        }
    }

    public isTheMainAudioListener(): boolean {
        return Scene.getParameters().get(Scene.MAIN_AUDIO_LISTENER) == this;
    }

    public setActive(active: boolean): void {
        super.setActive(active);
        if (!active && this.isTheMainAudioListener()) {
            Audio.setAudioListenerToDefault();
        }
    }

    protected handleAttach(attached: GameObject): void {
        attached.getTransform().getInvalidatables().addInvalidatable(this);
    }

    protected handleDetach(detached: GameObject): void {
        detached.getTransform().getInvalidatables().removeInvalidatable(this);
        if (this.isTheMainAudioListener()) {
            Audio.setAudioListenerToDefault();
        }
    }

}