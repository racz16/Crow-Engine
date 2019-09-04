import { Billboard } from './Billboard';
import { vec3 } from 'gl-matrix';
import { Utility } from '../../../utility/Utility';

export class ArbitraryAxisCylindricalBillboard extends Billboard {

    private axis: vec3;

    public constructor(axis: vec3) {
        super();
        this.setAxis(axis);
    }

    public getAxis(): vec3 {
        return vec3.clone(this.axis);
    }

    public setAxis(axis: vec3): void {
        if (!axis) {
            throw new Error();
        }
        this.axis = vec3.normalize(vec3.create(), axis);
        this.invalidate();
    }

    protected refreshUnsafe(): void {
        const cameraTransform = this.getMainCameraTransform();
        const cameraPosition = cameraTransform.getAbsolutePosition();
        const transform = this.getRenderableComponent().getGameObject().getTransform();
        const position = transform.getAbsolutePosition();
        const forward = vec3.normalize(vec3.create(), vec3.subtract(vec3.create(), cameraPosition, position));
        if (Utility.isParallel(forward, this.axis)) {
            this.setMatricesToDefault();
        } else {
            this.refreshData(forward);
        }
    }

    private refreshData(forward: vec3): void {
        const right = vec3.cross(vec3.create(), this.axis, forward);
        forward = vec3.cross(vec3.create(), right, this.axis);
        this.refreshDataFromDirections(forward, this.axis, right);
    }

}