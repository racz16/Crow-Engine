import { Component } from '../component/Component';
import { Engine } from '../core/Engine';
import { RotationBuilder } from '../utility/RotationBuilder';
import { Axis } from '../utility/Axis';

export class RotateComponent extends Component {

    protected updateComponent(): void {
        const rotationSpeed = 0.1;
        const deltaTime = Engine.getTimeManager().getDeltaTimeFactor();
        const rotation = RotationBuilder.createRotation(Axis.Y, rotationSpeed * deltaTime).getQuaternion();
        this.getGameObject().getTransform().rotate(rotation);
    }
}