import { BoundingShape } from "./BoundingShape";
import { Utility } from "../../../utility/Utility";
import { Scene } from "../../../core/Scene";

export class SphereBoundingShape extends BoundingShape {

    private radius: number;

    public isInsideMainCameraFrustum(): boolean {
        const camera = Scene.getParameters().getValue(Scene.MAIN_CAMERA);
        if (camera.isUsable() && this.isUsable()) {
            const position = this.getRenderableComponent().getGameObject().getTransform().getAbsolutePosition();
            for (const plane of camera.getFrustum().getPlanesIterator()) {
                const distance = plane.computeDistanceFromPlane(position);
                if (distance + this.getRealRadius() < 0) {
                    return false;
                }
            }
        }
        return true;
    }

    private refresh(): void {
        if (!this.isValid()) {
            this.refreshUnsafe();
            this.setValid(true);
        }
    }

    private refreshUnsafe(): void {
        const renderableComponent = this.getRenderableComponent();
        const originalRadius = renderableComponent.getRenderable().getRadius();
        const absoluteScale = renderableComponent.getGameObject().getTransform().getAbsoluteScale();
        this.radius = originalRadius * Utility.getMaxCoordinate(absoluteScale);
    }

    public getOriginalRadius(): number {
        return this.getRenderableComponent().getRenderable().getRadius();
    }

    public getRealRadius(): number {
        if (this.getRenderableComponent().getGameObject() == null) {
            return this.getOriginalRadius();
        } else {
            this.refresh();
            return this.radius;
        }
    }

}