import { Component } from '../Component';
import { GameObject } from '../../core/GameObject';
import { Audio } from '../../resource/Audio';
import { Engine } from '../../core/Engine';

export class AudioListenerComponent extends Component {

    public updateComponent(): void {
        if (this.isTheMainAudioListener() && !this.isValid() && this.getGameObject() && this.isActive()) {
            const position = this.getGameObject().getTransform().getAbsolutePosition();
            const forward = this.getGameObject().getTransform().getForwardVector();
            const up = this.getGameObject().getTransform().getUpVector();
            Audio.setAudioListener(position, forward, up);
            this.setValid(true);
        }
    }

    public isTheMainAudioListener(): boolean {
        return Engine.getMainAudioListener() == this;
    }

    protected handleAttach(attached: GameObject): void {
        attached.getTransform().getInvalidatables().add(this);
    }

    protected handleDetach(detached: GameObject): void {
        detached.getTransform().getInvalidatables().remove(this);
    }

}