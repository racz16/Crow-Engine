import { Billboard } from './Billboard';
import { BillboardAxis } from './BillboardAxis';
import { vec3 } from 'gl-matrix';
import { Utility } from '../../../utility/Utility';

export class AxisAlignedCylindricalBillboard extends Billboard {

    private axis: BillboardAxis;

    public constructor(axis: BillboardAxis) {
        super();
        this.setAxis(axis);
    }

    public getAxis(): BillboardAxis {
        return this.axis;
    }

    public setAxis(axis: BillboardAxis): void {
        if (axis == null) {
            throw new Error();
        }
        this.axis = axis;
        this.invalidate();
    }

    protected refreshUnsafe(): void {
        const cameraPosition = this.getMainCameraTransform().getAbsolutePosition();
        const transform = this.getRenderableComponent().getGameObject().getTransform();
        const position = transform.getAbsolutePosition();
        const up = this.computeUp();
        const forward = this.computeForward(cameraPosition, position);
        if (Utility.isParallel(forward, up) || vec3.length(forward) === 0) {
            this.setMatricesToDefault();
        } else {
            this.refreshData(forward, up);
        }
    }

    private computeUp(): vec3 {
        const up = vec3.create();
        up[this.axis] = 1;
        return up;
    }

    private computeForward(cameraPosition: vec3, position: vec3): vec3 {
        const forward = vec3.subtract(vec3.create(), cameraPosition, position);
        forward[this.axis] = 0;
        vec3.normalize(forward, forward);
        return forward;
    }

    private refreshData(forward: vec3, up: vec3): void {
        const right = vec3.cross(vec3.create(), up, forward);
        this.refreshDataFromDirections(forward, up, right);
    }

}