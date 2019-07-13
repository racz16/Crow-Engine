import { Component } from "../../core/Component";
import { GameObject } from "../../core/GameObject";
import { Scene } from "../../core/Scene";
import { Audio } from "../../resource/Audio";

export class AudioListenerComponent extends Component {

    public private_update(): void {
        if (this.isTheMainAudioListener() && !this.isValid() && this.getGameObject() && this.isActive()) {
            const position = this.getGameObject().getTransform().getAbsolutePosition();
            const forward = this.getGameObject().getTransform().getForwardVector();
            const up = this.getGameObject().getTransform().getUpVector();
            Audio.setAudioListener(position, forward, up);
            this.setValid(true);
        }
    }

    public isTheMainAudioListener(): boolean {
        return Scene.getParameters().getValue(Scene.MAIN_AUDIO_LISTENER) === this;
    }

    public setActive(active: boolean): void {
        super.setActive(active);
        if (!active && this.isTheMainAudioListener()) {
            Audio.setAudioListenerToDefault();
        }
    }

    public private_attachToGameObject(gameObject: GameObject): void {
        super.private_attachToGameObject(gameObject);
        gameObject.getTransform().getInvalidatables().addInvalidatable(this);
    }

    public private_detachFromGameObject(): void {
        this.getGameObject().getTransform().getInvalidatables().removeInvalidatable(this);
        super.private_detachFromGameObject();
        if (this.isTheMainAudioListener()) {
            Audio.setAudioListenerToDefault();
        }
    }

}