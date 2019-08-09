import { Component } from "../component/Component";
import { Time } from "../core/Time";
import { vec3 } from "gl-matrix";

export class PlayerComponent extends Component {

    private keyPresses = new Array<KeyboardEvent>();

    public constructor() {
        super();
        document.onkeydown = (ev: KeyboardEvent) => {
            this.keyPresses.push(ev);
        };
    }

    private includes(code: string): boolean {
        for (const kp of this.keyPresses) {
            if (kp.code === code) {
                return true;
            }
        }
        return false;
    }

    public private_update(): void {
        const moveSpeed = 1;
        const rotateSpeed = 1;
        const forwardSpeed = vec3.scale(vec3.create(), this.getGameObject().getTransform().getForwardVector(), moveSpeed * Time.getDeltaTimeFactor());
        const rightSpeed = vec3.scale(vec3.create(), this.getGameObject().getTransform().getRightVector(), moveSpeed * Time.getDeltaTimeFactor());
        const upSpeed = vec3.scale(vec3.create(), this.getGameObject().getTransform().getUpVector(), moveSpeed * Time.getDeltaTimeFactor());
        
        //move
        if (this.includes('KeyW')) {
            this.getGameObject().getTransform().move(forwardSpeed);
        }
        if (this.includes('KeyS')) {
            this.getGameObject().getTransform().move(vec3.negate(vec3.create(), forwardSpeed));
        }
        if (this.includes('KeyD')) {
            this.getGameObject().getTransform().move(rightSpeed);
        }
        if (this.includes('KeyA')) {
            this.getGameObject().getTransform().move(vec3.negate(vec3.create(), rightSpeed));
        }
        if (this.includes('KeyR')) {
            this.getGameObject().getTransform().move(upSpeed);
        }
        if (this.includes('KeyF')) {
            this.getGameObject().getTransform().move(vec3.negate(vec3.create(), upSpeed));
        }
        //rotate
        if (this.includes('KeyQ')) {
            this.getGameObject().getTransform().rotate(vec3.fromValues(0, rotateSpeed * Time.getDeltaTimeFactor(), 0));
        }
        if (this.includes('KeyE')) {
            this.getGameObject().getTransform().rotate(vec3.fromValues(0, -rotateSpeed * Time.getDeltaTimeFactor(), 0));
        }

        this.keyPresses = [];
    }
}