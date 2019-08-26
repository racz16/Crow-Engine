import { Component } from '../component/Component';
import { vec3 } from 'gl-matrix';
import { Time } from '../core/Time';

export class RotateComponent extends Component {

    protected updateComponent(): void {
        this.getGameObject().getTransform().rotate(vec3.fromValues(0, Time.getDeltaTimeFactor(), 0));
    }
}