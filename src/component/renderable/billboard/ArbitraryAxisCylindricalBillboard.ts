import { Billboard } from "./Billboard";
import { vec3, mat4 } from "gl-matrix";

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
        const cameraTransform = this.getCamera().getGameObject().getTransform();
        const cameraPosition = cameraTransform.getAbsolutePosition();
        const transform = this.getRenderableComponent().getGameObject().getTransform();
        const position = transform.getAbsolutePosition();
        let forward = vec3.normalize(vec3.create(), vec3.subtract(vec3.create(), cameraPosition, position));
        if (vec3.dot(forward, this.axis) === 1) {
            this.setMatricesToDefault();
        } else {
            this.refreshMatrices(forward);
        }
    }

    private refreshMatrices(forward: vec3): void {
        const right = vec3.cross(vec3.create(), this.axis, forward);
        forward = vec3.cross(vec3.create(), right, this.axis);
        const modelMatrix = this.createBillboard(forward, this.axis, right);
        const inverseModelMatrix = mat4.invert(mat4.create(), modelMatrix);
        this.setModelMatrix(modelMatrix);
        this.setInverseModelMatrix(inverseModelMatrix);
    }

}