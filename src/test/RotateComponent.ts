import { Component } from '../component/Component';
import { vec3 } from 'gl-matrix';
import { Engine } from '../core/Engine';

export class RotateComponent extends Component {

    protected updateComponent(): void {
        this.getGameObject().getTransform().rotate(vec3.fromValues(0, Engine.getTimeManager().getDeltaTimeFactor() * 0.1, 0));
    }
}