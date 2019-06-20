import { Component } from "../../core/Component";
import { GameObject } from "../../core/GameObject";
import { Scene } from "../../core/Scene";
import { Audio } from "../../resource/Audio";

export class AudioListenerComponent extends Component {
    private invalid: boolean;

    public private_update(): void {
        if (this.isTheMainAudioListener() && this.invalid && this.getGameObject() != null && this.isActive()) {
            const position = this.getGameObject().getTransform().getAbsolutePosition();
            const forward = this.getGameObject().getTransform().getForwardVector();
            const up = this.getGameObject().getTransform().getUpVector();
            Audio.setAudioListener(position, forward, up);
            this.invalid = false;
        }
    }

    public invalidate() {
        super.invalidate();
        this.invalid = true;
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

    public private_attachToGameObject(go: GameObject): void {
        super.private_attachToGameObject(go);
        go.getTransform().addInvalidatable(this);
        this.invalidate();
    }

    public private_detachFromGameObject(): void {
        this.getGameObject().getTransform().removeInvalidatable(this);
        super.private_detachFromGameObject();
        this.invalidate();
        if (this.isTheMainAudioListener) {
            Audio.setAudioListenerToDefault();
        }
    }

}