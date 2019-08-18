import { BoundingShape } from "./BoundingShape";
import { ICameraComponent } from "../../camera/ICameraComponent";
import { vec4, mat4 } from "gl-matrix";
import { Scene } from "../../../core/Scene";

export class ObbBoundingShape extends BoundingShape {

    private clipSpaceObbCornerPoints: Array<vec4>;
    private camera: ICameraComponent;

    public isInsideMainCameraFrustum(): boolean {
        if (this.isUsable() && !this.getRenderableComponent().getBillboard()) {
            this.refresh();
            if (this.camera) {
                this.isInsideMainCameraFrustumUnsafe();
            }
        }
        return true;
    }

    private isInsideMainCameraFrustumUnsafe(): boolean {
        for (let i = 0; i < 3; i++) {
            if (this.isOutsidePositivePlane(i) || this.isOutsideNegativePlane(i)) {
                return false;
            }
        }
        return true;
    }

    private isOutsidePositivePlane(coordinate: number) {
        for (const cp of this.clipSpaceObbCornerPoints) {
            if (cp[coordinate] <= cp[3]) {
                return false;
            }
        }
        return true;
    }

    private isOutsideNegativePlane(coordinate: number) {
        for (const cp of this.clipSpaceObbCornerPoints) {
            if (cp[coordinate] >= -cp[3]) {
                return false;
            }
        }
        return true;
    }

    private refresh(): void {
        this.handleMainCameraChange();
        if (!this.isValid() && !this.getRenderableComponent().getBillboard() && this.isUsable() && this.camera) {
            this.refreshUnsafe();
            this.setValid(true);
        }
    }

    private handleMainCameraChange(): void {
        const mainCamera = Scene.getParameters().get(Scene.MAIN_CAMERA);
        if (mainCamera != this.camera) {
            this.changeCamera(mainCamera);
        }
    }

    private changeCamera(mainCamera: ICameraComponent) {
        if (this.camera) {
            this.camera.getInvalidatables().removeInvalidatable(this);
        }
        this.camera = mainCamera;
        if (this.camera) {
            this.camera.getInvalidatables().addInvalidatable(this);
        }
        this.invalidate();
    }

    private refreshUnsafe(): void {
        const cornerPoints = this.computeObjectSpaceAabbCornerPoints();
        const MVP = mat4.create();
        mat4.mul(MVP, this.camera.getProjectionMatrix(), mat4.mul(MVP, this.camera.getViewMatrix(), this.getRenderableComponent().getModelMatrix()));
        for (const cornerPoint of cornerPoints) {
            vec4.transformMat4(cornerPoint, cornerPoint, MVP);
        }
        this.clipSpaceObbCornerPoints = cornerPoints;
    }

    public getClipSpaceObbCornerPoints(): IterableIterator<vec4> {
        if (this.isUsable() && !this.getRenderableComponent().getBillboard()) {
            this.refresh();
            if (this.camera) {
                return this.clipSpaceObbCornerPoints.values();
            }
        }
        return null;
    }

}