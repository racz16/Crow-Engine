import { Billboard } from './Billboard';
import { mat4, vec3 } from 'gl-matrix';

export class InverseCameraSphericalBillboard extends Billboard {

    protected refreshUnsafe(): void {
        const cameraTransform = this.getCamera().getGameObject().getTransform();

        const forward = cameraTransform.getForwardVector();
        const up = cameraTransform.getUpVector();
        const right = vec3.negate(vec3.create(), cameraTransform.getRightVector());
        const modelMatrix = this.createBillboard(forward, up, right);
        const inverseModelMatrix = mat4.invert(mat4.create(), modelMatrix);
        this.setModelMatrix(modelMatrix);
        this.setInverseModelMatrix(inverseModelMatrix);
    }

}