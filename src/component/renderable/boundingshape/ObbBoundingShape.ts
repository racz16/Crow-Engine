import { BoundingShape } from "./BoundingShape";
import { ICamera } from "../../camera/ICamera";
import { vec4 } from "gl-matrix";
import { Scene } from "../../../core/Scene";

export class ObbBoundingShape extends BoundingShape {

    private csObbCornerPoints: Array<vec4>;
    private camera: ICamera;

    public isInsideMainCameraFrustum(): boolean {
        if (this.isUsable()) {
            this.refresh();
            if (this.camera.isUsable()) {
                for (let i = 0; i < 3; i++) {
                    if (this.isOutsidePositivePlane(i) || this.isOutsideNegativePlane(i)) {
                        return false;
                    }
                }
            }
        }
        return true;
    }

    private isOutsidePositivePlane(coordinate: number) {
        for (const cp of this.csObbCornerPoints) {
            if (cp[coordinate] <= cp[3]) {
                return false;
            }
        }
        return true;
    }

    private isOutsideNegativePlane(coordinate: number) {
        for (const cp of this.csObbCornerPoints) {
            if (cp[coordinate] >= -cp[3]) {
                return false;
            }
        }
        return true;
    }

    private refresh(): void {
        this.handleMainCameraChange();
        if (!this.isValid()) {
            this.refreshUnsafe();
            this.setValid(true);
        }
    }

    private handleMainCameraChange(): void {
        const mainCamera = Scene.getParameters().getValue(Scene.MAIN_CAMERA);
        if (mainCamera != this.camera) {
            if (this.camera) {
                this.camera.removeInvalidatable(this);
            }
            this.camera = mainCamera;
            if (this.camera) {
                this.camera.addInvalidatable(this);
            }
            this.invalidate();
        }
    }

    private refreshUnsafe(): void {
        const cornerPoints = this.computeObjectSpaceAabbCornerPoints();
        const M = this.getRenderableComponent().getGameObject().getTransform().getModelMatrix();
        const V = this.camera.getViewMatrix();
        const P = this.camera.getProjectionMatrix();
        for (const cornerPoint of cornerPoints) {
            vec4.transformMat4(cornerPoint, cornerPoint, M);
            vec4.transformMat4(cornerPoint, cornerPoint, V);
            vec4.transformMat4(cornerPoint, cornerPoint, P);
        }
        this.csObbCornerPoints = cornerPoints;
    }

    public getClipSpaceObbCornerPoints(): IterableIterator<vec4> {
        if (this.isUsable()) {
            this.refresh();
            return this.csObbCornerPoints.values();
        } else {
            return null;
        }
    }

}