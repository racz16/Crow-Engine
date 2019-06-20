import { Component } from "../core/Component";
import { vec3 } from "gl-matrix";
import { Time } from "../core/Time";

export class RotateComponent extends Component {

    public private_update(): void {
        this.getGameObject().getTransform().rotate(vec3.fromValues(0, Time.getDeltaTimeFactor(), 0));
    }
}