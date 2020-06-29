import { Billboard } from './Billboard';
import { vec3, ReadonlyVec3 } from 'gl-matrix';
import { Utility } from '../../../utility/Utility';

export class RealSphericalBillboard extends Billboard {

    protected refreshUnsafe(): void {
        const cameraTransform = this.getMainCameraTransform();
        const cameraPosition = cameraTransform.getAbsolutePosition();
        const cameraUp = cameraTransform.getUpVector();
        const transform = this.getRenderableComponent().getGameObject().getTransform();
        const position = transform.getAbsolutePosition();
        const forward = vec3.normalize(vec3.create(), vec3.subtract(vec3.create(), cameraPosition, position));
        this.refreshMatricesOrSetToDefault(forward, cameraUp);
    }

    private refreshMatricesOrSetToDefault(forward: ReadonlyVec3, cameraUp: ReadonlyVec3): void {
        if (Utility.isParallel(forward, cameraUp)) {
            this.setMatricesToDefault();
        } else {
            this.refreshData(forward, cameraUp);
        }
    }

    private refreshData(forward: ReadonlyVec3, cameraUp: ReadonlyVec3): void {
        const right = vec3.cross(vec3.create(), cameraUp, forward);
        const up = vec3.cross(vec3.create(), forward, right);
        this.refreshDataFromDirections(forward, up, right);
    }

}